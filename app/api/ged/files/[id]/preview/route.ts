import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import { canAccessGedItem } from "@/lib/services/ged/access";
import { getSignedImagePreviewUrls } from "@/lib/services/ged/cloudinary-upload";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { isGedImageFile } from "@/lib/utils/ged-images";

export async function GET(
  _req: Request,
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
    await connectDB();

    const file = await GedFileModel.findById(id);
    if (!file) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    if (!canAccessGedItem(session.user.id, role, file)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (!isGedImageFile(file)) {
      return NextResponse.json(
        { error: "L'aperçu n'est disponible que pour les images" },
        { status: 400 },
      );
    }

    const urls = getSignedImagePreviewUrls({
      publicId: file.cloudinaryId,
      format: file.format,
    });

    return NextResponse.json({
      name: file.name,
      mimeType: file.mimeType,
      size: file.size,
      thumbnailUrl: urls.thumbnailUrl,
      previewUrl: urls.previewUrl,
    });
  } catch (error) {
    console.error("GET /api/ged/files/[id]/preview", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de l'aperçu" },
      { status: 500 },
    );
  }
}
