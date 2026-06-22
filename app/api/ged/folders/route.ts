import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import GedFolderModel from "@/lib/mongo/models/ged-folder.model";
import {
  buildFolderPath,
  canAccessGedItem,
} from "@/lib/services/ged/access";
import { serializeGedFolder } from "@/lib/services/ged/serialize-ged";
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

    const body = await req.json();
    const name = body.name?.trim();
    const parentId = body.parentId ?? null;

    if (!name) {
      return NextResponse.json(
        { error: "Le nom du dossier est requis" },
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

    const path = buildFolderPath(parentPath, name);

    const duplicate = await GedFolderModel.findOne({
      name,
      parent: parentId || null,
      "owner._id": session.user.id,
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "Un dossier avec ce nom existe déjà" },
        { status: 409 },
      );
    }

    const folder = await GedFolderModel.create({
      name,
      path,
      itemType: "folder",
      owner: buildGedOwnerFromSession(session),
      parent: parentId || null,
      isPublic: false,
      sharedWith: [],
    });

    await logGedActivity({
      actor: session.user,
      action: GED_ACTIONS.GED_FOLDER_CREATE,
      actionType: "create",
      resource: "GedFolder",
      resourceId: folder._id.toString(),
      description: `Création du dossier « ${name} »`,
      metadata: {
        folderName: name,
        path,
        parentPath: parentPath ?? "/",
      },
    });

    return NextResponse.json(serializeGedFolder(folder), { status: 201 });
  } catch (error) {
    console.error("POST /api/ged/folders", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du dossier" },
      { status: 500 },
    );
  }
}
