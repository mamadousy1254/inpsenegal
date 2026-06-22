import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import { canManageConvocations } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import {
  canUserManageConvocation,
  serializeConvocation,
} from "@/lib/services/convocation/serialize-convocation";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { minutes } = body as { minutes?: string };

    await connectDB();

    const convocation = await ConvocationModel.findById(id);
    if (!convocation) {
      return NextResponse.json({ error: "Convocation introuvable" }, { status: 404 });
    }

    const role = session.user.role as UserRole;
    const canManage = canManageConvocations(role);

    if (!canUserManageConvocation(session.user.id, convocation, canManage)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (convocation.status === "archivee") {
      return NextResponse.json({ error: "Déjà archivée" }, { status: 400 });
    }

    if (minutes?.trim()) {
      convocation.minutes = minutes.trim();
    }

    convocation.status = "archivee";
    convocation.archivedAt = new Date();

    await convocation.save();

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.CONVOCATION_ARCHIVE,
        actionType: "export",
        resource: "convocation",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.CONVOCATION_ARCHIVE],
      });
    } catch (auditError) {
      console.error("Erreur journal activité (convocation.archive):", auditError);
    }

    return NextResponse.json(serializeConvocation(convocation));
  } catch (error) {
    console.error("POST /api/convocations/[id]/archive", error);
    return NextResponse.json(
      { error: "Erreur lors de l'archivage" },
      { status: 500 },
    );
  }
}
