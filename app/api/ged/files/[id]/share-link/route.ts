import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import {
  GED_DEFAULT_SHARE_LINK_MINUTES,
  isValidGedShareLinkDuration,
} from "@/lib/constants/ged";
import { connectDB } from "@/lib/mongo/db";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import GedShareModel from "@/lib/mongo/models/ged-share.model";
import { canAccessGedItem } from "@/lib/services/ged/access";
import {
  buildGedSharePageUrl,
  generateGedShareAccessToken,
} from "@/lib/services/ged/ged-share-token";
import { GED_ACTIONS, logGedActivity } from "@/lib/services/ged/log-ged-activity";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

const bodySchema = z.object({
  expiresInMinutes: z.coerce
    .number()
    .int()
    .refine(isValidGedShareLinkDuration, "Durée de validité invalide")
    .optional(),
});

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
    const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));

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

    const expiresInMinutes =
      parsed.data.expiresInMinutes ?? GED_DEFAULT_SHARE_LINK_MINUTES;
    const accessToken = generateGedShareAccessToken();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const share = await GedShareModel.create({
      accessToken,
      itemId: file._id,
      itemType: "file",
      sharedBy: new mongoose.Types.ObjectId(session.user.id),
      permission: "read",
      expiresAt,
    });

    await logGedActivity({
      actor: session.user,
      action: GED_ACTIONS.GED_FILE_SHARE,
      actionType: "share",
      resource: "GedFile",
      resourceId: file._id.toString(),
      description: `Création d'un lien de partage pour « ${file.name} »`,
      metadata: {
        fileName: file.name,
        channel: "link",
        expiresInMinutes,
        shareId: share._id.toString(),
        accessToken,
      },
    });

    return NextResponse.json({
      shareUrl: buildGedSharePageUrl(accessToken),
      accessToken,
      expiresAt: expiresAt.toISOString(),
      expiresInMinutes,
    });
  } catch (error) {
    console.error("POST /api/ged/files/[id]/share-link", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du lien de partage" },
      { status: 500 },
    );
  }
}
