import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import GedFolderModel from "@/lib/mongo/models/ged-folder.model";
import {
  buildGedAccessFilter,
  canAccessGedItem,
} from "@/lib/services/ged/access";
import {
  serializeGedFile,
  serializeGedFolder,
} from "@/lib/services/ged/serialize-ged";
import { enrichGedFileWithImageUrls } from "@/lib/services/ged/enrich-ged-file";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");

    await connectDB();

    const accessFilter = buildGedAccessFilter(session.user.id, role);
    const parentFilter =
      parentId && mongoose.Types.ObjectId.isValid(parentId)
        ? { parent: parentId }
        : { parent: null };

    if (parentId) {
      const parentFolder = await GedFolderModel.findById(parentId).lean();
      if (!parentFolder) {
        return NextResponse.json(
          { error: "Dossier introuvable" },
          { status: 404 },
        );
      }
      if (!canAccessGedItem(session.user.id, role, parentFolder)) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }
    }

    const [folders, files] = await Promise.all([
      GedFolderModel.find({ ...parentFilter, ...accessFilter })
        .sort({ name: 1 })
        .lean(),
      GedFileModel.find({ ...parentFilter, ...accessFilter })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return NextResponse.json({
      folders: folders.map((f) => serializeGedFolder(f)),
      files: files.map((f) => enrichGedFileWithImageUrls(serializeGedFile(f))),
    });
  } catch (error) {
    console.error("GET /api/ged/contents", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement du dossier" },
      { status: 500 },
    );
  }
}
