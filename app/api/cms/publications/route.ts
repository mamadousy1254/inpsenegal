import { NextResponse } from "next/server";
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
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const createSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis"),
  authors: z.array(z.string().trim()).min(1, "Au moins un auteur est requis"),
  year: z.coerce.number().int().min(1900).max(2100),
  type: z.enum(PUBLICATION_TYPES),
  abstract: z.string().trim().min(1, "Le résumé est requis"),
  tags: z.array(z.string().trim()).optional(),
  researchAxis: z.enum(RESEARCH_AXES),
  methodology: z.string().trim().optional(),
  results: z.string().trim().optional(),
  pdfUrl: z.string().trim().url().optional(),
  pdfPublicId: z.string().trim().optional(),
  pdfFileName: z.string().trim().optional(),
  doi: z.string().trim().optional(),
  isFeatured: z.boolean().optional(),
  showOnScientificPage: z.boolean().optional(),
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
  const scientific = searchParams.get("scientific");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status && CMS_STATUSES.includes(status as (typeof CMS_STATUSES)[number])) {
    filter.status = status;
  }
  if (scientific === "1" || scientific === "true") {
    filter.$or = [{ showOnScientificPage: true }, { showOnScientificPage: { $exists: false } }];
  }

  const items = await PublicationModel.find(filter)
    .sort({ publishedAt: -1, year: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ items: items.map(serializePublication) });
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
        const existing = await PublicationModel.findOne({ slug: candidate }).select("_id");
        return !!existing;
      });

  const publication = await PublicationModel.create({
    slug,
    title: data.title,
    authors: data.authors,
    year: data.year,
    type: data.type,
    abstract: data.abstract,
    tags: data.tags ?? [],
    researchAxis: data.researchAxis,
    methodology: data.methodology,
    results: data.results,
    pdfUrl: data.pdfUrl,
    pdfPublicId: data.pdfPublicId,
    pdfFileName: data.pdfFileName,
    doi: data.doi,
    isFeatured: data.isFeatured ?? false,
    showOnScientificPage: data.showOnScientificPage ?? true,
    status,
    publishedAt: resolvePublishedAt({ status, publishedAt: data.publishedAt }),
    createdBy: authResult.session.user.id,
  });

  return NextResponse.json(serializePublication(publication), { status: 201 });
}
