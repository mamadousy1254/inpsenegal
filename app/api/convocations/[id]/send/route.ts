import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import { canManageConvocations } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import { sendConvocation } from "@/lib/services/convocation/send-convocation";
import {
  canUserManageConvocation,
  serializeConvocation,
} from "@/lib/services/convocation/serialize-convocation";
import ConvocationModel from "@/lib/mongo/models/convocation.model";

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

    const existing = await ConvocationModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Convocation introuvable" }, { status: 404 });
    }

    const role = session.user.role as UserRole;
    const canManage = canManageConvocations(role);

    if (!canUserManageConvocation(session.user.id, existing, canManage)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { convocation, notificationResults } = await sendConvocation(id);

    const successCount = notificationResults.filter((r) => r.success).length;

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.CONVOCATION_SEND,
        actionType: "share",
        resource: "convocation",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.CONVOCATION_SEND],
        metadata: {
          successCount,
          total: notificationResults.length,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (convocation.send):", auditError);
    }

    return NextResponse.json({
      ...serializeConvocation(convocation),
      notificationResults,
    });
  } catch (error) {
    console.error("POST /api/convocations/[id]/send", error);
    const message =
      error instanceof Error ? error.message : "Erreur lors de l'envoi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
