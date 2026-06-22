import type { IActualite } from "@/lib/mongo/models/actualite.model";
import type { NewsItem } from "@/components/actualites/actualites-data";

export function serializeActualite(doc: IActualite | Record<string, unknown>) {
  const item = doc as IActualite;
  return {
    _id: item._id.toString(),
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    contentHtml: item.contentHtml,
    imageUrl: item.imageUrl,
    imagePublicId: item.imagePublicId,
    category: item.category,
    author: item.author,
    tags: item.tags ?? [],
    isFeatured: item.isFeatured ?? false,
    status: item.status,
    publishedAt: item.publishedAt?.toISOString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  };
}

export type SerializedActualite = ReturnType<typeof serializeActualite>;

export function toNewsItem(item: SerializedActualite): NewsItem {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    content: item.contentHtml,
    image: item.imageUrl,
    category: item.category,
    author: item.author,
    publishedAt: item.publishedAt ?? item.createdAt ?? new Date().toISOString(),
    isFeatured: item.isFeatured,
    tags: item.tags,
  };
}

export function resolvePublishedAt(input: {
  status: "brouillon" | "publie";
  publishedAt?: string | Date | null;
}): Date | undefined {
  if (input.status !== "publie") return undefined;
  if (!input.publishedAt) return new Date();
  const date = input.publishedAt instanceof Date ? input.publishedAt : new Date(input.publishedAt);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}
