import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import {
  canAccessGedItem,
  canModifyGedItem,
} from "@/lib/services/ged/access";
import {
  deleteFromCloudinary,
  getSignedDownloadUrl,
} from "@/lib/services/ged/cloudinary-upload";
import { serializeGedFile } from "@/lib/services/ged/serialize-ged";
import { GED_ACTIONS, logGedActivity } from "@/lib/services/ged/log-ged-activity";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const name = body.name?.trim();
    const role = session.user.role as UserRole;

    if (!name) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }

    await connectDB();

    const file = await GedFileModel.findById(id);
    if (!file) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    if (!canModifyGedItem(session.user.id, role, file)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const previousName = file.name;
    const pathParts = file.path.split("/");
    pathParts[pathParts.length - 1] = name;
    file.name = name;
    file.path = pathParts.join("/") || `/${name}`;
    await file.save();

    await logGedActivity({
      actor: session.user,
      action: GED_ACTIONS.GED_FILE_UPDATE,
      actionType: "update",
      resource: "GedFile",
      resourceId: file._id.toString(),
      description: `Renommage du document « ${previousName} » en « ${name} »`,
      metadata: {
        fileName: name,
        previousName,
        newName: name,
        path: file.path,
      },
    });

    return NextResponse.json(serializeGedFile(file));
  } catch (error) {
    console.error("PATCH /api/ged/files/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors du renommage" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const role = session.user.role as UserRole;

    await connectDB();

    const file = await GedFileModel.findById(id);
    if (!file) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    if (!canModifyGedItem(session.user.id, role, file)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const deletedName = file.name;
    const deletedPath = file.path;

    try {
      await deleteFromCloudinary({
        publicId: file.cloudinaryId,
        resourceType: file.resourceType,
      });
    } catch (cloudinaryError) {
      console.error("Suppression Cloudinary:", cloudinaryError);
    }

    await file.deleteOne();

    await logGedActivity({
      actor: session.user,
      action: GED_ACTIONS.GED_FILE_DELETE,
      actionType: "delete",
      resource: "GedFile",
      resourceId: id,
      description: `Suppression du document « ${deletedName} »`,
      metadata: {
        fileName: deletedName,
        path: deletedPath,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/ged/files/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}
