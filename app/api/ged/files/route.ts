import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import {
  GED_ALLOWED_MIME_TYPES,
  GED_MAX_FILE_SIZE_BYTES,
} from "@/lib/constants/ged";
import { connectDB } from "@/lib/mongo/db";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import GedFolderModel from "@/lib/mongo/models/ged-folder.model";
import {
  buildFolderPath,
  canAccessGedItem,
  toCloudinaryFolder,
} from "@/lib/services/ged/access";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/lib/services/ged/cloudinary-upload";
import { serializeGedFile } from "@/lib/services/ged/serialize-ged";
import { enrichGedFileWithImageUrls } from "@/lib/services/ged/enrich-ged-file";
import { buildGedOwnerFromSession } from "@/lib/services/ged/session-owner";
import { GED_ACTIONS, logGedActivity } from "@/lib/services/ged/log-ged-activity";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

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
    const parentId = formData.get("parentId")?.toString() || null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    if (file.size > GED_MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Le fichier ne doit pas dépasser 10 Mo" },
        { status: 400 },
      );
    }

    if (
      !GED_ALLOWED_MIME_TYPES.includes(
        file.type as (typeof GED_ALLOWED_MIME_TYPES)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé" },
        { status: 400 },
      );
    }

    await connectDB();

    let parentPath: string | null = null;
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return NextResponse.json(
          { error: "Dossier parent invalide" },
          { status: 400 },
        );
      }
      const parentFolder = await GedFolderModel.findById(parentId);
      if (!parentFolder) {
        return NextResponse.json(
          { error: "Dossier parent introuvable" },
          { status: 404 },
        );
      }
      if (!canAccessGedItem(session.user.id, role, parentFolder)) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }
      parentPath = parentFolder.path;
    }

    const logicalPath = buildFolderPath(parentPath, file.name);
    const cloudinaryFolder = toCloudinaryFolder(
      parentPath ? parentPath : "/general",
    );

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToCloudinary({
      buffer,
      folder: cloudinaryFolder,
      filename: file.name,
    });

    const gedFile = await GedFileModel.create({
      name: file.name,
      size: file.size,
      mimeType: file.type,
      itemType: "file",
      path: logicalPath,
      owner: buildGedOwnerFromSession(session),
      parent: parentId || null,
      isPublic: false,
      sharedWith: [],
      tags: [],
      cloudinaryId: uploadResult.publicId,
      cloudinaryFolder: uploadResult.folder,
      format: uploadResult.format,
      resourceType: uploadResult.resourceType,
      secureUrl: uploadResult.secureUrl,
      thumbnailUrl: uploadResult.thumbnailUrl,
    });

    await logGedActivity({
      actor: session.user,
      action: GED_ACTIONS.GED_FILE_UPLOAD,
      actionType: "create",
      resource: "GedFile",
      resourceId: gedFile._id.toString(),
      description: `Upload du document « ${file.name} »`,
      metadata: {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        path: logicalPath,
        parentPath: parentPath ?? "/",
      },
    });

    return NextResponse.json(
      enrichGedFileWithImageUrls(serializeGedFile(gedFile)),
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/ged/files", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload",
      },
      { status: 500 },
    );
  }
}
