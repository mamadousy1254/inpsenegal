import { getSignedImagePreviewUrls } from "@/lib/services/ged/cloudinary-upload";
import type { GedFileEntry } from "@/lib/services/ged/serialize-ged";
import { isGedImageFile } from "@/lib/utils/ged-images";

export function enrichGedFileWithImageUrls(file: GedFileEntry): GedFileEntry {
  if (!isGedImageFile(file)) return file;

  const urls = getSignedImagePreviewUrls({
    publicId: file.cloudinaryId,
    format: file.format,
  });

  return {
    ...file,
    imageThumbnailUrl: urls.thumbnailUrl,
    imagePreviewUrl: urls.previewUrl,
  };
}
