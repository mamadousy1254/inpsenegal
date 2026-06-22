import type { IMediathequeItem } from "@/lib/mongo/models/mediatheque-item.model";

export function serializeMediathequeItem(doc: IMediathequeItem | Record<string, unknown>) {
  const item = doc as IMediathequeItem;
  return {
    _id: item._id.toString(),
    imageUrl: item.imageUrl,
    imagePublicId: item.imagePublicId,
    alt: item.alt,
    caption: item.caption,
    status: item.status,
    publishedAt: item.publishedAt?.toISOString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  };
}

export type SerializedMediathequeItem = ReturnType<typeof serializeMediathequeItem>;

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export function toGalleryImage(item: SerializedMediathequeItem): GalleryImage {
  return {
    src: item.imageUrl,
    alt: item.alt,
    caption: item.caption,
  };
}
