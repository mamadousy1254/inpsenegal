import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import { canManageConvocations } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { listConvocationFilterOptions } from "@/lib/services/convocation/resolve-invitees";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canManageConvocations(role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await connectDB();
    const options = await listConvocationFilterOptions();

    return NextResponse.json(options);
  } catch (error) {
    console.error("GET /api/convocations/options", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des options" },
      { status: 500 },
    );
  }
}
