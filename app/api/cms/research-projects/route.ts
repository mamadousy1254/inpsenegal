import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import ResearchProjectModel from "@/lib/mongo/models/research-project.model";
import { CMS_STATUSES, RESEARCH_PROJECT_STATUSES } from "@/lib/constants/cms";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeResearchProject } from "@/lib/services/cms/serialize-research-project";

const createSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis"),
  lead: z.string().trim().min(1, "Le responsable est requis"),
  year: z.string().trim().min(1, "La période est requise"),
  projectStatus: z.enum(RESEARCH_PROJECT_STATUSES),
  description: z.string().trim().min(1, "La description est requise"),
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

  const items = await ResearchProjectModel.find(filter)
    .sort({ order: 1, publishedAt: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeResearchProject) });
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

  const project = await ResearchProjectModel.create({
    title: parsed.data.title,
    lead: parsed.data.lead,
    year: parsed.data.year,
    projectStatus: parsed.data.projectStatus,
    description: parsed.data.description,
    order: parsed.data.order ?? 0,
    status,
    publishedAt: resolvePublishedAt({
      status,
      publishedAt: parsed.data.publishedAt,
    }),
    createdBy: authResult.session.user.id,
  });

  return NextResponse.json(serializeResearchProject(project), { status: 201 });
}
