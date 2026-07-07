import { NextResponse } from "next/server";
import mongoose from "mongoose";
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

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  stats: z.string().trim().optional(),
  icon: z.enum(RESEARCH_AXIS_ICONS).optional(),
  color: z.enum(RESEARCH_AXIS_COLORS).optional(),
  image: z.string().trim().min(1).optional(),
  imagePublicId: z.string().trim().nullable().optional(),
  imageAlt: z.string().trim().min(1).optional(),
  order: z.number().int().optional(),
  status: z.enum(CMS_STATUSES).optional(),
  publishedAt: z.string().nullable().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

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
  const axis = await ResearchAxisModel.findById(id);
  if (!axis) {
    return NextResponse.json({ error: "Axe introuvable" }, { status: 404 });
  }

  const data = parsed.data;

  if (data.title !== undefined) axis.title = data.title;
  if (data.description !== undefined) axis.description = data.description;
  if (data.stats !== undefined) axis.stats = data.stats;
  if (data.icon !== undefined) axis.icon = data.icon;
  if (data.color !== undefined) axis.color = data.color;
  if (data.image !== undefined) axis.image = data.image;
  if (data.imagePublicId !== undefined) {
    axis.imagePublicId = data.imagePublicId ?? undefined;
  }
  if (data.imageAlt !== undefined) axis.imageAlt = data.imageAlt;
  if (data.order !== undefined) axis.order = data.order;

  if (data.status !== undefined) {
    axis.status = data.status;
    axis.publishedAt = resolvePublishedAt({
      status: data.status,
      publishedAt: data.publishedAt ?? axis.publishedAt,
    });
  } else if (data.publishedAt !== undefined && axis.status === "publie") {
    axis.publishedAt = data.publishedAt
      ? resolvePublishedAt({ status: "publie", publishedAt: data.publishedAt })
      : undefined;
  }

  axis.updatedBy = new mongoose.Types.ObjectId(authResult.session.user.id);
  await axis.save();

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "update",
    resource: "ResearchAxis",
    resourceLabel: "Axe de recherche",
    resourceId: axis._id.toString(),
    title: axis.title,
    metadata: { status: axis.status },
  });

  return NextResponse.json(serializeResearchAxis(axis));
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
  const axis = await ResearchAxisModel.findById(id);
  if (!axis) {
    return NextResponse.json({ error: "Axe introuvable" }, { status: 404 });
  }

  const deletedTitle = axis.title;
  const deletedId = axis._id.toString();
  await axis.deleteOne();

  if (authResult.session) {
    await logCmsActivity({
      actor: authResult.session.user,
      actionType: "delete",
      resource: "ResearchAxis",
      resourceLabel: "Axe de recherche",
      resourceId: deletedId,
      title: deletedTitle,
    });
  }

  return NextResponse.json({ success: true });
}
