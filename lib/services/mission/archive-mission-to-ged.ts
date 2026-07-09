import mongoose from "mongoose";

import GedFileModel from "@/lib/mongo/models/ged-file.model";
import GedFolderModel from "@/lib/mongo/models/ged-folder.model";
import type { IGedOwnerSnapshot } from "@/lib/mongo/models/ged-folder.model";
import type { IMission, IMissionAttachment } from "@/lib/mongo/models/mission.model";
import UserModel from "@/lib/mongo/models/user.model";
import { buildFolderPath } from "@/lib/services/ged/access";
import { GED_ACTIONS, logGedActivity } from "@/lib/services/ged/log-ged-activity";

type ArchiveMissionToGedInput = {
  mission: IMission;
  actor: {
    id: string;
    email?: string | null;
    firstname: string;
    lastname: string;
  };
};

function guessMimeType(name: string, mimeType?: string): string {
  if (mimeType) return mimeType;
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function guessFormat(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.at(-1)!.toLowerCase() : "bin";
}

function collectAttachments(mission: IMission): IMissionAttachment[] {
  const items: IMissionAttachment[] = [...(mission.attachments ?? [])];

  for (const photo of mission.photosTerrain ?? []) {
    items.push(photo);
  }

  if (mission.rapport) {
    items.push(...(mission.rapport.photosRapport ?? []));
    items.push(...(mission.rapport.documentsRapport ?? []));
  }

  return items;
}

async function resolveGedOwner(mission: IMission): Promise<IGedOwnerSnapshot> {
  const creator = await UserModel.findById(mission.createdById)
    .select("firstname lastname avatar")
    .lean();

  return {
    _id: mission.createdById,
    name: creator
      ? `${creator.firstname ?? ""} ${creator.lastname ?? ""}`.trim()
      : "INP Missions",
    avatar: creator?.avatar,
  };
}

async function ensureMissionFolder(
  mission: IMission,
  owner: IGedOwnerSnapshot,
): Promise<mongoose.Types.ObjectId> {
  let root = await GedFolderModel.findOne({ path: "/Missions", parent: null });
  if (!root) {
    root = await GedFolderModel.create({
      name: "Missions",
      path: "/Missions",
      itemType: "folder",
      owner,
      parent: null,
      isPublic: false,
      sharedWith: [],
      description: "Archives des ordres de mission",
    });
  }

  const folderPath = buildFolderPath("/Missions", mission.numero);
  let folder = await GedFolderModel.findOne({ path: folderPath });
  if (!folder) {
    folder = await GedFolderModel.create({
      name: mission.numero,
      path: folderPath,
      itemType: "folder",
      owner,
      parent: root._id,
      isPublic: false,
      sharedWith: [],
      description: mission.objet,
    });
  }

  return folder._id;
}

async function registerAttachmentInGed(input: {
  attachment: IMissionAttachment;
  folderId: mongoose.Types.ObjectId;
  folderPath: string;
  owner: IGedOwnerSnapshot;
  mission: IMission;
  actor: ArchiveMissionToGedInput["actor"];
}): Promise<mongoose.Types.ObjectId | null> {
  const { attachment, folderId, folderPath, owner, mission, actor } = input;

  if (!attachment.publicId) return null;

  const existing = await GedFileModel.findOne({ cloudinaryId: attachment.publicId }).select(
    "_id",
  );
  if (existing) return existing._id;

  const logicalPath = buildFolderPath(folderPath, attachment.name);
  const gedFile = await GedFileModel.create({
    name: attachment.name,
    size: attachment.bytes ?? 0,
    mimeType: guessMimeType(attachment.name, attachment.mimeType),
    itemType: "file",
    path: logicalPath,
    owner,
    parent: folderId,
    isPublic: false,
    sharedWith: [],
    tags: ["mission", mission.numero, attachment.type],
    cloudinaryId: attachment.publicId,
    format: guessFormat(attachment.name),
    resourceType: attachment.mimeType?.startsWith("image/") ? "image" : "raw",
    secureUrl: attachment.url,
  });

  await logGedActivity({
    actor: {
      id: actor.id,
      email: actor.email ?? "",
      firstname: actor.firstname,
      lastname: actor.lastname,
    },
    action: GED_ACTIONS.GED_FILE_UPLOAD,
    actionType: "create",
    resource: "GedFile",
    resourceId: gedFile._id.toString(),
    description: `Archivage mission ${mission.numero} — ${attachment.name}`,
    metadata: {
      missionId: mission._id.toString(),
      missionNumero: mission.numero,
      fileName: attachment.name,
      path: logicalPath,
    },
  });

  return gedFile._id;
}

export async function archiveMissionToGed(
  input: ArchiveMissionToGedInput,
): Promise<string[]> {
  const { mission, actor } = input;
  const owner = await resolveGedOwner(mission);
  const folderId = await ensureMissionFolder(mission, owner);
  const folder = await GedFolderModel.findById(folderId).select("path").lean();
  const folderPath = folder?.path ?? `/Missions/${mission.numero}`;

  const archivedIds = new Set(
    (mission.gedFileIds ?? []).map((id) => id.toString()),
  );

  for (const attachment of collectAttachments(mission)) {
    const gedId = await registerAttachmentInGed({
      attachment,
      folderId,
      folderPath,
      owner,
      mission,
      actor,
    });
    if (gedId) archivedIds.add(gedId.toString());
  }

  const nextIds = [...archivedIds].map((id) => new mongoose.Types.ObjectId(id));
  mission.gedFileIds = nextIds;
  await mission.save();

  return [...archivedIds];
}

export async function linkExistingGedFiles(
  mission: IMission,
  gedFileIds: mongoose.Types.ObjectId[],
): Promise<void> {
  if (gedFileIds.length === 0) return;

  const current = new Set((mission.gedFileIds ?? []).map((id) => id.toString()));
  for (const id of gedFileIds) {
    current.add(id.toString());
  }

  mission.gedFileIds = [...current].map((id) => new mongoose.Types.ObjectId(id));
  await mission.save();
}
