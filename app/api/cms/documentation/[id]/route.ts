import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import DocumentationResourceModel from "@/lib/mongo/models/documentation-resource.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import {
  DOCUMENTATION_RUBRIQUES,
  DOCUMENTATION_DOC_TYPES,
  OPEN_DATA_FORMATS,
  TEXTES_LEGAL_TYPES,
} from "@/lib/constants/documentation";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { deleteCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  status: z.enum(CMS_STATUSES).optional(),
  category: z.string().trim().nullable().optional(),
  issue: z.string().trim().nullable().optional(),
  format: z.enum(OPEN_DATA_FORMATS).nullable().optional(),
  docType: z.enum(DOCUMENTATION_DOC_TYPES).nullable().optional(),
  legalType: z.enum(TEXTES_LEGAL_TYPES).nullable().optional(),
  legalDate: z.string().trim().nullable().optional(),
  reference: z.string().trim().nullable().optional(),
  fileSize: z.string().trim().nullable().optional(),
  author: z.string().trim().nullable().optional(),
  pdfUrl: z.string().trim().url().nullable().optional(),
  pdfPublicId: z.string().trim().nullable().optional(),
  pdfFileName: z.string().trim().nullable().optional(),
  downloadUrl: z.string().trim().url().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  slug: z.string().trim().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();
  const item = await DocumentationResourceModel.findById(id).lean();
  if (!item) {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  return NextResponse.json(serializeDocumentationResource(item));
}

export async function PATCH(req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error || !authResult.session) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 },
    );
  }

  await connectDB();
  const item = await DocumentationResourceModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  const data = parsed.data;
  const previousPdfPublicId = item.pdfPublicId;

  if (data.title !== undefined) item.title = data.title;
  if (data.description !== undefined) item.description = data.description;
  if (data.year !== undefined) item.year = data.year;
  if (data.category !== undefined) item.category = data.category ?? undefined;
  if (data.issue !== undefined) item.issue = data.issue ?? undefined;
  if (data.format !== undefined) item.format = data.format ?? undefined;
  if (data.docType !== undefined) item.docType = data.docType ?? undefined;
  if (data.legalType !== undefined) item.legalType = data.legalType ?? undefined;
  if (data.legalDate !== undefined) item.legalDate = data.legalDate ?? undefined;
  if (data.reference !== undefined) item.reference = data.reference ?? undefined;
  if (data.fileSize !== undefined) item.fileSize = data.fileSize ?? undefined;
  if (data.author !== undefined) item.author = data.author ?? undefined;
  if (data.pdfUrl !== undefined) item.pdfUrl = data.pdfUrl ?? undefined;
  if (data.pdfPublicId !== undefined) item.pdfPublicId = data.pdfPublicId ?? undefined;
  if (data.pdfFileName !== undefined) item.pdfFileName = data.pdfFileName ?? undefined;
  if (data.downloadUrl !== undefined) item.downloadUrl = data.downloadUrl ?? undefined;

  if (data.slug !== undefined) {
    const nextSlug = slugify(data.slug);
    const taken = await DocumentationResourceModel.findOne({
      rubrique: item.rubrique,
      slug: nextSlug,
      _id: { $ne: item._id },
    }).select("_id");
    if (taken) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }
    item.slug = nextSlug;
  } else if (data.title !== undefined) {
    item.slug = await uniqueSlug(data.title, async (candidate) => {
      const existing = await DocumentationResourceModel.findOne({
        rubrique: item.rubrique,
        slug: candidate,
        _id: { $ne: item._id },
      }).select("_id");
      return !!existing;
    });
  }

  if (data.status !== undefined) {
    item.status = data.status;
    item.publishedAt = resolvePublishedAt({
      status: data.status,
      publishedAt: data.publishedAt ?? item.publishedAt,
    });
  } else if (data.publishedAt !== undefined && item.status === "publie") {
    item.publishedAt = data.publishedAt
      ? resolvePublishedAt({ status: "publie", publishedAt: data.publishedAt })
      : undefined;
  }

  item.updatedBy = new mongoose.Types.ObjectId(authResult.session!.user.id);
  await item.save();

  if (
    data.pdfPublicId &&
    previousPdfPublicId &&
    previousPdfPublicId !== data.pdfPublicId
  ) {
    try {
      await deleteCmsAsset({ publicId: previousPdfPublicId, resourceType: "raw" });
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json(serializeDocumentationResource(item));
}

export async function DELETE(_req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();
  const item = await DocumentationResourceModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  if (item.pdfPublicId) {
    try {
      await deleteCmsAsset({ publicId: item.pdfPublicId, resourceType: "raw" });
    } catch {
      /* ignore */
    }
  }

  await item.deleteOne();
  return NextResponse.json({ success: true });
}
