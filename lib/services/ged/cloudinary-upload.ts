import { assertCloudinaryConfig, cloudinary } from "@/lib/cloudinary/client";
import { GED_DEFAULT_SHARE_LINK_MINUTES } from "@/lib/constants/ged";

export type CloudinaryUploadResult = {
  publicId: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  folder?: string;
  thumbnailUrl?: string;
};

export async function uploadToCloudinary(input: {
  buffer: Buffer;
  folder: string;
  filename: string;
}): Promise<CloudinaryUploadResult> {
  assertCloudinaryConfig();

  const result = await new Promise<{
    public_id: string;
    secure_url: string;
    format: string;
    resource_type: string;
    bytes: number;
    folder?: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: input.folder,
        type: "authenticated",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        display_name: input.filename,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Upload Cloudinary échoué"));
          return;
        }
        resolve(uploadResult);
      },
    );

    stream.end(input.buffer);
  });

  let thumbnailUrl: string | undefined;
  if (result.resource_type === "image") {
    thumbnailUrl = cloudinary.url(result.public_id, {
      type: "authenticated",
      resource_type: "image",
      transformation: [{ width: 120, height: 120, crop: "fill" }],
      sign_url: true,
      secure: true,
    });
  }

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    format: result.format,
    resourceType: result.resource_type,
    bytes: result.bytes,
    folder: result.folder,
    thumbnailUrl,
  };
}

export async function deleteFromCloudinary(input: {
  publicId: string;
  resourceType: string;
}): Promise<void> {
  assertCloudinaryConfig();
  await cloudinary.uploader.destroy(input.publicId, {
    resource_type: input.resourceType as "image" | "video" | "raw" | "auto",
    type: "authenticated",
  });
}

export function getSignedDownloadUrl(input: {
  publicId: string;
  resourceType: string;
  format?: string;
  expiresInMinutes?: number;
}): string {
  assertCloudinaryConfig();

  const expiresInMinutes =
    input.expiresInMinutes ?? GED_DEFAULT_SHARE_LINK_MINUTES;

  return cloudinary.utils.private_download_url(
    input.publicId,
    input.format ?? "",
    {
      resource_type: input.resourceType as "image" | "video" | "raw" | "auto",
      type: "authenticated",
      expires_at: Math.floor(Date.now() / 1000) + 60 * expiresInMinutes,
      attachment: true,
    },
  );
}

const GED_IMAGE_PREVIEW_MINUTES = 60;

export function getSignedImagePreviewUrls(input: {
  publicId: string;
  format?: string;
  expiresInMinutes?: number;
}): { thumbnailUrl: string; previewUrl: string } {
  assertCloudinaryConfig();

  const expiresInMinutes = input.expiresInMinutes ?? GED_IMAGE_PREVIEW_MINUTES;
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * expiresInMinutes;
  const base = {
    type: "authenticated" as const,
    resource_type: "image" as const,
    format: input.format,
    sign_url: true,
    secure: true,
    expires_at: expiresAt,
  };

  return {
    thumbnailUrl: cloudinary.url(input.publicId, {
      ...base,
      transformation: [{ width: 120, height: 120, crop: "fill" }],
    }),
    previewUrl: cloudinary.url(input.publicId, {
      ...base,
      transformation: [{ width: 1600, crop: "limit" }],
    }),
  };
}
