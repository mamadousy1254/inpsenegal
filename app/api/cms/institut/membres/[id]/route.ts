import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import InstitutMembreModel from "@/lib/mongo/models/institut-membre.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { INSTITUT_POLE_TYPES } from "@/lib/constants/institut";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeInstitutMembre } from "@/lib/services/institut/serialize-institut-membre";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";
import { deleteCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const updateSchema = z.object({
  nom: z.string().trim().min(1).optional(),
  fonction: z.string().trim().min(1).optional(),
  pole: z.enum(INSTITUT_POLE_TYPES).optional(),
  zone: z.string().trim().nullable().optional(),
  photo: z.string().trim().url().nullable().optional(),
  photoPublicId: z.string().trim().nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(CMS_STATUSES).optional(),
  publishedAt: z.string().nullable().optional(),
  slug: z.string().trim().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();
  const item = await InstitutMembreModel.findById(id).lean();
  if (!item) {
    return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
  }

  return NextResponse.json(serializeInstitutMembre(item));
}

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
  const item = await InstitutMembreModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
  }

  const data = parsed.data;
  const previousPhotoPublicId = item.photoPublicId;

  if (data.nom !== undefined) item.nom = data.nom;
  if (data.fonction !== undefined) item.fonction = data.fonction;
  if (data.pole !== undefined) item.pole = data.pole;
  if (data.zone !== undefined) item.zone = data.zone ?? undefined;
  if (data.photo !== undefined) item.photo = data.photo ?? undefined;
  if (data.photoPublicId !== undefined) item.photoPublicId = data.photoPublicId ?? undefined;
  if (data.sortOrder !== undefined) item.sortOrder = data.sortOrder;

  if (data.slug !== undefined) {
    const nextSlug = slugify(data.slug);
    const taken = await InstitutMembreModel.findOne({
      slug: nextSlug,
      _id: { $ne: item._id },
    }).select("_id");
    if (taken) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }
    item.slug = nextSlug;
  } else if (data.nom !== undefined) {
    item.slug = await uniqueSlug(data.nom, async (candidate) => {
      const existing = await InstitutMembreModel.findOne({
        slug: candidate,
        _id: { $ne: item._id },
      }).select("_id");
      return !!existing;
    });
  }

  if (data.status !== undefined) {
    item.status = data.status;
    item.publishedAt = resolvePublishedAt({
      status: data.status,
      publishedAt: data.publishedAt ?? item.publishedAt,
    });
  } else if (data.publishedAt !== undefined && item.status === "publie") {
    item.publishedAt = data.publishedAt
      ? resolvePublishedAt({ status: "publie", publishedAt: data.publishedAt })
      : undefined;
  }

  item.updatedBy = new mongoose.Types.ObjectId(authResult.session!.user.id);
  await item.save();

  if (data.photoPublicId && previousPhotoPublicId && previousPhotoPublicId !== data.photoPublicId) {
    try {
      await deleteCmsAsset({ publicId: previousPhotoPublicId, resourceType: "image" });
    } catch {
      /* ignore */
    }
  }

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "update",
    resource: "InstitutMembre",
    resourceLabel: "Membre de l'équipe",
    resourceId: item._id.toString(),
    title: item.nom,
    metadata: { status: item.status },
  });

  return NextResponse.json(serializeInstitutMembre(item));
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
  const item = await InstitutMembreModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Membre introuvable" }, { status: 404 });
  }

  if (item.photoPublicId) {
    try {
      await deleteCmsAsset({ publicId: item.photoPublicId, resourceType: "image" });
    } catch {
      /* ignore */
    }
  }

  const deletedTitle = item.nom;
  const deletedId = item._id.toString();
  await item.deleteOne();

  if (authResult.session) {
    await logCmsActivity({
      actor: authResult.session.user,
      actionType: "delete",
      resource: "InstitutMembre",
      resourceLabel: "Membre de l'équipe",
      resourceId: deletedId,
      title: deletedTitle,
    });
  }

  return NextResponse.json({ success: true });
}
