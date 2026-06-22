import { NextResponse } from "next/server";
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
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const createSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis"),
  excerpt: z.string().trim().min(1, "Le résumé est requis"),
  contentHtml: z.string().trim().min(1, "Le contenu est requis"),
  imageUrl: z.string().trim().url("Image invalide"),
  imagePublicId: z.string().trim().optional(),
  category: z.enum(NEWS_CATEGORIES),
  author: z.string().trim().min(1, "L'auteur est requis"),
  tags: z.array(z.string().trim()).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(CMS_STATUSES).optional(),
  publishedAt: z.string().optional(),
  slug: z.string().trim().optional(),
});

export async function GET(req: Request) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status && CMS_STATUSES.includes(status as (typeof CMS_STATUSES)[number])) {
    filter.status = status;
  }

  const items = await ActualiteModel.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({
    items: items.map(serializeActualite),
  });
}

export async function POST(req: Request) {
  const authResult = await requireCmsAdmin();
  if (authResult.error || !authResult.session) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const status = data.status ?? "brouillon";

  await connectDB();

  const slug = data.slug?.trim()
    ? slugify(data.slug)
    : await uniqueSlug(data.title, async (candidate) => {
        const existing = await ActualiteModel.findOne({ slug: candidate }).select("_id");
        return !!existing;
      });

  const actualite = await ActualiteModel.create({
    slug,
    title: data.title,
    excerpt: data.excerpt,
    contentHtml: data.contentHtml,
    imageUrl: data.imageUrl,
    imagePublicId: data.imagePublicId,
    category: data.category,
    author: data.author,
    tags: data.tags ?? [],
    isFeatured: data.isFeatured ?? false,
    status,
    publishedAt: resolvePublishedAt({ status, publishedAt: data.publishedAt }),
    createdBy: authResult.session.user.id,
  });

  return NextResponse.json(serializeActualite(actualite), { status: 201 });
}
