import { connectDB } from "@/lib/mongo/db";
import InstitutMembreModel from "@/lib/mongo/models/institut-membre.model";
import InstitutDelegationModel from "@/lib/mongo/models/institut-delegation.model";
import {
  serializeInstitutDelegation,
  toPublicInstitutDelegation,
} from "@/lib/services/institut/serialize-institut-delegation";
import {
  serializeInstitutMembre,
  toPublicInstitutMembre,
} from "@/lib/services/institut/serialize-institut-membre";

export async function getPublishedInstitutMembres() {
  await connectDB();
  const items = await InstitutMembreModel.find({ status: "publie" })
    .sort({ pole: 1, sortOrder: 1, nom: 1 })
    .lean();
  return items.map((item) => toPublicInstitutMembre(serializeInstitutMembre(item)));
}

export async function getPublishedInstitutDelegations() {
  await connectDB();
  const items = await InstitutDelegationModel.find({ status: "publie" })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  return items.map((item) => toPublicInstitutDelegation(serializeInstitutDelegation(item)));
}

export async function getPublishedInstitutDelegationBySlug(slug: string) {
  await connectDB();
  const item = await InstitutDelegationModel.findOne({ slug, status: "publie" }).lean();
  if (!item) return null;
  return toPublicInstitutDelegation(serializeInstitutDelegation(item));
}

export async function getPublishedInstitutDelegationSlugs() {
  await connectDB();
  const items = await InstitutDelegationModel.find({ status: "publie" })
    .select("slug")
    .sort({ sortOrder: 1 })
    .lean();
  return items.map((item) => item.slug);
}
