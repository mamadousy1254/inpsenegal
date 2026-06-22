import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import {
  ABSENCE_JUSTIFICATIF_CLOUDINARY_FOLDER,
  ABSENCE_JUSTIFICATIF_MAX_BYTES,
  ABSENCE_JUSTIFICATIF_MIME_TYPES,
} from "@/lib/constants/absence-justificatif";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import {
  getSignedDownloadUrl,
  getSignedImagePreviewUrls,
  uploadToCloudinary,
} from "@/lib/services/ged/cloudinary-upload";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    if (file.size > ABSENCE_JUSTIFICATIF_MAX_BYTES) {
      return NextResponse.json(
        { error: "Le fichier ne doit pas dépasser 10 Mo" },
        { status: 400 },
      );
    }

    if (
      !ABSENCE_JUSTIFICATIF_MIME_TYPES.includes(
        file.type as (typeof ABSENCE_JUSTIFICATIF_MIME_TYPES)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé (PDF, JPG ou PNG uniquement)" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToCloudinary({
      buffer,
      folder: ABSENCE_JUSTIFICATIF_CLOUDINARY_FOLDER,
      filename: file.name,
    });

    const signedUrl = getSignedDownloadUrl({
      publicId: uploadResult.publicId,
      resourceType: uploadResult.resourceType,
      format: uploadResult.format,
      expiresInMinutes: 60,
    });

    const preview =
      uploadResult.resourceType === "image"
        ? getSignedImagePreviewUrls({
            publicId: uploadResult.publicId,
            format: uploadResult.format,
            expiresInMinutes: 60,
          })
        : null;

    return NextResponse.json({
      justificatif: {
        url: uploadResult.secureUrl,
        cloudinaryId: uploadResult.publicId,
        filename: file.name,
        format: uploadResult.format,
        resourceType: uploadResult.resourceType,
        bytes: uploadResult.bytes,
        signedUrl,
        previewUrl: preview?.previewUrl,
        thumbnailUrl: preview?.thumbnailUrl,
      },
    });
  } catch (error) {
    console.error("POST /api/absences/justificatif", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload du justificatif",
      },
      { status: 500 },
    );
  }
}
