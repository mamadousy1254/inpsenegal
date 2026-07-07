import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import ResearchProjectModel from "@/lib/mongo/models/research-project.model";
import { CMS_STATUSES, RESEARCH_PROJECT_STATUSES } from "@/lib/constants/cms";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeResearchProject } from "@/lib/services/cms/serialize-research-project";

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  lead: z.string().trim().min(1).optional(),
  year: z.string().trim().min(1).optional(),
  projectStatus: z.enum(RESEARCH_PROJECT_STATUSES).optional(),
  description: z.string().trim().min(1).optional(),
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
  const project = await ResearchProjectModel.findById(id);
  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const data = parsed.data;

  if (data.title !== undefined) project.title = data.title;
  if (data.lead !== undefined) project.lead = data.lead;
  if (data.year !== undefined) project.year = data.year;
  if (data.projectStatus !== undefined) project.projectStatus = data.projectStatus;
  if (data.description !== undefined) project.description = data.description;
  if (data.order !== undefined) project.order = data.order;

  if (data.status !== undefined) {
    project.status = data.status;
    project.publishedAt = resolvePublishedAt({
      status: data.status,
      publishedAt: data.publishedAt ?? project.publishedAt,
    });
  } else if (data.publishedAt !== undefined && project.status === "publie") {
    project.publishedAt = data.publishedAt
      ? resolvePublishedAt({ status: "publie", publishedAt: data.publishedAt })
      : undefined;
  }

  project.updatedBy = new mongoose.Types.ObjectId(authResult.session.user.id);
  await project.save();

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "update",
    resource: "ResearchProject",
    resourceLabel: "Projet de recherche",
    resourceId: project._id.toString(),
    title: project.title,
    metadata: { status: project.status },
  });

  return NextResponse.json(serializeResearchProject(project));
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
  const project = await ResearchProjectModel.findById(id);
  if (!project) {
    return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  }

  const deletedTitle = project.title;
  const deletedId = project._id.toString();
  await project.deleteOne();

  if (authResult.session) {
    await logCmsActivity({
      actor: authResult.session.user,
      actionType: "delete",
      resource: "ResearchProject",
      resourceLabel: "Projet de recherche",
      resourceId: deletedId,
      title: deletedTitle,
    });
  }

  return NextResponse.json({ success: true });
}
