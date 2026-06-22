/** Retire une transformation fl_attachment invalide d'une URL Cloudinary */
export function stripBrokenCloudinaryAttachment(url: string): string {
  return url.replace(/\/upload\/fl_attachment:[^/]+\//, "/upload/");
}

export function sanitizeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function ensureExtension(fileName: string, extension: string) {
  const ext = extension.startsWith(".") ? extension : `.${extension}`;
  return fileName.toLowerCase().endsWith(ext.toLowerCase()) ? fileName : `${fileName}${ext}`;
}

export function resolveCmsPdfFileName(input: {
  title: string;
  pdfFileName?: string | null;
}): string {
  if (input.pdfFileName?.trim()) {
    return input.pdfFileName.trim();
  }

  const base = sanitizeFileName(input.title) || "document";
  return ensureExtension(base, "pdf");
}

export function getCmsFileUrl(pdfUrl?: string | null, downloadUrl?: string | null): string | null {
  const url = pdfUrl || downloadUrl;
  return url?.trim() || null;
}

export function hasCmsFile(pdfUrl?: string | null, downloadUrl?: string | null): boolean {
  return Boolean(getCmsFileUrl(pdfUrl, downloadUrl));
}

export function contentDispositionFileName(fileName: string) {
  const ascii = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  const encoded = encodeURIComponent(fileName);
  return { ascii, encoded };
}

export function contentDispositionAttachment(fileName: string) {
  const { ascii, encoded } = contentDispositionFileName(fileName);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

export function contentDispositionInline(fileName: string) {
  const { ascii, encoded } = contentDispositionFileName(fileName);
  return `inline; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
