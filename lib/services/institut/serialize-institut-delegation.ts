import type { IInstitutDelegation } from "@/lib/mongo/models/institut-delegation.model";

export type SerializedInstitutDelegation = {
  _id: string;
  slug: string;
  name: string;
  shortName: string;
  organigrammeLabel: string;
  color: string;
  chefLieu: string;
  regionsCouvertes: string[];
  superficie: string;
  population: string;
  typesDeSols: string[];
  cultureDominantes: string[];
  enjeuxPedologiques: string[];
  missionsSpecifiques: string[];
  delegueNom: string;
  delegueFonction: string;
  contact: {
    adresse: string;
    telephone: string;
    email: string;
  };
  description: string;
  sortOrder: number;
  status: IInstitutDelegation["status"];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicInstitutDelegation = Omit<
  SerializedInstitutDelegation,
  "_id" | "status" | "publishedAt" | "createdAt" | "updatedAt" | "sortOrder"
>;

function resolveOrganigrammeLabel(doc: IInstitutDelegation): string {
  if (doc.organigrammeLabel?.trim()) return doc.organigrammeLabel.trim();
  return `Délégation ${doc.shortName}`;
}

export function serializeInstitutDelegation(
  item: IInstitutDelegation | Record<string, unknown>,
): SerializedInstitutDelegation {
  const doc = item as IInstitutDelegation;
  return {
    _id: String(doc._id),
    slug: doc.slug,
    name: doc.name,
    shortName: doc.shortName,
    organigrammeLabel: resolveOrganigrammeLabel(doc),
    color: doc.color,
    chefLieu: doc.chefLieu,
    regionsCouvertes: doc.regionsCouvertes ?? [],
    superficie: doc.superficie,
    population: doc.population,
    typesDeSols: doc.typesDeSols ?? [],
    cultureDominantes: doc.cultureDominantes ?? [],
    enjeuxPedologiques: doc.enjeuxPedologiques ?? [],
    missionsSpecifiques: doc.missionsSpecifiques ?? [],
    delegueNom: doc.delegueNom,
    delegueFonction: doc.delegueFonction,
    contact: {
      adresse: doc.contactAdresse,
      telephone: doc.contactTelephone,
      email: doc.contactEmail,
    },
    description: doc.description,
    sortOrder: doc.sortOrder ?? 0,
    status: doc.status,
    publishedAt: doc.publishedAt?.toISOString?.(),
    createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
  };
}

export function toPublicInstitutDelegation(
  item: SerializedInstitutDelegation,
): PublicInstitutDelegation {
  const { _id, status, publishedAt, createdAt, updatedAt, sortOrder, ...rest } = item;
  void _id;
  void status;
  void publishedAt;
  void createdAt;
  void updatedAt;
  void sortOrder;
  return rest;
}
