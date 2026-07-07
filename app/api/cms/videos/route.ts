import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import CmsVideoModel from "@/lib/mongo/models/cms-video.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { parseVideoUrl } from "@/lib/services/cms/video-url";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";

const createSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis"),
  watchUrl: z.string().trim().url("Lien invalide"),
  status: z.enum(CMS_STATUSES).optional(),
  publishedAt: z.string().optional(),
});

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

  const items = await CmsVideoModel.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeVideo) });
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

  const parsedVideo = parseVideoUrl(parsed.data.watchUrl);
  if (!parsedVideo) {
    return NextResponse.json(
      { error: "Lien vidéo non reconnu (utilisez une URL http ou https valide)" },
      { status: 400 },
    );
  }

  const status = parsed.data.status ?? "brouillon";

  await connectDB();

  const video = await CmsVideoModel.create({
    title: parsed.data.title,
    platform: parsedVideo.platform,
    watchUrl: parsedVideo.watchUrl,
    embedUrl: parsedVideo.embedUrl,
    status,
    publishedAt: resolvePublishedAt({
      status,
      publishedAt: parsed.data.publishedAt,
    }),
    createdBy: authResult.session.user.id,
  });

  return NextResponse.json(serializeVideo(video), { status: 201 });
}
