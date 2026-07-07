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
import mongoose from "mongoose";

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  type: z.enum(RECRUTEMENT_TYPES).optional(),
  shortDescription: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  contractType: z.string().trim().min(1).optional(),
  publishedAt: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  deadlineLabel: z.string().trim().nullable().optional(),
  offerStatus: z.enum(RECRUTEMENT_OFFER_STATUSES).optional(),
  emailContact: z.string().trim().email().optional(),
  references: z.string().trim().min(1).optional(),
  status: z.enum(RECRUTEMENT_CMS_STATUSES).optional(),
  slug: z.string().trim().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

function parseOptionalDate(value?: string | null) {
  if (value === null || value === "") return undefined;
  if (!value?.trim()) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function PATCH(req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
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

  const item = await RecrutementModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
  }

  const data = parsed.data;

  if (data.title !== undefined) item.title = data.title;
  if (data.type !== undefined) item.type = data.type;
  if (data.shortDescription !== undefined) item.shortDescription = data.shortDescription;
  if (data.location !== undefined) item.location = data.location;
  if (data.contractType !== undefined) item.contractType = data.contractType;
  if (data.publishedAt !== undefined) {
    item.publishedAt = parseOptionalDate(data.publishedAt) ?? item.publishedAt;
  }
  if (data.deadline !== undefined) {
    item.deadline = parseOptionalDate(data.deadline);
  }
  if (data.deadlineLabel !== undefined) {
    item.deadlineLabel = data.deadlineLabel ?? undefined;
  }
  if (data.offerStatus !== undefined) item.offerStatus = data.offerStatus;
  if (data.emailContact !== undefined) item.emailContact = data.emailContact;
  if (data.references !== undefined) item.references = data.references;

  if (data.status !== undefined) {
    item.status = data.status;
    if (data.status === "publie" && !item.publishedAt) {
      item.publishedAt = new Date();
    }
  }

  if (data.slug !== undefined) {
    const nextSlug = slugify(data.slug);
    const conflict = await RecrutementModel.findOne({
      slug: nextSlug,
      _id: { $ne: item._id },
    }).select("_id");
    if (conflict) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 409 });
    }
    item.slug = nextSlug;
  } else if (data.title !== undefined) {
    item.slug = await uniqueSlug(data.title, async (candidate) => {
      const existing = await RecrutementModel.findOne({
        slug: candidate,
        _id: { $ne: item._id },
      }).select("_id");
      return !!existing;
    });
  }

  await item.save();

  if (authResult.session) {
    await logCmsActivity({
      actor: authResult.session.user,
      actionType: "update",
      resource: "Recrutement",
      resourceLabel: "Offre de recrutement",
      resourceId: item._id.toString(),
      title: item.title,
      metadata: { status: item.status },
    });
  }

  return NextResponse.json(serializeRecrutement(item));
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
  const deleted = await RecrutementModel.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
  }

  if (authResult.session) {
    await logCmsActivity({
      actor: authResult.session.user,
      actionType: "delete",
      resource: "Recrutement",
      resourceLabel: "Offre de recrutement",
      resourceId: deleted._id.toString(),
      title: deleted.title,
    });
  }

  return NextResponse.json({ ok: true });
}
