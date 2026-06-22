import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import PublicationModel from "@/lib/mongo/models/publication.model";
import {
  CMS_STATUSES,
  PUBLICATION_TYPES,
  RESEARCH_AXES,
} from "@/lib/constants/cms";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializePublication } from "@/lib/services/cms/serialize-publication";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { deleteCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  authors: z.array(z.string().trim()).min(1).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  type: z.enum(PUBLICATION_TYPES).optional(),
  abstract: z.string().trim().min(1).optional(),
  tags: z.array(z.string().trim()).optional(),
  researchAxis: z.enum(RESEARCH_AXES).optional(),
  methodology: z.string().trim().optional(),
  results: z.string().trim().optional(),
  pdfUrl: z.string().trim().url().nullable().optional(),
  pdfPublicId: z.string().trim().nullable().optional(),
  pdfFileName: z.string().trim().nullable().optional(),
  doi: z.string().trim().nullable().optional(),
  isFeatured: z.boolean().optional(),
  showOnScientificPage: z.boolean().optional(),
  status: z.enum(CMS_STATUSES).optional(),
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
  const publication = await PublicationModel.findById(id).lean();
  if (!publication) {
    return NextResponse.json({ error: "Publication introuvable" }, { status: 404 });
  }

  return NextResponse.json(serializePublication(publication));
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
  const publication = await PublicationModel.findById(id);
  if (!publication) {
    return NextResponse.json({ error: "Publication introuvable" }, { status: 404 });
  }

  const data = parsed.data;
  const previousPdfPublicId = publication.pdfPublicId;

  if (data.title !== undefined) publication.title = data.title;
  if (data.authors !== undefined) publication.authors = data.authors;
  if (data.year !== undefined) publication.year = data.year;
  if (data.type !== undefined) publication.type = data.type;
  if (data.abstract !== undefined) publication.abstract = data.abstract;
  if (data.tags !== undefined) publication.tags = data.tags;
  if (data.researchAxis !== undefined) publication.researchAxis = data.researchAxis;
  if (data.methodology !== undefined) publication.methodology = data.methodology;
  if (data.results !== undefined) publication.results = data.results;
  if (data.pdfUrl !== undefined) publication.pdfUrl = data.pdfUrl ?? undefined;
  if (data.pdfPublicId !== undefined) publication.pdfPublicId = data.pdfPublicId ?? undefined;
  if (data.pdfFileName !== undefined) publication.pdfFileName = data.pdfFileName ?? undefined;
  if (data.doi !== undefined) publication.doi = data.doi ?? undefined;
  if (data.isFeatured !== undefined) publication.isFeatured = data.isFeatured;
  if (data.showOnScientificPage !== undefined) {
    publication.showOnScientificPage = data.showOnScientificPage;
  }

  if (data.slug !== undefined) {
    const nextSlug = slugify(data.slug);
    const taken = await PublicationModel.findOne({
      slug: nextSlug,
      _id: { $ne: publication._id },
    }).select("_id");
    if (taken) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }
    publication.slug = nextSlug;
  } else if (data.title !== undefined) {
    publication.slug = await uniqueSlug(data.title, async (candidate) => {
      const existing = await PublicationModel.findOne({
        slug: candidate,
        _id: { $ne: publication._id },
      }).select("_id");
      return !!existing;
    });
  }

  if (data.status !== undefined) {
    publication.status = data.status;
    publication.publishedAt = resolvePublishedAt({
      status: data.status,
      publishedAt: data.publishedAt ?? publication.publishedAt,
    });
  } else if (data.publishedAt !== undefined && publication.status === "publie") {
    publication.publishedAt = data.publishedAt
      ? resolvePublishedAt({ status: "publie", publishedAt: data.publishedAt })
      : undefined;
  }

  publication.updatedBy = new mongoose.Types.ObjectId(authResult.session.user.id);
  await publication.save();

  if (
    data.pdfPublicId &&
    previousPdfPublicId &&
    previousPdfPublicId !== data.pdfPublicId
  ) {
    try {
      await deleteCmsAsset({
        publicId: previousPdfPublicId,
        resourceType: "raw",
      });
    } catch {
      /* ignore cleanup errors */
    }
  }

  return NextResponse.json(serializePublication(publication));
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
  const publication = await PublicationModel.findById(id);
  if (!publication) {
    return NextResponse.json({ error: "Publication introuvable" }, { status: 404 });
  }

  if (publication.pdfPublicId) {
    try {
      await deleteCmsAsset({
        publicId: publication.pdfPublicId,
        resourceType: "raw",
      });
    } catch {
      /* ignore cleanup errors */
    }
  }

  await publication.deleteOne();
  return NextResponse.json({ success: true });
}
