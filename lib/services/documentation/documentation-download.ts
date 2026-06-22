import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";
import {
  ensureExtension,
  sanitizeFileName,
  stripBrokenCloudinaryAttachment,
} from "@/lib/services/cms/cms-file-download";

export { stripBrokenCloudinaryAttachment };

export function getDocumentationFileUrl(item: SerializedDocumentationResource): string | null {
  const url = item.pdfUrl || item.downloadUrl;
  return url?.trim() || null;
}

export function hasDocumentationFile(item: SerializedDocumentationResource): boolean {
  return Boolean(getDocumentationFileUrl(item));
}

export function resolveDocumentationDownloadFileName(
  item: SerializedDocumentationResource,
): string {
  if (item.pdfFileName?.trim()) {
    return item.pdfFileName.trim();
  }

  const base = sanitizeFileName(item.title) || "document";

  if (item.pdfUrl) {
    return ensureExtension(base, "pdf");
  }

  if (item.format) {
    const format = item.format.toLowerCase();
    if (format === "geojson") return ensureExtension(base, "geojson");
    if (format === "csv") return ensureExtension(base, "csv");
    if (format === "xls") return ensureExtension(base, "xlsx");
  }

  return base;
}

export function getDocumentationDownloadHref(item: SerializedDocumentationResource): string {
  return `/api/documentation/download/${item._id}`;
}

export function getDocumentationViewHref(item: SerializedDocumentationResource): string {
  return `/api/documentation/download/${item._id}?inline=1`;
}

export function getDocumentationDownloadProps(item: SerializedDocumentationResource) {
  if (!hasDocumentationFile(item)) return null;

  return {
    href: getDocumentationDownloadHref(item),
    fileName: resolveDocumentationDownloadFileName(item),
  };
}
