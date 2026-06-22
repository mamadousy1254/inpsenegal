import { connectDB } from "@/lib/mongo/db";
import RecrutementModel from "@/lib/mongo/models/recrutement.model";
import {
  serializeRecrutement,
  toPublicRecrutementItem,
  type PublicRecrutementItem,
} from "@/lib/services/recrutement/serialize-recrutement";

export async function getPublishedRecrutements(): Promise<PublicRecrutementItem[]> {
  await connectDB();

  const items = await RecrutementModel.find({
    status: "publie",
    offerStatus: "ouvert",
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  return items.map((item) => toPublicRecrutementItem(serializeRecrutement(item)));
}

export async function getPublishedRecrutementBySlug(slug: string) {
  await connectDB();

  const item = await RecrutementModel.findOne({
    slug,
    status: "publie",
    offerStatus: "ouvert",
  }).lean();

  if (!item) return null;
  return toPublicRecrutementItem(serializeRecrutement(item));
}
