import mongoose from "mongoose";

import ConvocationModel, {
  type IConvocationInvitee,
} from "@/lib/mongo/models/convocation.model";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import MissionModel from "@/lib/mongo/models/mission.model";
import type { IMissionAttachment } from "@/lib/mongo/models/mission.model";
import { linkExistingGedFiles } from "@/lib/services/mission/archive-mission-to-ged";

export type MissionConvocationPrefill = {
  convocationId: string;
  objet: string;
  description: string;
  type: "reunion" | "formation" | "terrain";
  dateDepart: string;
  dateRetour: string;
  heureDepart: string;
  heureRetour: string;
  adressePrecise: string;
  missionnaireIds: string[];
  chefMissionId: string;
  attachments: IMissionAttachment[];
  gedFileIds: string[];
  agenda: string;
};

function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatTimeInput(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

function inferMissionType(title: string): MissionConvocationPrefill["type"] {
  const lower = title.toLowerCase();
  if (lower.includes("formation")) return "formation";
  if (lower.includes("terrain") || lower.includes("supervision")) return "terrain";
  return "reunion";
}

export async function buildMissionPrefillFromConvocation(
  convocationId: string,
): Promise<MissionConvocationPrefill | null> {
  if (!mongoose.Types.ObjectId.isValid(convocationId)) return null;

  const convocation = await ConvocationModel.findById(convocationId).lean();
  if (!convocation) return null;

  const alreadyLinked = await MissionModel.exists({ convocationId: convocation._id });
  if (alreadyLinked) {
    throw new Error("Cette convocation est déjà liée à une mission");
  }

  const inviteeIds = (convocation.invitees ?? []).map((invitee: IConvocationInvitee) =>
    invitee.userId.toString(),
  );
  const chefMissionId = inviteeIds[0] ?? convocation.createdById.toString();
  const meetingAt = new Date(convocation.meetingAt);

  const attachments: IMissionAttachment[] = [];
  const gedFileIds: mongoose.Types.ObjectId[] = [];

  for (const doc of convocation.preparatoryDocuments ?? []) {
    if (doc.gedFileId) {
      gedFileIds.push(doc.gedFileId);
      const gedFile = await GedFileModel.findById(doc.gedFileId).lean();
      if (gedFile) {
        attachments.push({
          type: "convocation",
          name: doc.name || gedFile.name,
          url: gedFile.secureUrl,
          publicId: gedFile.cloudinaryId,
          mimeType: gedFile.mimeType,
          bytes: gedFile.size,
          uploadedAt: new Date(),
        });
      }
      continue;
    }

    if (doc.url) {
      attachments.push({
        type: "convocation",
        name: doc.name,
        url: doc.url,
        uploadedAt: new Date(),
      });
    }
  }

  const location =
    convocation.locationType === "visio"
      ? convocation.visioLink ?? "Réunion visioconférence"
      : convocation.location ?? "";

  return {
    convocationId: convocation._id.toString(),
    objet: convocation.title,
    description: convocation.agenda,
    type: inferMissionType(convocation.title),
    dateDepart: formatDateInput(meetingAt),
    dateRetour: formatDateInput(meetingAt),
    heureDepart: formatTimeInput(meetingAt),
    heureRetour: "18:00",
    adressePrecise: location,
    missionnaireIds: inviteeIds.length > 0 ? inviteeIds : [chefMissionId],
    chefMissionId,
    attachments,
    gedFileIds: gedFileIds.map((id) => id.toString()),
    agenda: convocation.agenda,
  };
}

export async function applyConvocationLinks(
  missionId: mongoose.Types.ObjectId,
  convocationId: mongoose.Types.ObjectId,
): Promise<void> {
  const prefill = await buildMissionPrefillFromConvocation(convocationId.toString());
  if (!prefill) return;

  const mission = await MissionModel.findById(missionId);
  if (!mission) return;

  if (prefill.gedFileIds.length > 0) {
    await linkExistingGedFiles(
      mission,
      prefill.gedFileIds.map((id) => new mongoose.Types.ObjectId(id)),
    );
  }

  if (prefill.attachments.length > 0 && mission.attachments.length === 0) {
    mission.attachments = prefill.attachments.map((attachment) => ({
      ...attachment,
      type: attachment.type === "convocation" ? "convocation" : attachment.type,
    }));
    await mission.save();
  }
}

export async function listMissionConvocationOptions(limit = 40) {
  const linkedIds = await MissionModel.distinct("convocationId", {
    convocationId: { $exists: true, $ne: null },
  });

  const convocations = await ConvocationModel.find({
    _id: { $nin: linkedIds },
    status: { $in: ["envoyee", "terminee"] },
  })
    .select("title meetingAt location locationType status")
    .sort({ meetingAt: -1 })
    .limit(limit)
    .lean();

  return convocations.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    meetingAt: item.meetingAt.toISOString(),
    location: item.location ?? item.locationType,
    status: item.status,
  }));
}
