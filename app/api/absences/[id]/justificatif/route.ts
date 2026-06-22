import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import AbsenceRequestModel from "@/lib/mongo/models/absence-request.model";
import {
  canViewFullAbsenceDetails,
  isAbsenceValidator,
} from "@/lib/services/absence/serialize-absence";
import { getDelegatorIdsForDelegate } from "@/lib/services/delegation/delegation-service";
import {
  getSignedDownloadUrl,
  getSignedImagePreviewUrls,
} from "@/lib/services/ged/cloudinary-upload";
import type { UserRole } from "@/lib/permissions/roles";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const absence = await AbsenceRequestModel.findById(id).lean();
    if (!absence) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    if (!absence.justificatif?.cloudinaryId) {
      return NextResponse.json(
        { error: "Aucun justificatif joint à cette demande" },
        { status: 404 },
      );
    }

    const role = session.user.role as UserRole;
    const actingForDelegatorIds = await getDelegatorIdsForDelegate(session.user.id);
    const isOwner = absence.requesterId.toString() === session.user.id;
    const isValidator = isAbsenceValidator(
      session.user.id,
      absence,
      actingForDelegatorIds,
    );

    if (
      !isOwner &&
      !isValidator &&
      !canViewFullAbsenceDetails(role, session.user.id, absence)
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const url = getSignedDownloadUrl({
      publicId: absence.justificatif.cloudinaryId,
      resourceType: absence.justificatif.resourceType,
      format: absence.justificatif.format,
      expiresInMinutes: 60,
    });

    const isImage = absence.justificatif.resourceType === "image";
    const preview = isImage
      ? getSignedImagePreviewUrls({
          publicId: absence.justificatif.cloudinaryId,
          format: absence.justificatif.format,
          expiresInMinutes: 60,
        })
      : null;

    return NextResponse.json({
      url,
      previewUrl: preview?.previewUrl,
      thumbnailUrl: preview?.thumbnailUrl,
      filename: absence.justificatif.filename,
    });
  } catch (error) {
    console.error("GET /api/absences/[id]/justificatif", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du lien" },
      { status: 500 },
    );
  }
}
