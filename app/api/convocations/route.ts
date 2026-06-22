import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import {
  CONVOCATION_LOCATION_TYPES,
  CONVOCATION_STATUSES,
  CONVOCATION_TARGET_MODES,
  type ConvocationTargetMode,
} from "@/lib/constants/convocation";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import {
  NOTIFIER_CHANNELS,
  type NotifierChannel,
} from "@/lib/constants/notifications";
import { connectDB } from "@/lib/mongo/db";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import {
  canManageConvocations,
  canViewAllConvocations,
} from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import { resolveConvocationInvitees } from "@/lib/services/convocation/resolve-invitees";
import { sendConvocation } from "@/lib/services/convocation/send-convocation";
import {
  serializeConvocation,
  serializeConvocationForViewer,
} from "@/lib/services/convocation/serialize-convocation";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 15)));
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const scope = searchParams.get("scope") ?? "mine";

    await connectDB();

    const role = session.user.role as UserRole;
    const filter: Record<string, unknown> = {};

    if (scope === "archived") {
      filter.status = "archivee";
      if (!canViewAllConvocations(role)) {
        filter.$or = [
          { createdById: new mongoose.Types.ObjectId(session.user.id) },
          { "invitees.userId": new mongoose.Types.ObjectId(session.user.id) },
        ];
      }
    } else if (!canViewAllConvocations(role) || scope === "mine") {
      filter.$or = [
        { createdById: new mongoose.Types.ObjectId(session.user.id) },
        { "invitees.userId": new mongoose.Types.ObjectId(session.user.id) },
      ];
      filter.status = { $ne: "archivee" };
    } else {
      filter.status = { $ne: "archivee" };
    }

    if (
      status &&
      CONVOCATION_STATUSES.includes(status as (typeof CONVOCATION_STATUSES)[number])
    ) {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
      filter.$and = [
        ...(Array.isArray(filter.$and) ? filter.$and : []),
        {
          $or: [{ title: regex }, { agenda: regex }, { location: regex }],
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ConvocationModel.find(filter)
        .sort({ meetingAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ConvocationModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      items: items.map((item) =>
        serializeConvocationForViewer(item, {
          id: session.user.id,
          role,
        }),
      ),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("GET /api/convocations", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des convocations" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canManageConvocations(role)) {
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
      preparatoryDocuments = [],
      notifyChannel = "email",
      targetMode,
      userIds,
      service,
      direction,
      section,
      sendNow = false,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "L'objet est requis" }, { status: 400 });
    }

    if (!meetingAt || Number.isNaN(Date.parse(meetingAt))) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    if (
      !locationType ||
      !CONVOCATION_LOCATION_TYPES.includes(locationType)
    ) {
      return NextResponse.json({ error: "Type de lieu invalide" }, { status: 400 });
    }

    if (locationType === "presentiel" && !location?.trim()) {
      return NextResponse.json(
        { error: "Le lieu est requis en présentiel" },
        { status: 400 },
      );
    }

    if (locationType === "visio" && !visioLink?.trim()) {
      return NextResponse.json(
        { error: "Le lien visio est requis" },
        { status: 400 },
      );
    }

    if (!agenda?.trim()) {
      return NextResponse.json(
        { error: "L'ordre du jour est requis" },
        { status: 400 },
      );
    }

    if (
      !targetMode ||
      !CONVOCATION_TARGET_MODES.includes(targetMode as ConvocationTargetMode)
    ) {
      return NextResponse.json(
        { error: "Mode de ciblage invalide" },
        { status: 400 },
      );
    }

    const resolvedNotifyChannel: NotifierChannel =
      notifyChannel === "sms" ? "sms" : "email";

    await connectDB();

    const invitees = await resolveConvocationInvitees({
      targetMode: targetMode as ConvocationTargetMode,
      userIds,
      service,
      direction,
      section,
    });

    if (!invitees.length) {
      return NextResponse.json(
        { error: "Aucun agent trouvé pour cette sélection" },
        { status: 400 },
      );
    }

    const docs = Array.isArray(preparatoryDocuments)
      ? preparatoryDocuments
          .filter((doc: { name?: string }) => doc?.name?.trim())
          .map((doc: { name: string; gedFileId?: string; url?: string }) => ({
            name: doc.name.trim(),
            gedFileId:
              doc.gedFileId && mongoose.Types.ObjectId.isValid(doc.gedFileId)
                ? new mongoose.Types.ObjectId(doc.gedFileId)
                : undefined,
            url: doc.url?.trim(),
          }))
      : [];

    const convocation = await ConvocationModel.create({
      title: title.trim(),
      meetingAt: new Date(meetingAt),
      locationType,
      location: locationType === "presentiel" ? location?.trim() : undefined,
      visioLink: locationType === "visio" ? visioLink?.trim() : undefined,
      agenda: agenda.trim(),
      preparatoryDocuments: docs,
      status: "brouillon",
      invitees,
      notifyChannel: resolvedNotifyChannel,
      createdById: session.user.id,
      createdByEmail: session.user.email,
      createdByFullname: `${session.user.firstname} ${session.user.lastname}`.trim(),
      secretaryId: session.user.id,
    });

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.CONVOCATION_CREATE,
        actionType: "create",
        resource: "convocation",
        resourceId: convocation._id.toString(),
        description: ACTION_LABELS[ACTIONS.CONVOCATION_CREATE],
        metadata: { title: convocation.title, inviteeCount: invitees.length },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (convocation.create):", auditError);
    }

    if (sendNow) {
      try {
        const { convocation: sent, notificationResults } =
          await sendConvocation(convocation._id.toString());
        return NextResponse.json(
          { ...serializeConvocation(sent), notificationResults },
          { status: 201 },
        );
      } catch (sendError) {
        return NextResponse.json(
          {
            ...serializeConvocation(convocation),
            sendError:
              sendError instanceof Error
                ? sendError.message
                : "Erreur lors de l'envoi",
          },
          { status: 201 },
        );
      }
    }

    return NextResponse.json(serializeConvocation(convocation), { status: 201 });
  } catch (error) {
    console.error("POST /api/convocations", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la convocation" },
      { status: 500 },
    );
  }
}
