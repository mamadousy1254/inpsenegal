export function isGedImageFile(file: {
  mimeType: string;
  name: string;
  resourceType?: string;
}): boolean {
  if (file.resourceType === "image") return true;

  const mime = file.mimeType.toLowerCase();
  const name = file.name.toLowerCase();

  return mime.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/.test(name);
}
