import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import PartenaireModel from "@/lib/mongo/models/partenaire.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { PARTENAIRE_CATEGORIES } from "@/lib/constants/partenaires";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializePartenaire } from "@/lib/services/partenaires/serialize-partenaire";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { deleteCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const updateSchema = z.object({
  nom: z.string().trim().min(1).optional(),
  acronyme: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  category: z.enum(PARTENAIRE_CATEGORIES).optional(),
  logo: z.string().trim().min(1).optional(),
  logoPublicId: z.string().trim().nullable().optional(),
  siteWeb: z.string().trim().url().nullable().optional().or(z.literal("")),
  pays: z.string().trim().nullable().optional(),
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
  const item = await PartenaireModel.findById(id).lean();
  if (!item) {
    return NextResponse.json({ error: "Partenaire introuvable" }, { status: 404 });
  }

  return NextResponse.json(serializePartenaire(item));
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
  const item = await PartenaireModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Partenaire introuvable" }, { status: 404 });
  }

  const data = parsed.data;
  const previousLogoPublicId = item.logoPublicId;

  if (data.nom !== undefined) item.nom = data.nom;
  if (data.acronyme !== undefined) item.acronyme = data.acronyme;
  if (data.description !== undefined) item.description = data.description;
  if (data.category !== undefined) item.category = data.category;
  if (data.logo !== undefined) item.logo = data.logo;
  if (data.logoPublicId !== undefined) item.logoPublicId = data.logoPublicId ?? undefined;
  if (data.siteWeb !== undefined) item.siteWeb = data.siteWeb || undefined;
  if (data.pays !== undefined) item.pays = data.pays ?? undefined;
  if (data.sortOrder !== undefined) item.sortOrder = data.sortOrder;

  if (data.slug !== undefined) {
    const nextSlug = slugify(data.slug);
    const taken = await PartenaireModel.findOne({
      slug: nextSlug,
      _id: { $ne: item._id },
    }).select("_id");
    if (taken) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }
    item.slug = nextSlug;
  } else if (data.acronyme !== undefined) {
    item.slug = await uniqueSlug(data.acronyme, async (candidate) => {
      const existing = await PartenaireModel.findOne({
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

  if (data.logoPublicId && previousLogoPublicId && previousLogoPublicId !== data.logoPublicId) {
    try {
      await deleteCmsAsset({ publicId: previousLogoPublicId, resourceType: "image" });
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json(serializePartenaire(item));
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
  const item = await PartenaireModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Partenaire introuvable" }, { status: 404 });
  }

  if (item.logoPublicId) {
    try {
      await deleteCmsAsset({ publicId: item.logoPublicId, resourceType: "image" });
    } catch {
      /* ignore */
    }
  }

  await item.deleteOne();
  return NextResponse.json({ success: true });
}
