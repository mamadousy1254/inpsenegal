import type {
  CmsStatus,
  ResearchAxisColor,
  ResearchAxisIcon,
} from "@/lib/constants/cms";

export type SerializedResearchAxis = {
  _id: string;
  title: string;
  description: string;
  stats?: string;
  icon: ResearchAxisIcon;
  color: ResearchAxisColor;
  image: string;
  imagePublicId?: string;
  imageAlt: string;
  order: number;
  status: CmsStatus;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function serializeResearchAxis(doc: {
  _id: { toString(): string };
  title: string;
  description: string;
  stats?: string;
  icon: string;
  color: string;
  image: string;
  imagePublicId?: string;
  imageAlt: string;
  order?: number;
  status: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}): SerializedResearchAxis {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    stats: doc.stats || undefined,
    icon: doc.icon as ResearchAxisIcon,
    color: doc.color as ResearchAxisColor,
    image: doc.image,
    imagePublicId: doc.imagePublicId || undefined,
    imageAlt: doc.imageAlt,
    order: doc.order ?? 0,
    status: doc.status as CmsStatus,
    publishedAt: doc.publishedAt?.toISOString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}
