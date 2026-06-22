import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import {
  GED_DEFAULT_SHARE_LINK_MINUTES,
  isValidGedShareLinkDuration,
} from "@/lib/constants/ged";
import { connectDB } from "@/lib/mongo/db";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import { canAccessGedItem } from "@/lib/services/ged/access";
import { getSignedDownloadUrl } from "@/lib/services/ged/cloudinary-upload";
import { GED_ACTIONS, logGedActivity } from "@/lib/services/ged/log-ged-activity";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const role = session.user.role as UserRole;

    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await connectDB();

    const file = await GedFileModel.findById(id);
    if (!file) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    if (!canAccessGedItem(session.user.id, role, file)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const url = new URL(req.url);
    const requestedMinutes = Number(url.searchParams.get("expiresInMinutes"));
    const skipAudit = url.searchParams.get("audit") === "false";
    const expiresInMinutes = isValidGedShareLinkDuration(requestedMinutes)
      ? requestedMinutes
      : GED_DEFAULT_SHARE_LINK_MINUTES;

    const downloadUrl = getSignedDownloadUrl({
      publicId: file.cloudinaryId,
      resourceType: file.resourceType,
      format: file.format,
      expiresInMinutes,
    });

    if (!skipAudit) {
      await logGedActivity({
        actor: session.user,
        action: GED_ACTIONS.GED_FILE_DOWNLOAD,
        actionType: "read",
        resource: "GedFile",
        resourceId: file._id.toString(),
        description: `Téléchargement du document « ${file.name} »`,
        metadata: {
          fileName: file.name,
          expiresInMinutes,
          path: file.path,
        },
      });
    }

    return NextResponse.json({
      downloadUrl,
      expiresInMinutes,
      name: file.name,
      mimeType: file.mimeType,
    });
  } catch (error) {
    console.error("GET /api/ged/files/[id]/download", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du lien" },
      { status: 500 },
    );
  }
}
