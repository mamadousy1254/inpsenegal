import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import CartothequeItemModel from "@/lib/mongo/models/cartotheque-item.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeCartothequeItem } from "@/lib/services/cms/serialize-cartotheque";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";

const createSchema = z.object({
  imageUrl: z.string().trim().url("Image invalide"),
  imagePublicId: z.string().trim().min(1, "Identifiant Cloudinary requis"),
  title: z.string().trim().min(1, "Le titre est requis"),
  legende: z.string().trim().min(1, "La légende est requise"),
  status: z.enum(CMS_STATUSES).optional(),
  publishedAt: z.string().optional(),
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

  const items = await CartothequeItemModel.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeCartothequeItem) });
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

  const item = await CartothequeItemModel.create({
    imageUrl: data.imageUrl,
    imagePublicId: data.imagePublicId,
    title: data.title,
    legende: data.legende,
    status,
    publishedAt: resolvePublishedAt({ status, publishedAt: data.publishedAt }),
    createdBy: authResult.session.user.id,
  });

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "create",
    resource: "CartothequeItem",
    resourceLabel: "Cartothèque",
    resourceId: item._id.toString(),
    title: item.title,
    metadata: { status: item.status },
  });

  return NextResponse.json(serializeCartothequeItem(item), { status: 201 });
}
