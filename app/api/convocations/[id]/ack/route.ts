import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import { logActivity } from "@/lib/services/audit/log-activity";
import {
  isConvocationInvitee,
  serializeConvocationForViewer,
} from "@/lib/services/convocation/serialize-convocation";
import type { UserRole } from "@/lib/permissions/roles";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    await connectDB();

    const convocation = await ConvocationModel.findById(id);
    if (!convocation) {
      return NextResponse.json({ error: "Convocation introuvable" }, { status: 404 });
    }

    if (!isConvocationInvitee(session.user.id, convocation)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const invitee = convocation.invitees.find(
      (entry: { userId: { toString(): string } }) =>
        entry.userId.toString() === session.user.id,
    );
    if (!invitee) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (!invitee.ackAt) {
      invitee.ackAt = new Date();
      await convocation.save();

      try {
        await logActivity({
          actor: {
            id: session.user.id,
            email: session.user.email ?? "",
            firstname: session.user.firstname,
            lastname: session.user.lastname,
          },
          action: ACTIONS.CONVOCATION_ACK,
          actionType: "read",
          resource: "convocation",
          resourceId: id,
          description: ACTION_LABELS[ACTIONS.CONVOCATION_ACK],
        });
      } catch (auditError) {
        console.error("Erreur journal activité (convocation.ack):", auditError);
      }
    }

    return NextResponse.json(
      serializeConvocationForViewer(convocation, {
        id: session.user.id,
        role: session.user.role as UserRole,
      }),
    );
  } catch (error) {
    console.error("POST /api/convocations/[id]/ack", error);
    return NextResponse.json(
      { error: "Erreur lors de l'accusé de réception" },
      { status: 500 },
    );
  }
}
