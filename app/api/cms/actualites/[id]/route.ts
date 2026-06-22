import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import ActualiteModel from "@/lib/mongo/models/actualite.model";
import {
  CMS_STATUSES,
  NEWS_CATEGORIES,
} from "@/lib/constants/cms";
import {
  resolvePublishedAt,
  serializeActualite,
} from "@/lib/services/cms/serialize-actualite";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { deleteCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  excerpt: z.string().trim().min(1).optional(),
  contentHtml: z.string().trim().min(1).optional(),
  imageUrl: z.string().trim().url().optional(),
  imagePublicId: z.string().trim().optional(),
  category: z.enum(NEWS_CATEGORIES).optional(),
  author: z.string().trim().min(1).optional(),
  tags: z.array(z.string().trim()).optional(),
  isFeatured: z.boolean().optional(),
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
  const actualite = await ActualiteModel.findById(id).lean();
  if (!actualite) {
    return NextResponse.json({ error: "Actualité introuvable" }, { status: 404 });
  }

  return NextResponse.json(serializeActualite(actualite));
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
  const actualite = await ActualiteModel.findById(id);
  if (!actualite) {
    return NextResponse.json({ error: "Actualité introuvable" }, { status: 404 });
  }

  const data = parsed.data;
  const previousImagePublicId = actualite.imagePublicId;

  if (data.title !== undefined) actualite.title = data.title;
  if (data.excerpt !== undefined) actualite.excerpt = data.excerpt;
  if (data.contentHtml !== undefined) actualite.contentHtml = data.contentHtml;
  if (data.imageUrl !== undefined) actualite.imageUrl = data.imageUrl;
  if (data.imagePublicId !== undefined) actualite.imagePublicId = data.imagePublicId;
  if (data.category !== undefined) actualite.category = data.category;
  if (data.author !== undefined) actualite.author = data.author;
  if (data.tags !== undefined) actualite.tags = data.tags;
  if (data.isFeatured !== undefined) actualite.isFeatured = data.isFeatured;

  if (data.slug !== undefined) {
    const nextSlug = slugify(data.slug);
    const taken = await ActualiteModel.findOne({
      slug: nextSlug,
      _id: { $ne: actualite._id },
    }).select("_id");
    if (taken) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }
    actualite.slug = nextSlug;
  } else if (data.title !== undefined) {
    actualite.slug = await uniqueSlug(data.title, async (candidate) => {
      const existing = await ActualiteModel.findOne({
        slug: candidate,
        _id: { $ne: actualite._id },
      }).select("_id");
      return !!existing;
    });
  }

  if (data.status !== undefined) {
    actualite.status = data.status;
    actualite.publishedAt = resolvePublishedAt({
      status: data.status,
      publishedAt: data.publishedAt ?? actualite.publishedAt,
    });
  } else if (data.publishedAt !== undefined && actualite.status === "publie") {
    actualite.publishedAt = data.publishedAt
      ? resolvePublishedAt({ status: "publie", publishedAt: data.publishedAt })
      : undefined;
  }

  actualite.updatedBy = new mongoose.Types.ObjectId(authResult.session.user.id);
  await actualite.save();

  if (
    data.imagePublicId &&
    previousImagePublicId &&
    previousImagePublicId !== data.imagePublicId
  ) {
    try {
      await deleteCmsAsset({
        publicId: previousImagePublicId,
        resourceType: "image",
      });
    } catch {
      /* ignore cleanup errors */
    }
  }

  return NextResponse.json(serializeActualite(actualite));
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
  const actualite = await ActualiteModel.findById(id);
  if (!actualite) {
    return NextResponse.json({ error: "Actualité introuvable" }, { status: 404 });
  }

  if (actualite.imagePublicId) {
    try {
      await deleteCmsAsset({
        publicId: actualite.imagePublicId,
        resourceType: "image",
      });
    } catch {
      /* ignore cleanup errors */
    }
  }

  await actualite.deleteOne();
  return NextResponse.json({ success: true });
}
