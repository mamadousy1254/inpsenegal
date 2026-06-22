import { assertCloudinaryConfig, cloudinary } from "@/lib/cloudinary/client";

export type CmsUploadResult = {
  publicId: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
};

export async function uploadCmsAsset(input: {
  buffer: Buffer;
  folder: string;
  filename: string;
  resourceType?: "image" | "raw" | "auto";
}): Promise<CmsUploadResult> {
  assertCloudinaryConfig();

  const result = await new Promise<{
    public_id: string;
    secure_url: string;
    format: string;
    resource_type: string;
    bytes: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: input.folder,
        resource_type: input.resourceType ?? "auto",
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

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    format: result.format,
    resourceType: result.resource_type,
    bytes: result.bytes,
  };
}

export async function deleteCmsAsset(input: {
  publicId: string;
  resourceType: string;
}): Promise<void> {
  assertCloudinaryConfig();
  await cloudinary.uploader.destroy(input.publicId, {
    resource_type: input.resourceType as "image" | "video" | "raw" | "auto",
  });
}
