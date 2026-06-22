import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import GedFolderModel from "@/lib/mongo/models/ged-folder.model";
import {
  canAccessGedItem,
  canModifyGedItem,
} from "@/lib/services/ged/access";
import { serializeGedFolder } from "@/lib/services/ged/serialize-ged";
import { GED_ACTIONS, logGedActivity } from "@/lib/services/ged/log-ged-activity";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

async function updateChildPaths(oldPath: string, newPath: string) {
  const escaped = oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const childFolders = await GedFolderModel.find({
    path: { $regex: `^${escaped}/` },
  });

  for (const child of childFolders) {
    child.path = child.path.replace(oldPath, newPath);
    await child.save();
  }

  const childFiles = await GedFileModel.find({
    path: { $regex: `^${escaped}/` },
  });

  for (const child of childFiles) {
    child.path = child.path.replace(oldPath, newPath);
    await child.save();
  }
}

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

    const folder = await GedFolderModel.findById(id);
    if (!folder) {
      return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
    }

    if (!canModifyGedItem(session.user.id, role, folder)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const previousName = folder.name;
    const oldPath = folder.path;
    const parentPath = folder.parent
      ? ((await GedFolderModel.findById(folder.parent))?.path ?? "/")
      : null;
    const newPath =
      parentPath && parentPath !== "/"
        ? `${parentPath}/${name}`
        : `/${name}`;

    folder.name = name;
    folder.path = newPath;
    await folder.save();
    await updateChildPaths(oldPath, newPath);

    await logGedActivity({
      actor: session.user,
      action: GED_ACTIONS.GED_FOLDER_UPDATE,
      actionType: "update",
      resource: "GedFolder",
      resourceId: folder._id.toString(),
      description: `Renommage du dossier « ${previousName} » en « ${name} »`,
      metadata: {
        folderName: name,
        previousName,
        newName: name,
        path: newPath,
      },
    });

    return NextResponse.json(serializeGedFolder(folder));
  } catch (error) {
    console.error("PATCH /api/ged/folders/[id]", error);
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

    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await connectDB();

    const folder = await GedFolderModel.findById(id);
    if (!folder) {
      return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
    }

    if (!canModifyGedItem(session.user.id, role, folder)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const deletedName = folder.name;
    const deletedPath = folder.path;

    const [childFolders, childFiles] = await Promise.all([
      GedFolderModel.countDocuments({ parent: id }),
      GedFileModel.countDocuments({ parent: id }),
    ]);

    if (childFolders > 0 || childFiles > 0) {
      return NextResponse.json(
        { error: "Le dossier n'est pas vide" },
        { status: 400 },
      );
    }

    await folder.deleteOne();

    await logGedActivity({
      actor: session.user,
      action: GED_ACTIONS.GED_FOLDER_DELETE,
      actionType: "delete",
      resource: "GedFolder",
      resourceId: id,
      description: `Suppression du dossier « ${deletedName} »`,
      metadata: {
        folderName: deletedName,
        path: deletedPath,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/ged/folders/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}
