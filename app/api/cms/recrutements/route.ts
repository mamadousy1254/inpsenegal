import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import RecrutementModel from "@/lib/mongo/models/recrutement.model";
import {
  RECRUTEMENT_CMS_STATUSES,
  RECRUTEMENT_OFFER_STATUSES,
  RECRUTEMENT_TYPES,
} from "@/lib/constants/recrutement";
import { serializeRecrutement } from "@/lib/services/recrutement/serialize-recrutement";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const createSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis"),
  type: z.enum(RECRUTEMENT_TYPES),
  shortDescription: z.string().trim().min(1, "La description est requise"),
  location: z.string().trim().min(1, "Le lieu est requis"),
  contractType: z.string().trim().min(1, "Le type de contrat est requis"),
  publishedAt: z.string().optional(),
  deadline: z.string().optional(),
  deadlineLabel: z.string().trim().optional(),
  offerStatus: z.enum(RECRUTEMENT_OFFER_STATUSES).optional(),
  emailContact: z.string().trim().email("Email invalide"),
  references: z.string().trim().min(1, "La référence est requise"),
  status: z.enum(RECRUTEMENT_CMS_STATUSES).optional(),
  slug: z.string().trim().optional(),
});

function parseOptionalDate(value?: string) {
  if (!value?.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function GET(req: Request) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (
    status &&
    RECRUTEMENT_CMS_STATUSES.includes(status as (typeof RECRUTEMENT_CMS_STATUSES)[number])
  ) {
    filter.status = status;
  }

  const items = await RecrutementModel.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeRecrutement) });
}

export async function POST(req: Request) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
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
        const existing = await RecrutementModel.findOne({ slug: candidate }).select("_id");
        return !!existing;
      });

  const item = await RecrutementModel.create({
    slug,
    title: data.title,
    type: data.type,
    shortDescription: data.shortDescription,
    location: data.location,
    contractType: data.contractType,
    publishedAt: parseOptionalDate(data.publishedAt) ?? (status === "publie" ? new Date() : undefined),
    deadline: parseOptionalDate(data.deadline),
    deadlineLabel: data.deadlineLabel,
    offerStatus: data.offerStatus ?? "ouvert",
    emailContact: data.emailContact,
    references: data.references,
    status,
  });

  if (authResult.session) {
    await logCmsActivity({
      actor: authResult.session.user,
      actionType: "create",
      resource: "Recrutement",
      resourceLabel: "Offre de recrutement",
      resourceId: item._id.toString(),
      title: item.title,
      metadata: { status: item.status },
    });
  }

  return NextResponse.json(serializeRecrutement(item), { status: 201 });
}
