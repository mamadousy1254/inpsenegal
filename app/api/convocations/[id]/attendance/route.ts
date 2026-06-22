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
  isConvocationInvitee,
  serializeConvocationForViewer,
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

    const body = await req.json();
    const { mode, code, userId, present } = body;

    await connectDB();

    const convocation = await ConvocationModel.findById(id);
    if (!convocation) {
      return NextResponse.json({ error: "Convocation introuvable" }, { status: 404 });
    }

    if (convocation.status !== "envoyee" && convocation.status !== "terminee") {
      return NextResponse.json(
        { error: "L'émargement n'est pas disponible pour cette convocation" },
        { status: 400 },
      );
    }

    const role = session.user.role as UserRole;
    const canManage = canManageConvocations(role);
    const now = new Date();

    if (mode === "code") {
      if (!isConvocationInvitee(session.user.id, convocation)) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }

      if (!code?.trim() || code.trim() !== convocation.attendanceCode) {
        return NextResponse.json({ error: "Code de présence incorrect" }, { status: 400 });
      }

      const invitee = convocation.invitees.find(
        (entry: { userId: { toString(): string } }) =>
          entry.userId.toString() === session.user.id,
      );
      if (!invitee) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }

      invitee.attendedAt = now;
      invitee.attendanceMethod = "code";
      if (invitee.responseStatus === "pending") {
        invitee.responseStatus = "present";
        invitee.responseAt = now;
      }
    } else if (mode === "secretary") {
      if (!canUserManageConvocation(session.user.id, convocation, canManage)) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: "Agent invalide" }, { status: 400 });
      }

      const invitee = convocation.invitees.find(
        (entry: { userId: { toString(): string } }) =>
          entry.userId.toString() === userId,
      );
      if (!invitee) {
        return NextResponse.json({ error: "Agent non convoqué" }, { status: 400 });
      }

      if (present) {
        invitee.attendedAt = now;
        invitee.attendanceMethod = "secretary";
        if (invitee.responseStatus === "pending" || invitee.responseStatus === "present") {
          invitee.responseStatus = "present";
          invitee.responseAt = invitee.responseAt ?? now;
        }
      } else {
        invitee.attendedAt = undefined;
        invitee.attendanceMethod = undefined;
      }
    } else {
      return NextResponse.json({ error: "Mode d'émargement invalide" }, { status: 400 });
    }

    await convocation.save();

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.CONVOCATION_ATTENDANCE,
        actionType: "validate",
        resource: "convocation",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.CONVOCATION_ATTENDANCE],
        metadata: { mode, userId: userId ?? session.user.id },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (convocation.attendance):", auditError);
    }

    return NextResponse.json(
      serializeConvocationForViewer(convocation, {
        id: session.user.id,
        role,
      }),
    );
  } catch (error) {
    console.error("POST /api/convocations/[id]/attendance", error);
    return NextResponse.json(
      { error: "Erreur lors de l'émargement" },
      { status: 500 },
    );
  }
}
