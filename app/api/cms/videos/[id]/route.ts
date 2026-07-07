import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import CmsVideoModel from "@/lib/mongo/models/cms-video.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { parseVideoUrl } from "@/lib/services/cms/video-url";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  watchUrl: z.string().trim().url().optional(),
  status: z.enum(CMS_STATUSES).optional(),
  publishedAt: z.string().nullable().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

function serializeVideo(doc: {
  _id: { toString(): string };
  title: string;
  platform: string;
  watchUrl: string;
  embedUrl: string;
  status: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    platform: doc.platform,
    watchUrl: doc.watchUrl,
    embedUrl: doc.embedUrl,
    status: doc.status,
    publishedAt: doc.publishedAt?.toISOString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
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
  const video = await CmsVideoModel.findById(id);
  if (!video) {
    return NextResponse.json({ error: "Vidéo introuvable" }, { status: 404 });
  }

  const data = parsed.data;

  if (data.title !== undefined) video.title = data.title;

  if (data.watchUrl !== undefined) {
    const parsedVideo = parseVideoUrl(data.watchUrl);
    if (!parsedVideo) {
      return NextResponse.json(
        { error: "Lien vidéo non reconnu (utilisez une URL http ou https valide)" },
        { status: 400 },
      );
    }
    video.platform = parsedVideo.platform;
    video.watchUrl = parsedVideo.watchUrl;
    video.embedUrl = parsedVideo.embedUrl;
  }

  if (data.status !== undefined) {
    video.status = data.status;
    video.publishedAt = resolvePublishedAt({
      status: data.status,
      publishedAt: data.publishedAt ?? video.publishedAt,
    });
  } else if (data.publishedAt !== undefined && video.status === "publie") {
    video.publishedAt = data.publishedAt
      ? resolvePublishedAt({ status: "publie", publishedAt: data.publishedAt })
      : undefined;
  }

  video.updatedBy = new mongoose.Types.ObjectId(authResult.session.user.id);
  await video.save();

  return NextResponse.json(serializeVideo(video));
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
  const video = await CmsVideoModel.findById(id);
  if (!video) {
    return NextResponse.json({ error: "Vidéo introuvable" }, { status: 404 });
  }

  await video.deleteOne();
  return NextResponse.json({ success: true });
}
