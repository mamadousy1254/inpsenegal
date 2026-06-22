import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo/db";
import { GED_SHARE_DOWNLOAD_LINK_MINUTES } from "@/lib/constants/ged";
import { getSignedDownloadUrl } from "@/lib/services/ged/cloudinary-upload";
import { resolveGedShareByToken } from "@/lib/services/ged/resolve-ged-share";

const SHARE_ERROR_MESSAGES = {
  not_found: "Ce lien de partage est introuvable ou invalide.",
  expired: "Ce lien de partage a expiré.",
  unsupported: "Ce type de partage n'est pas pris en charge.",
  file_missing: "Le document partagé n'est plus disponible.",
} as const;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    if (!token?.trim()) {
      return NextResponse.json({ error: "Lien invalide" }, { status: 400 });
    }

    await connectDB();

    const resolved = await resolveGedShareByToken(token.trim());
    if (!resolved.ok) {
      return NextResponse.json(
        { error: SHARE_ERROR_MESSAGES[resolved.error], code: resolved.error },
        { status: resolved.error === "expired" ? 410 : 404 },
      );
    }

    const { file } = resolved.data;

    const downloadUrl = getSignedDownloadUrl({
      publicId: file.cloudinaryId,
      resourceType: file.resourceType,
      format: file.format,
      expiresInMinutes: GED_SHARE_DOWNLOAD_LINK_MINUTES,
    });

    return NextResponse.json({
      downloadUrl,
      name: file.name,
      mimeType: file.mimeType,
      expiresInMinutes: GED_SHARE_DOWNLOAD_LINK_MINUTES,
    });
  } catch (error) {
    console.error("GET /api/ged/shares/[token]/download", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du téléchargement" },
      { status: 500 },
    );
  }
}
