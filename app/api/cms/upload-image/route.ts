import { NextResponse } from "next/server";
import {
  CMS_CLOUDINARY_ROOT,
  CMS_CARTOTHEQUE_IMAGE_MAX_BYTES,
  CMS_IMAGE_MAX_BYTES,
  CMS_IMAGE_MIME_TYPES,
} from "@/lib/constants/cms";
import { uploadCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";

export async function POST(req: Request) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const folder = formData.get("folder")?.toString() || "actualites";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
  }

  const maxBytes =
    folder === "cartotheque" ? CMS_CARTOTHEQUE_IMAGE_MAX_BYTES : CMS_IMAGE_MAX_BYTES;
  const maxMo = maxBytes / (1024 * 1024);

  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `L'image ne doit pas dépasser ${maxMo} Mo` },
      { status: 400 },
    );
  }

  if (
    !CMS_IMAGE_MIME_TYPES.includes(
      file.type as (typeof CMS_IMAGE_MIME_TYPES)[number],
    )
  ) {
    return NextResponse.json({ error: "Format d'image non autorisé" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const upload = await uploadCmsAsset({
    buffer,
    folder: `${CMS_CLOUDINARY_ROOT}/${folder}`,
    filename: file.name,
    resourceType: "image",
  });

  return NextResponse.json({
    url: upload.secureUrl,
    publicId: upload.publicId,
  });
}
