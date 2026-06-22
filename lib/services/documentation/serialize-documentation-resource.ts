import type { IDocumentationResource } from "@/lib/mongo/models/documentation-resource.model";

export function serializeDocumentationResource(
  doc: IDocumentationResource | Record<string, unknown>,
) {
  const item = doc as IDocumentationResource;
  return {
    _id: item._id.toString(),
    rubrique: item.rubrique,
    slug: item.slug,
    title: item.title,
    description: item.description,
    year: item.year,
    status: item.status,
    category: item.category,
    issue: item.issue,
    format: item.format,
    docType: item.docType,
    legalType: item.legalType,
    legalDate: item.legalDate,
    reference: item.reference,
    fileSize: item.fileSize,
    author: item.author,
    pdfUrl: item.pdfUrl,
    pdfPublicId: item.pdfPublicId,
    pdfFileName: item.pdfFileName,
    downloadUrl: item.downloadUrl,
    publishedAt: item.publishedAt?.toISOString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  };
}

export type SerializedDocumentationResource = ReturnType<
  typeof serializeDocumentationResource
>;
