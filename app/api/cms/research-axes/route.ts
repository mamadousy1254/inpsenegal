import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import ResearchAxisModel from "@/lib/mongo/models/research-axis.model";
import {
  CMS_STATUSES,
  RESEARCH_AXIS_COLORS,
  RESEARCH_AXIS_ICONS,
} from "@/lib/constants/cms";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeResearchAxis } from "@/lib/services/cms/serialize-research-axis";

const createSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis"),
  description: z.string().trim().min(1, "La description est requise"),
  stats: z.string().trim().optional(),
  icon: z.enum(RESEARCH_AXIS_ICONS),
  color: z.enum(RESEARCH_AXIS_COLORS),
  image: z.string().trim().min(1, "L'image est requise"),
  imagePublicId: z.string().trim().optional(),
  imageAlt: z.string().trim().min(1, "Le texte alternatif est requis"),
  order: z.number().int().optional(),
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

  const items = await ResearchAxisModel.find(filter)
    .sort({ order: 1, publishedAt: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeResearchAxis) });
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

  const status = parsed.data.status ?? "brouillon";

  await connectDB();

  const axis = await ResearchAxisModel.create({
    title: parsed.data.title,
    description: parsed.data.description,
    stats: parsed.data.stats,
    icon: parsed.data.icon,
    color: parsed.data.color,
    image: parsed.data.image,
    imagePublicId: parsed.data.imagePublicId,
    imageAlt: parsed.data.imageAlt,
    order: parsed.data.order ?? 0,
    status,
    publishedAt: resolvePublishedAt({
      status,
      publishedAt: parsed.data.publishedAt,
    }),
    createdBy: authResult.session.user.id,
  });

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "create",
    resource: "ResearchAxis",
    resourceLabel: "Axe de recherche",
    resourceId: axis._id.toString(),
    title: axis.title,
    metadata: { status: axis.status },
  });

  return NextResponse.json(serializeResearchAxis(axis), { status: 201 });
}
