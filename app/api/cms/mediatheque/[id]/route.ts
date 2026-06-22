import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import MediathequeItemModel from "@/lib/mongo/models/mediatheque-item.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeMediathequeItem } from "@/lib/services/cms/serialize-mediatheque";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { deleteCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";

const updateSchema = z.object({
  imageUrl: z.string().trim().url().optional(),
  imagePublicId: z.string().trim().optional(),
  alt: z.string().trim().min(1).optional(),
  caption: z.string().trim().min(1).optional(),
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
  const item = await MediathequeItemModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
  }

  const data = parsed.data;
  const previousImagePublicId = item.imagePublicId;

  if (data.imageUrl !== undefined) item.imageUrl = data.imageUrl;
  if (data.imagePublicId !== undefined) item.imagePublicId = data.imagePublicId;
  if (data.alt !== undefined) item.alt = data.alt;
  if (data.caption !== undefined) item.caption = data.caption;

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

  item.updatedBy = new mongoose.Types.ObjectId(authResult.session.user.id);
  await item.save();

  if (
    data.imagePublicId &&
    previousImagePublicId &&
    previousImagePublicId !== data.imagePublicId
  ) {
    try {
      await deleteCmsAsset({
        publicId: previousImagePublicId,
        resourceType: "image",
      });
    } catch {
      /* ignore cleanup errors */
    }
  }

  return NextResponse.json(serializeMediathequeItem(item));
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
  const item = await MediathequeItemModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
  }

  try {
    await deleteCmsAsset({
      publicId: item.imagePublicId,
      resourceType: "image",
    });
  } catch {
    /* ignore cleanup errors */
  }

  await item.deleteOne();
  return NextResponse.json({ success: true });
}
