import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import {
  formatGedShareDuration,
} from "@/lib/constants/ged";
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

    const { data } = resolved;
    const durationLabel = data.share.expiresAt
      ? formatGedShareDuration(
          Math.max(
            1,
            Math.round(
              (new Date(data.share.expiresAt).getTime() - Date.now()) / 60_000,
            ),
          ),
        )
      : null;

    return NextResponse.json({
      fileName: data.file.name,
      fileSize: data.file.size,
      mimeType: data.file.mimeType,
      sharerName: data.sharerName,
      expiresAt: data.share.expiresAt,
      durationLabel,
      recipientName: data.share.recipientName ?? null,
    });
  } catch (error) {
    console.error("GET /api/ged/shares/[token]", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture du partage" },
      { status: 500 },
    );
  }
}
