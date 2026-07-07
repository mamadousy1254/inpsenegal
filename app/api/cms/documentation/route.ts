import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import DocumentationResourceModel from "@/lib/mongo/models/documentation-resource.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import {
  DOCUMENTATION_RUBRIQUES,
  DOCUMENTATION_DOC_TYPES,
  OPEN_DATA_FORMATS,
  TEXTES_LEGAL_TYPES,
} from "@/lib/constants/documentation";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const createSchema = z.object({
  rubrique: z.enum(DOCUMENTATION_RUBRIQUES),
  title: z.string().trim().min(1, "Le titre est requis"),
  description: z.string().trim().min(1, "La description est requise"),
  year: z.coerce.number().int().min(1900).max(2100),
  status: z.enum(CMS_STATUSES).optional(),
  category: z.string().trim().optional(),
  issue: z.string().trim().optional(),
  format: z.enum(OPEN_DATA_FORMATS).optional(),
  docType: z.enum(DOCUMENTATION_DOC_TYPES).optional(),
  legalType: z.enum(TEXTES_LEGAL_TYPES).optional(),
  legalDate: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  fileSize: z.string().trim().optional(),
  author: z.string().trim().optional(),
  pdfUrl: z.string().trim().url().optional(),
  pdfPublicId: z.string().trim().optional(),
  pdfFileName: z.string().trim().optional(),
  downloadUrl: z.string().trim().url().optional(),
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
  const rubrique = searchParams.get("rubrique");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status && CMS_STATUSES.includes(status as (typeof CMS_STATUSES)[number])) {
    filter.status = status;
  }
  if (
    rubrique &&
    DOCUMENTATION_RUBRIQUES.includes(rubrique as (typeof DOCUMENTATION_RUBRIQUES)[number])
  ) {
    filter.rubrique = rubrique;
  }

  const items = await DocumentationResourceModel.find(filter)
    .sort({ year: -1, publishedAt: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeDocumentationResource) });
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
        const existing = await DocumentationResourceModel.findOne({
          rubrique: data.rubrique,
          slug: candidate,
        }).select("_id");
        return !!existing;
      });

  const item = await DocumentationResourceModel.create({
    rubrique: data.rubrique,
    slug,
    title: data.title,
    description: data.description,
    year: data.year,
    status,
    category: data.category,
    issue: data.issue,
    format: data.format,
    docType: data.docType,
    legalType: data.legalType,
    legalDate: data.legalDate,
    reference: data.reference,
    fileSize: data.fileSize,
    author: data.author,
    pdfUrl: data.pdfUrl,
    pdfPublicId: data.pdfPublicId,
    pdfFileName: data.pdfFileName,
    downloadUrl: data.downloadUrl,
    publishedAt: resolvePublishedAt({ status, publishedAt: data.publishedAt }),
    createdBy: authResult.session!.user.id,
  });

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "create",
    resource: "Documentation",
    resourceLabel: "Ressource documentaire",
    resourceId: item._id.toString(),
    title: item.title,
    metadata: { status: item.status },
  });

  return NextResponse.json(serializeDocumentationResource(item), { status: 201 });
}
