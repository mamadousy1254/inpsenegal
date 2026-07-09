import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import MissionModel from "@/lib/mongo/models/mission.model";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { isInternationalMission } from "@/lib/services/mission/compute-mission";
import { computeMissionCharts } from "@/lib/services/mission/compute-mission-charts";
import { buildMissionListFilter } from "@/lib/services/mission/mission-list-filter.server";
import { resolveMissionSessionUser } from "@/lib/services/mission/resolve-mission-session-user.server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const scopeParam = searchParams.get("scope");
    const scope = scopeParam === "mine" ? "mine" : "all";

    await connectDB();

    const sessionUser = await resolveMissionSessionUser({
      id: session.user.id,
      role,
    });

    if (!sessionUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const baseFilter = buildMissionListFilter(sessionUser, scope);
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const [
      enCours,
      aVenir,
      terminees,
      annulees,
      enValidation,
      cetteSemaine,
      ceMois,
      missionsEnCours,
      budgetAgg,
      allForScope,
      charts,
    ] = await Promise.all([
      MissionModel.countDocuments({ ...baseFilter, status: "en_cours" }),
      MissionModel.countDocuments({
        ...baseFilter,
        status: "validee",
        dateDepart: { $gt: now },
      }),
      MissionModel.countDocuments({ ...baseFilter, status: "terminee" }),
      MissionModel.countDocuments({ ...baseFilter, status: "annulee" }),
      MissionModel.countDocuments({ ...baseFilter, status: "en_validation" }),
      MissionModel.countDocuments({
        ...baseFilter,
        status: { $in: ["validee", "en_cours"] },
        dateDepart: { $gte: startOfWeek, $lte: endOfWeek },
      }),
      MissionModel.countDocuments({
        ...baseFilter,
        dateDepart: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
        },
      }),
      MissionModel.find({ ...baseFilter, status: "en_cours" })
        .select("missionnaires chefMissionId")
        .lean(),
      MissionModel.aggregate([
        { $match: baseFilter },
        {
          $group: {
            _id: null,
            budgetConsomme: { $sum: "$budget.budgetConsomme" },
            budgetPrevu: { $sum: "$budget.budgetPrevu" },
          },
        },
      ]),
      MissionModel.find(baseFilter).select("pays status rapport").lean(),
      computeMissionCharts(baseFilter),
    ]);

    const agentIds = new Set<string>();
    for (const m of missionsEnCours) {
      agentIds.add(m.chefMissionId.toString());
      for (const p of m.missionnaires ?? []) {
        agentIds.add(p.userId.toString());
      }
    }

    let internationales = 0;
    let nationales = 0;
    let rapportsManquants = 0;

    for (const m of allForScope) {
      if (isInternationalMission(m.pays)) internationales += 1;
      else nationales += 1;
      if (m.status === "terminee" && !m.rapport?.dateDepot) {
        rapportsManquants += 1;
      }
    }

    const budget = budgetAgg[0] ?? { budgetConsomme: 0, budgetPrevu: 0 };

    return NextResponse.json({
      enCours,
      aVenir,
      terminees,
      annulees,
      enValidation,
      cetteSemaine,
      ceMois,
      agentsEnDeplacement: agentIds.size,
      budgetConsomme: Math.round(budget.budgetConsomme ?? 0),
      budgetRestant: Math.max(
        0,
        Math.round((budget.budgetPrevu ?? 0) - (budget.budgetConsomme ?? 0)),
      ),
      internationales,
      nationales,
      rapportsManquants,
      charts,
    });
  } catch (error) {
    console.error("GET /api/missions/stats", error);
    return NextResponse.json(
      { error: "Erreur lors du calcul des statistiques" },
      { status: 500 },
    );
  }
}
