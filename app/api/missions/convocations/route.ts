import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { listMissionConvocationOptions } from "@/lib/services/mission/convocation-integration";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await connectDB();
    const items = await listMissionConvocationOptions();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/missions/convocations", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des convocations" },
      { status: 500 },
    );
  }
}
