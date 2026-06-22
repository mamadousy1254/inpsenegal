import type { IInstitutMembre } from "@/lib/mongo/models/institut-membre.model";

export type SerializedInstitutMembre = {
  _id: string;
  slug: string;
  nom: string;
  fonction: string;
  pole: IInstitutMembre["pole"];
  zone?: string;
  photo?: string;
  photoPublicId?: string;
  sortOrder: number;
  status: IInstitutMembre["status"];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicInstitutMembre = {
  id: string;
  nom: string;
  fonction: string;
  pole: IInstitutMembre["pole"];
  zone?: string;
  photo?: string;
};

export function serializeInstitutMembre(
  item: IInstitutMembre | Record<string, unknown>,
): SerializedInstitutMembre {
  const doc = item as IInstitutMembre;
  return {
    _id: String(doc._id),
    slug: doc.slug,
    nom: doc.nom,
    fonction: doc.fonction,
    pole: doc.pole,
    zone: doc.zone,
    photo: doc.photo,
    photoPublicId: doc.photoPublicId,
    sortOrder: doc.sortOrder ?? 0,
    status: doc.status,
    publishedAt: doc.publishedAt?.toISOString?.(),
    createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
  };
}

export function toPublicInstitutMembre(item: SerializedInstitutMembre): PublicInstitutMembre {
  return {
    id: item.slug,
    nom: item.nom,
    fonction: item.fonction,
    pole: item.pole,
    zone: item.zone,
    photo: item.photo,
  };
}
