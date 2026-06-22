import { NextResponse } from "next/server";
import {
  CONVOCATION_TARGET_MODES,
  type ConvocationTargetMode,
} from "@/lib/constants/convocation";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import { canManageConvocations } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { resolveConvocationInvitees } from "@/lib/services/convocation/resolve-invitees";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canManageConvocations(role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetMode = searchParams.get("targetMode") as ConvocationTargetMode | null;
    const service = searchParams.get("service") ?? undefined;
    const direction = searchParams.get("direction") ?? undefined;
    const section = searchParams.get("section") ?? undefined;
    const userIds = searchParams.getAll("userId");

    if (
      !targetMode ||
      !CONVOCATION_TARGET_MODES.includes(targetMode)
    ) {
      return NextResponse.json(
        { error: "Mode de ciblage invalide" },
        { status: 400 },
      );
    }

    await connectDB();

    const invitees = await resolveConvocationInvitees({
      targetMode,
      service,
      direction,
      section,
      userIds: userIds.length ? userIds : undefined,
    });

    return NextResponse.json({
      count: invitees.length,
      invitees: invitees.map((invitee) => ({
        userId: invitee.userId.toString(),
        fullname: invitee.fullname,
        email: invitee.email,
        phone: invitee.phone,
        service: invitee.service,
        direction: invitee.direction,
        section: invitee.section,
      })),
    });
  } catch (error) {
    console.error("GET /api/convocations/preview-invitees", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des convoqués" },
      { status: 500 },
    );
  }
}
