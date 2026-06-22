import type { IPublication } from "@/lib/mongo/models/publication.model";
import type { PublicationItem } from "@/components/publications/publication-data";

export function serializePublication(doc: IPublication | Record<string, unknown>) {
  const item = doc as IPublication;
  return {
    _id: item._id.toString(),
    slug: item.slug,
    title: item.title,
    authors: item.authors ?? [],
    year: item.year,
    type: item.type,
    abstract: item.abstract,
    tags: item.tags ?? [],
    researchAxis: item.researchAxis,
    methodology: item.methodology,
    results: item.results,
    pdfUrl: item.pdfUrl,
    pdfPublicId: item.pdfPublicId,
    pdfFileName: item.pdfFileName,
    doi: item.doi,
    isFeatured: item.isFeatured ?? false,
    showOnScientificPage: item.showOnScientificPage ?? true,
    status: item.status,
    publishedAt: item.publishedAt?.toISOString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  };
}

export type SerializedPublication = ReturnType<typeof serializePublication>;

export function toPublicationItem(item: SerializedPublication): PublicationItem {
  return {
    slug: item.slug,
    title: item.title,
    authors: item.authors,
    year: item.year,
    type: item.type,
    abstract: item.abstract,
    tags: item.tags,
    researchAxis: item.researchAxis,
    methodology: item.methodology,
    results: item.results,
    doi: item.doi,
    pdfUrl: item.pdfUrl,
    pdfFileName: item.pdfFileName,
    isFeatured: item.isFeatured,
  };
}
