import type { IPartenaire } from "@/lib/mongo/models/partenaire.model";
import type { PartenaireCategory } from "@/lib/constants/partenaires";

export type SerializedPartenaire = {
  _id: string;
  slug: string;
  nom: string;
  acronyme: string;
  description: string;
  category: PartenaireCategory;
  logo: string;
  logoPublicId?: string;
  siteWeb?: string;
  pays?: string;
  sortOrder: number;
  status: IPartenaire["status"];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicPartenaire = {
  id: string;
  nom: string;
  acronyme: string;
  description: string;
  category: PartenaireCategory;
  logo: string;
  siteWeb?: string;
  pays?: string;
};

export function serializePartenaire(
  item: IPartenaire | Record<string, unknown>,
): SerializedPartenaire {
  const doc = item as IPartenaire;
  return {
    _id: String(doc._id),
    slug: doc.slug,
    nom: doc.nom,
    acronyme: doc.acronyme,
    description: doc.description,
    category: doc.category,
    logo: doc.logo,
    logoPublicId: doc.logoPublicId,
    siteWeb: doc.siteWeb,
    pays: doc.pays,
    sortOrder: doc.sortOrder ?? 0,
    status: doc.status,
    publishedAt: doc.publishedAt?.toISOString?.(),
    createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
  };
}

export function toPublicPartenaire(item: SerializedPartenaire): PublicPartenaire {
  return {
    id: item.slug,
    nom: item.nom,
    acronyme: item.acronyme,
    description: item.description,
    category: item.category,
    logo: item.logo,
    siteWeb: item.siteWeb,
    pays: item.pays,
  };
}
