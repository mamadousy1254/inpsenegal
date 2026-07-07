import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import InstitutMembreModel from "@/lib/mongo/models/institut-membre.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { INSTITUT_POLE_TYPES } from "@/lib/constants/institut";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeInstitutMembre } from "@/lib/services/institut/serialize-institut-membre";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const createSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis"),
  fonction: z.string().trim().min(1, "La fonction est requise"),
  pole: z.enum(INSTITUT_POLE_TYPES),
  zone: z.string().trim().optional(),
  photo: z.string().trim().url().optional(),
  photoPublicId: z.string().trim().optional(),
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
  const pole = searchParams.get("pole");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status && CMS_STATUSES.includes(status as (typeof CMS_STATUSES)[number])) {
    filter.status = status;
  }
  if (pole && INSTITUT_POLE_TYPES.includes(pole as (typeof INSTITUT_POLE_TYPES)[number])) {
    filter.pole = pole;
  }

  const items = await InstitutMembreModel.find(filter)
    .sort({ pole: 1, sortOrder: 1, nom: 1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeInstitutMembre) });
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
    : await uniqueSlug(data.nom, async (candidate) => {
        const existing = await InstitutMembreModel.findOne({ slug: candidate }).select("_id");
        return !!existing;
      });

  const item = await InstitutMembreModel.create({
    slug,
    nom: data.nom,
    fonction: data.fonction,
    pole: data.pole,
    zone: data.zone,
    photo: data.photo,
    photoPublicId: data.photoPublicId,
    sortOrder: data.sortOrder ?? 0,
    status,
    publishedAt: resolvePublishedAt({ status, publishedAt: data.publishedAt }),
    createdBy: authResult.session!.user.id,
  });

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "create",
    resource: "InstitutMembre",
    resourceLabel: "Membre de l'équipe",
    resourceId: item._id.toString(),
    title: item.nom,
    metadata: { status: item.status },
  });

  return NextResponse.json(serializeInstitutMembre(item), { status: 201 });
}
