import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import {
  GED_DEFAULT_SHARE_LINK_MINUTES,
  formatGedShareDuration,
  isValidGedShareLinkDuration,
} from "@/lib/constants/ged";
import { isValidSenegalPhone } from "@/lib/constants/phone";
import { connectDB } from "@/lib/mongo/db";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import UserModel from "@/lib/mongo/models/user.model";
import { canAccessGedItem } from "@/lib/services/ged/access";
import {
  buildGedSharePageUrl,
} from "@/lib/services/ged/ged-share-token";
import { persistGedShare } from "@/lib/services/ged/persist-ged-share";
import { sendMessageEmail } from "@/lib/services/notifications/send-message-email";
import { sendMessageSms } from "@/lib/services/notifications/send-message-sms";
import { GED_ACTIONS, logGedActivity } from "@/lib/services/ged/log-ged-activity";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

const SMS_MAX_LENGTH = 480;

const expiresInMinutesSchema = z.coerce
  .number()
  .int()
  .refine(isValidGedShareLinkDuration, "Durée de validité invalide")
  .optional();

const shareSchema = z.union([
  z.object({
    recipientMode: z.literal("user"),
    userId: z.string().trim().min(1, "Collaborateur requis"),
    channel: z.literal("email"),
    message: z.string().trim().max(2000).optional(),
    expiresInMinutes: expiresInMinutesSchema,
  }),
  z.object({
    recipientMode: z.literal("user"),
    userId: z.string().trim().min(1, "Collaborateur requis"),
    channel: z.literal("sms"),
    message: z.string().trim().max(SMS_MAX_LENGTH).optional(),
    expiresInMinutes: expiresInMinutesSchema,
  }),
  z.object({
    recipientMode: z.literal("manual"),
    channel: z.literal("email"),
    recipientName: z.string().trim().min(1, "Le nom du destinataire est requis"),
    email: z.string().email("E-mail invalide"),
    message: z.string().trim().max(2000).optional(),
    expiresInMinutes: expiresInMinutesSchema,
  }),
  z.object({
    recipientMode: z.literal("manual"),
    channel: z.literal("sms"),
    recipientName: z.string().trim().min(1, "Le nom du destinataire est requis"),
    phone: z.string().trim().min(1, "Le numéro est requis"),
    message: z.string().trim().max(SMS_MAX_LENGTH).optional(),
    expiresInMinutes: expiresInMinutesSchema,
  }),
]);

type ResolvedShareRecipient = {
  recipientName: string;
  email?: string;
  phone?: string;
  sharedWith?: mongoose.Types.ObjectId;
};

async function resolveShareRecipient(
  payload: z.infer<typeof shareSchema>,
  sharerId: string,
): Promise<{ recipient: ResolvedShareRecipient } | { error: string; status: number }> {
  if (payload.recipientMode === "user") {
    if (!mongoose.Types.ObjectId.isValid(payload.userId)) {
      return { error: "Collaborateur invalide", status: 400 };
    }

    if (payload.userId === sharerId) {
      return {
        error: "Vous ne pouvez pas partager un document avec vous-même",
        status: 400,
      };
    }

    const user = await UserModel.findById(payload.userId)
      .select("firstname lastname email phone isActive role")
      .lean();

    if (!user || !user.isActive || user.role === "partenaire") {
      return { error: "Collaborateur introuvable", status: 404 };
    }

    const recipientName = `${user.firstname} ${user.lastname}`.trim();

    if (payload.channel === "email") {
      return {
        recipient: {
          recipientName,
          email: user.email,
          sharedWith: new mongoose.Types.ObjectId(payload.userId),
        },
      };
    }

    if (!user.phone || !isValidSenegalPhone(user.phone)) {
      return {
        error:
          "Ce collaborateur n'a pas de numéro SMS valide (+221…). Utilisez l'e-mail ou la saisie manuelle.",
        status: 400,
      };
    }

    return {
      recipient: {
        recipientName,
        phone: user.phone,
        sharedWith: new mongoose.Types.ObjectId(payload.userId),
      },
    };
  }

  if (payload.channel === "email") {
    return {
      recipient: {
        recipientName: payload.recipientName,
        email: payload.email,
      },
    };
  }

  if (!isValidSenegalPhone(payload.phone)) {
    return {
      error:
        "Numéro invalide. Il doit commencer par +221 suivi de 9 chiffres.",
      status: 400,
    };
  }

  return {
    recipient: {
      recipientName: payload.recipientName,
      phone: payload.phone,
    },
  };
}

function buildEmailBody(input: {
  fileName: string;
  sharerName: string;
  shareUrl: string;
  durationLabel: string;
  customMessage?: string;
}) {
  const lines = [
    `${input.sharerName} vous partage un document depuis la GED INP.`,
    "",
    `Document : ${input.fileName}`,
  ];

  if (input.customMessage?.trim()) {
    lines.push("", input.customMessage.trim());
  }

  lines.push(
    "",
    `Accédez au document via le lien ci-dessous (valide ${input.durationLabel}) :`,
    input.shareUrl,
  );

  return lines.join("\n");
}

function buildSmsBody(input: {
  fileName: string;
  sharerName: string;
  shareUrl: string;
  recipientName: string;
  durationLabel: string;
  customMessage?: string;
}) {
  const intro = `Bonjour ${input.recipientName}, ${input.sharerName} partage "${input.fileName}" via GED INP.`;
  const note = input.customMessage?.trim()
    ? ` ${input.customMessage.trim()}`
    : "";
  return `${intro}${note} Lien (${input.durationLabel}): ${input.shareUrl}`.slice(
    0,
    SMS_MAX_LENGTH,
  );
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const parsed = shareSchema.safeParse(await req.json());

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Données invalides";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    await connectDB();

    const file = await GedFileModel.findById(id);
    if (!file) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    if (!canAccessGedItem(session.user.id, role, file)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const payload = parsed.data;
    const expiresInMinutes =
      payload.expiresInMinutes ?? GED_DEFAULT_SHARE_LINK_MINUTES;
    const durationLabel = formatGedShareDuration(expiresInMinutes);

    const resolved = await resolveShareRecipient(payload, session.user.id);
    if ("error" in resolved) {
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status },
      );
    }

    const { recipient } = resolved;
    const channel = payload.channel;

    const shareRecord = {
      itemId: file._id,
      itemType: "file" as const,
      sharedBy: new mongoose.Types.ObjectId(session.user.id),
      sharedWith: recipient.sharedWith,
      channel,
      recipientName: recipient.recipientName,
      recipientEmail: channel === "email" ? recipient.email : undefined,
      recipientPhone: channel === "sms" ? recipient.phone : undefined,
      permission: "read" as const,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    };

    const { accessToken, alreadyShared } = await persistGedShare(shareRecord);
    const shareUrl = buildGedSharePageUrl(accessToken);

    const sharerName =
      `${session.user.firstname ?? ""} ${session.user.lastname ?? ""}`.trim() ||
      session.user.email ||
      "Un collaborateur";

    if (channel === "email") {
      await sendMessageEmail({
        email: recipient.email!,
        fullname: recipient.recipientName,
        subject: `Document partagé — ${file.name}`,
        message: buildEmailBody({
          fileName: file.name,
          sharerName,
          shareUrl,
          durationLabel,
          customMessage: payload.message,
        }),
      });
    } else {
      await sendMessageSms({
        phone: recipient.phone!,
        message: buildSmsBody({
          fileName: file.name,
          sharerName,
          shareUrl,
          recipientName: recipient.recipientName,
          durationLabel,
          customMessage: payload.message,
        }),
      });
    }

    const channelLabel = channel === "email" ? "e-mail" : "SMS";

    await logGedActivity({
      actor: session.user,
      action: GED_ACTIONS.GED_FILE_SHARE,
      actionType: "share",
      resource: "GedFile",
      resourceId: file._id.toString(),
      description: `Partage du document « ${file.name} » par ${channel}`,
      metadata: {
        fileName: file.name,
        channel,
        recipientName: recipient.recipientName,
        recipientMode: payload.recipientMode,
        expiresInMinutes,
        shareUrl,
        accessToken,
        ...(recipient.sharedWith
          ? { recipientUserId: recipient.sharedWith.toString() }
          : {}),
        ...(channel === "email"
          ? { recipientEmail: recipient.email }
          : { recipientPhone: recipient.phone }),
      },
    });

    return NextResponse.json({
      alreadyShared,
      shareUrl,
      message: alreadyShared
        ? `Ce document avait déjà été partagé avec ${recipient.recipientName}. Un nouveau lien a été renvoyé par ${channelLabel}.`
        : channel === "email"
          ? "Document partagé par e-mail"
          : "Document partagé par SMS",
    });
  } catch (error) {
    console.error("POST /api/ged/files/[id]/share", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors du partage",
      },
      { status: 500 },
    );
  }
}
