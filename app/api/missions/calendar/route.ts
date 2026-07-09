import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { MISSION_STATUSES, MISSION_TYPES } from "@/lib/constants/mission";
import { connectDB } from "@/lib/mongo/db";
import MissionModel from "@/lib/mongo/models/mission.model";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { buildMissionListFilter } from "@/lib/services/mission/mission-list-filter.server";
import { resolveMissionSessionUser } from "@/lib/services/mission/resolve-mission-session-user.server";
import { serializeMissionCalendarItem } from "@/lib/services/mission/serialize-mission-calendar";

function parseMonthParam(value: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

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
    const monthParam = searchParams.get("month")?.trim() ?? "";
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const type = searchParams.get("type")?.trim() ?? "";
    const region = searchParams.get("region")?.trim() ?? "";
    const directionFilter = searchParams.get("direction")?.trim() ?? "";
    const scope = (searchParams.get("scope") ?? "mine") as "all" | "mine";

    const now = new Date();
    const parsedMonth = parseMonthParam(monthParam) ?? {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    };

    const rangeStart = new Date(parsedMonth.year, parsedMonth.month - 1, 1, 0, 0, 0, 0);
    const rangeEnd = new Date(parsedMonth.year, parsedMonth.month, 0, 23, 59, 59, 999);

    await connectDB();

    const sessionUser = await resolveMissionSessionUser({
      id: session.user.id,
      role,
    });

    if (!sessionUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const accessFilter = buildMissionListFilter(sessionUser, scope);

    const filter: Record<string, unknown> = {
      ...accessFilter,
      dateDepart: { $lte: rangeEnd },
      dateRetour: { $gte: rangeStart },
    };

    if (status && MISSION_STATUSES.includes(status as (typeof MISSION_STATUSES)[number])) {
      filter.status = status;
    }

    if (type && MISSION_TYPES.includes(type as (typeof MISSION_TYPES)[number])) {
      filter.type = type;
    }

    if (region) {
      filter.region = new RegExp(region.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }

    if (directionFilter) {
      filter.direction = new RegExp(
        directionFilter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$and = [
        ...(Array.isArray(filter.$and) ? filter.$and : []),
        {
          $or: [
            { numero: regex },
            { objet: regex },
            { region: regex },
            { departement: regex },
            { commune: regex },
            { "missionnaires.fullname": regex },
          ],
        },
      ];
    }

    const items = await MissionModel.find(filter)
      .sort({ dateDepart: 1 })
      .select(
        "numero objet type status dateDepart dateRetour pays region departement commune village chefMissionId missionnaires",
      )
      .lean();

    return NextResponse.json({
      month: `${parsedMonth.year}-${String(parsedMonth.month).padStart(2, "0")}`,
      rangeStart: rangeStart.toISOString(),
      rangeEnd: rangeEnd.toISOString(),
      items: items.map((item) => serializeMissionCalendarItem(item)),
      total: items.length,
    });
  } catch (error) {
    console.error("GET /api/missions/calendar", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du calendrier" },
      { status: 500 },
    );
  }
}
