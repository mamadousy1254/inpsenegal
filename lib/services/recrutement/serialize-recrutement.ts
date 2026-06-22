import type { IRecrutement } from "@/lib/mongo/models/recrutement.model";

function formatDisplayDate(value?: Date | string | null, fallback?: string) {
  if (fallback?.trim()) return fallback.trim();
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export type SerializedRecrutement = {
  _id: string;
  slug: string;
  type: IRecrutement["type"];
  title: string;
  shortDescription: string;
  location: string;
  contractType: string;
  publishedDate: string;
  deadline: string;
  offerStatus: IRecrutement["offerStatus"];
  emailContact: string;
  references: string;
  status: IRecrutement["status"];
  createdAt: string;
  updatedAt: string;
};

export function serializeRecrutement(item: IRecrutement | Record<string, unknown>): SerializedRecrutement {
  const doc = item as IRecrutement;
  return {
    _id: String(doc._id),
    slug: doc.slug,
    type: doc.type,
    title: doc.title,
    shortDescription: doc.shortDescription,
    location: doc.location,
    contractType: doc.contractType,
    publishedDate: formatDisplayDate(doc.publishedAt),
    deadline: formatDisplayDate(doc.deadline, doc.deadlineLabel),
    offerStatus: doc.offerStatus,
    emailContact: doc.emailContact,
    references: doc.references,
    status: doc.status,
    createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
  };
}

export type PublicRecrutementItem = Omit<
  SerializedRecrutement,
  "_id" | "status" | "emailContact" | "createdAt" | "updatedAt"
>;

export function toPublicRecrutementItem(item: SerializedRecrutement): PublicRecrutementItem {
  const { _id, status, emailContact, createdAt, updatedAt, ...rest } = item;
  void _id;
  void status;
  void emailContact;
  void createdAt;
  void updatedAt;
  return rest;
}
