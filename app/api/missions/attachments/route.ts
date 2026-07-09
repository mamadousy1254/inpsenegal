import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import {
  MISSION_ATTACHMENT_CLOUDINARY_FOLDER,
  MISSION_ATTACHMENT_MAX_BYTES,
  MISSION_ATTACHMENT_MIME_TYPES,
} from "@/lib/constants/mission-attachments";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { uploadToCloudinary } from "@/lib/services/ged/cloudinary-upload";

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

    if (file.size > MISSION_ATTACHMENT_MAX_BYTES) {
      return NextResponse.json(
        { error: "Le fichier ne doit pas dépasser 10 Mo" },
        { status: 400 },
      );
    }

    if (
      !MISSION_ATTACHMENT_MIME_TYPES.includes(
        file.type as (typeof MISSION_ATTACHMENT_MIME_TYPES)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToCloudinary({
      buffer,
      folder: MISSION_ATTACHMENT_CLOUDINARY_FOLDER,
      filename: file.name,
    });

    return NextResponse.json({
      attachment: {
        name: file.name,
        url: uploadResult.secureUrl,
        publicId: uploadResult.publicId,
        mimeType: file.type,
        bytes: uploadResult.bytes,
      },
    });
  } catch (error) {
    console.error("POST /api/missions/attachments", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload de la pièce jointe",
      },
      { status: 500 },
    );
  }
}
