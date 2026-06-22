import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import InstitutDelegationModel from "@/lib/mongo/models/institut-delegation.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeInstitutDelegation } from "@/lib/services/institut/serialize-institut-delegation";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const createSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  shortName: z.string().trim().min(1, "Le nom court est requis"),
  organigrammeLabel: z.string().trim().optional(),
  color: z.string().trim().min(1, "La couleur est requise"),
  chefLieu: z.string().trim().min(1, "Le chef-lieu est requis"),
  regionsCouvertes: z.array(z.string().trim()).default([]),
  superficie: z.string().trim().min(1),
  population: z.string().trim().min(1),
  typesDeSols: z.array(z.string().trim()).default([]),
  cultureDominantes: z.array(z.string().trim()).default([]),
  enjeuxPedologiques: z.array(z.string().trim()).default([]),
  missionsSpecifiques: z.array(z.string().trim()).default([]),
  delegueNom: z.string().trim().min(1),
  delegueFonction: z.string().trim().min(1),
  contactAdresse: z.string().trim().min(1),
  contactTelephone: z.string().trim().min(1),
  contactEmail: z.string().trim().email(),
  description: z.string().trim().min(1),
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

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status && CMS_STATUSES.includes(status as (typeof CMS_STATUSES)[number])) {
    filter.status = status;
  }

  const items = await InstitutDelegationModel.find(filter)
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeInstitutDelegation) });
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
    : await uniqueSlug(data.shortName, async (candidate) => {
        const existing = await InstitutDelegationModel.findOne({ slug: candidate }).select("_id");
        return !!existing;
      });

  const item = await InstitutDelegationModel.create({
    slug,
    name: data.name,
    shortName: data.shortName,
    organigrammeLabel: data.organigrammeLabel,
    color: data.color,
    chefLieu: data.chefLieu,
    regionsCouvertes: data.regionsCouvertes,
    superficie: data.superficie,
    population: data.population,
    typesDeSols: data.typesDeSols,
    cultureDominantes: data.cultureDominantes,
    enjeuxPedologiques: data.enjeuxPedologiques,
    missionsSpecifiques: data.missionsSpecifiques,
    delegueNom: data.delegueNom,
    delegueFonction: data.delegueFonction,
    contactAdresse: data.contactAdresse,
    contactTelephone: data.contactTelephone,
    contactEmail: data.contactEmail,
    description: data.description,
    sortOrder: data.sortOrder ?? 0,
    status,
    publishedAt: resolvePublishedAt({ status, publishedAt: data.publishedAt }),
    createdBy: authResult.session!.user.id,
  });

  return NextResponse.json(serializeInstitutDelegation(item), { status: 201 });
}
