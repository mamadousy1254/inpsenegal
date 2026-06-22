import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import {
  CONVOCATION_LOCATION_TYPES,
} from "@/lib/constants/convocation";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import { canManageConvocations } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import {
  canUserManageConvocation,
  canViewFullConvocationDetails,
  isConvocationInvitee,
  serializeConvocation,
  serializeConvocationForViewer,
} from "@/lib/services/convocation/serialize-convocation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
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

    const role = session.user.role as UserRole;
    const isInvitee = isConvocationInvitee(session.user.id, convocation);
    const canViewFull = canViewFullConvocationDetails(
      role,
      session.user.id,
      convocation,
    );

    if (!canViewFull && !isInvitee) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (!canViewFull && isInvitee && convocation.status === "brouillon") {
      return NextResponse.json(
        { error: "Cette convocation n'est pas encore disponible" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      serializeConvocationForViewer(convocation, {
        id: session.user.id,
        role,
      }),
    );
  } catch (error) {
    console.error("GET /api/convocations/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
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

    const role = session.user.role as UserRole;
    const canManage = canManageConvocations(role);

    if (
      !canUserManageConvocation(session.user.id, convocation, canManage) ||
      convocation.status !== "brouillon"
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      meetingAt,
      locationType,
      location,
      visioLink,
      agenda,
      preparatoryDocuments,
      notifyChannel,
      minutes,
    } = body;

    if (title?.trim()) convocation.title = title.trim();
    if (meetingAt && !Number.isNaN(Date.parse(meetingAt))) {
      convocation.meetingAt = new Date(meetingAt);
    }
    if (locationType && CONVOCATION_LOCATION_TYPES.includes(locationType)) {
      convocation.locationType = locationType;
    }
    if (location !== undefined) convocation.location = location?.trim();
    if (visioLink !== undefined) convocation.visioLink = visioLink?.trim();
    if (agenda?.trim()) convocation.agenda = agenda.trim();
    if (notifyChannel === "sms" || notifyChannel === "email") {
      convocation.notifyChannel = notifyChannel;
    }
    if (minutes !== undefined) convocation.minutes = minutes?.trim();

    if (Array.isArray(preparatoryDocuments)) {
      convocation.preparatoryDocuments = preparatoryDocuments
        .filter((doc: { name?: string }) => doc?.name?.trim())
        .map((doc: { name: string; gedFileId?: string; url?: string }) => ({
          name: doc.name.trim(),
          gedFileId:
            doc.gedFileId && mongoose.Types.ObjectId.isValid(doc.gedFileId)
              ? new mongoose.Types.ObjectId(doc.gedFileId)
              : undefined,
          url: doc.url?.trim(),
        }));
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
        action: ACTIONS.CONVOCATION_UPDATE,
        actionType: "update",
        resource: "convocation",
        resourceId: convocation._id.toString(),
        description: ACTION_LABELS[ACTIONS.CONVOCATION_UPDATE],
      });
    } catch (auditError) {
      console.error("Erreur journal activité (convocation.update):", auditError);
    }

    return NextResponse.json(serializeConvocation(convocation));
  } catch (error) {
    console.error("PATCH /api/convocations/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
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

    const role = session.user.role as UserRole;
    const canManage = canManageConvocations(role);

    if (
      !canUserManageConvocation(session.user.id, convocation, canManage) ||
      convocation.status !== "brouillon"
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await convocation.deleteOne();

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.CONVOCATION_DELETE,
        actionType: "delete",
        resource: "convocation",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.CONVOCATION_DELETE],
      });
    } catch (auditError) {
      console.error("Erreur journal activité (convocation.delete):", auditError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/convocations/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}
