import { connectDB } from "@/lib/mongo/db";
import PartenaireModel from "@/lib/mongo/models/partenaire.model";
import {
  serializePartenaire,
  toPublicPartenaire,
} from "@/lib/services/partenaires/serialize-partenaire";

export async function getPublishedPartenaires() {
  await connectDB();
  const items = await PartenaireModel.find({ status: "publie" })
    .sort({ category: 1, sortOrder: 1, acronyme: 1 })
    .lean();
  return items.map((item) => toPublicPartenaire(serializePartenaire(item)));
}
