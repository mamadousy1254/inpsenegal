import { NextResponse } from "next/server";
import {
  CMS_CLOUDINARY_ROOT,
  CMS_PDF_MAX_BYTES,
  CMS_PDF_MIME_TYPES,
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

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
  }

  if (file.size > CMS_PDF_MAX_BYTES) {
    return NextResponse.json(
      { error: "Le PDF ne doit pas dépasser 15 Mo" },
      { status: 400 },
    );
  }

  if (
    !CMS_PDF_MIME_TYPES.includes(file.type as (typeof CMS_PDF_MIME_TYPES)[number])
  ) {
    return NextResponse.json({ error: "Format PDF non autorisé" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const upload = await uploadCmsAsset({
    buffer,
    folder: `${CMS_CLOUDINARY_ROOT}/files`,
    filename: file.name,
    resourceType: "raw",
  });

  return NextResponse.json({
    url: upload.secureUrl,
    publicId: upload.publicId,
    fileName: file.name,
  });
}
