import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { buildMissionPrefillFromConvocation } from "@/lib/services/mission/convocation-integration";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    await connectDB();

    try {
      const prefill = await buildMissionPrefillFromConvocation(id);
      if (!prefill) {
        return NextResponse.json({ error: "Convocation introuvable" }, { status: 404 });
      }
      return NextResponse.json(prefill);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Convocation indisponible",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("GET /api/missions/convocations/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la convocation" },
      { status: 500 },
    );
  }
}
