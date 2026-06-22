import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import type { NotifierChannel } from "@/lib/constants/notifications";
import { connectDB } from "@/lib/mongo/db";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import { canManageConvocations } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import { resendConvocationToInvitee } from "@/lib/services/convocation/resend-convocation-invitee";
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
    const { userId, channel } = body as {
      userId?: string;
      channel?: NotifierChannel;
    };

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Agent invalide" }, { status: 400 });
    }

    await connectDB();

    const existing = await ConvocationModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Convocation introuvable" }, { status: 404 });
    }

    const role = session.user.role as UserRole;
    const canManage = canManageConvocations(role);

    if (!canUserManageConvocation(session.user.id, existing, canManage)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { convocation, result } = await resendConvocationToInvitee({
      convocationId: id,
      inviteeUserId: userId,
      channel,
    });

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.CONVOCATION_RESEND,
        actionType: "share",
        resource: "convocation",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.CONVOCATION_RESEND],
        metadata: {
          inviteeUserId: userId,
          inviteeFullname: result.fullname,
          channel: result.channel,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (convocation.resend):", auditError);
    }

    return NextResponse.json({
      ...serializeConvocation(convocation),
      resendResult: result,
    });
  } catch (error) {
    console.error("POST /api/convocations/[id]/resend", error);
    const message =
      error instanceof Error ? error.message : "Erreur lors du renvoi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
