import type { ICartothequeItem } from "@/lib/mongo/models/cartotheque-item.model";

export function serializeCartothequeItem(
  doc: ICartothequeItem | Record<string, unknown>,
) {
  const item = doc as ICartothequeItem;
  return {
    _id: item._id.toString(),
    imageUrl: item.imageUrl,
    imagePublicId: item.imagePublicId,
    title: item.title,
    legende: item.legende,
    status: item.status,
    publishedAt: item.publishedAt?.toISOString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  };
}

export type SerializedCartothequeItem = ReturnType<
  typeof serializeCartothequeItem
>;

export type PublicCartothequeMap = {
  id: string;
  imageUrl: string;
  alt: string;
  legende: string;
};

export function toPublicCartothequeMap(
  item: SerializedCartothequeItem,
): PublicCartothequeMap {
  return {
    id: item._id,
    imageUrl: item.imageUrl,
    alt: item.title,
    legende: item.legende,
  };
}
