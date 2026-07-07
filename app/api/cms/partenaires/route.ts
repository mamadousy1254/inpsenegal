import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import PartenaireModel from "@/lib/mongo/models/partenaire.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { PARTENAIRE_CATEGORIES } from "@/lib/constants/partenaires";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializePartenaire } from "@/lib/services/partenaires/serialize-partenaire";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const createSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis"),
  acronyme: z.string().trim().min(1, "L'acronyme est requis"),
  description: z.string().trim().min(1, "La description est requise"),
  category: z.enum(PARTENAIRE_CATEGORIES),
  logo: z.string().trim().min(1, "Le logo est requis"),
  logoPublicId: z.string().trim().optional(),
  siteWeb: z.string().trim().url().optional().or(z.literal("")),
  pays: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().optional(),
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
  const category = searchParams.get("category");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status && CMS_STATUSES.includes(status as (typeof CMS_STATUSES)[number])) {
    filter.status = status;
  }
  if (
    category &&
    PARTENAIRE_CATEGORIES.includes(category as (typeof PARTENAIRE_CATEGORIES)[number])
  ) {
    filter.category = category;
  }

  const items = await PartenaireModel.find(filter)
    .sort({ category: 1, sortOrder: 1, acronyme: 1 })
    .lean();

  return NextResponse.json({ items: items.map(serializePartenaire) });
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
    : await uniqueSlug(data.acronyme, async (candidate) => {
        const existing = await PartenaireModel.findOne({ slug: candidate }).select("_id");
        return !!existing;
      });

  const item = await PartenaireModel.create({
    slug,
    nom: data.nom,
    acronyme: data.acronyme,
    description: data.description,
    category: data.category,
    logo: data.logo,
    logoPublicId: data.logoPublicId,
    siteWeb: data.siteWeb || undefined,
    pays: data.pays,
    sortOrder: data.sortOrder ?? 0,
    status,
    publishedAt: resolvePublishedAt({ status, publishedAt: data.publishedAt }),
    createdBy: authResult.session!.user.id,
  });

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "create",
    resource: "Partenaire",
    resourceLabel: "Partenaire",
    resourceId: item._id.toString(),
    title: item.nom,
    metadata: { status: item.status, category: item.category },
  });

  return NextResponse.json(serializePartenaire(item), { status: 201 });
}
