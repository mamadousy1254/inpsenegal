import { connectDB } from "@/lib/mongo/db";
import ActualiteModel from "@/lib/mongo/models/actualite.model";
import CmsVideoModel from "@/lib/mongo/models/cms-video.model";
import PublicationModel from "@/lib/mongo/models/publication.model";
import MediathequeItemModel from "@/lib/mongo/models/mediatheque-item.model";
import {
  serializeActualite,
  toNewsItem,
} from "@/lib/services/cms/serialize-actualite";
import {
  serializePublication,
  toPublicationItem,
} from "@/lib/services/cms/serialize-publication";
import {
  serializeMediathequeItem,
  toGalleryImage,
  type GalleryImage,
} from "@/lib/services/cms/serialize-mediatheque";

export async function getPublishedActualites(limit?: number) {
  await connectDB();

  const query = ActualiteModel.find({ status: "publie" })
    .sort({ publishedAt: -1, createdAt: -1 });

  if (limit) query.limit(limit);

  const docs = await query.lean();
  return docs.map((doc) => serializeActualite(doc));
}

export async function getPublishedActualiteBySlug(slug: string) {
  await connectDB();

  const doc = await ActualiteModel.findOne({ slug, status: "publie" }).lean();
  if (!doc) return null;

  return serializeActualite(doc);
}

export async function getPublishedActualitesAsNews(limit?: number) {
  const items = await getPublishedActualites(limit);
  return items.map((item) => toNewsItem(item));
}

export async function getPublishedVideos(limit?: number) {
  await connectDB();

  const query = CmsVideoModel.find({ status: "publie" }).sort({
    publishedAt: -1,
    createdAt: -1,
  });

  if (limit) query.limit(limit);

  const docs = await query.lean();
  return docs.map((doc) => ({
    _id: doc._id.toString(),
    title: doc.title,
    platform: doc.platform,
    watchUrl: doc.watchUrl,
    embedUrl: doc.embedUrl,
    status: doc.status,
    publishedAt: doc.publishedAt?.toISOString(),
  }));
}

export async function getPublishedScientificPublications(limit?: number) {
  await connectDB();

  const query = PublicationModel.find({
    status: "publie",
    $or: [{ showOnScientificPage: true }, { showOnScientificPage: { $exists: false } }],
  }).sort({
    publishedAt: -1,
    year: -1,
    createdAt: -1,
  });

  if (limit) query.limit(limit);

  const docs = await query.lean();
  return docs.map((doc) => serializePublication(doc));
}

export async function getPublishedScientificPublicationsAsItems(limit?: number) {
  const items = await getPublishedScientificPublications(limit);
  return items.map((item) => toPublicationItem(item));
}

export async function getPublishedPublications(limit?: number) {
  await connectDB();

  const query = PublicationModel.find({ status: "publie" }).sort({
    publishedAt: -1,
    year: -1,
    createdAt: -1,
  });

  if (limit) query.limit(limit);

  const docs = await query.lean();
  return docs.map((doc) => serializePublication(doc));
}

export async function getPublishedPublicationBySlug(slug: string) {
  await connectDB();

  const doc = await PublicationModel.findOne({ slug, status: "publie" }).lean();
  if (!doc) return null;

  return serializePublication(doc);
}

export async function getPublishedPublicationsAsItems(limit?: number) {
  const items = await getPublishedPublications(limit);
  return items.map((item) => toPublicationItem(item));
}

export async function getPublishedMediathequeItems(limit?: number) {
  await connectDB();

  const query = MediathequeItemModel.find({ status: "publie" }).sort({
    publishedAt: -1,
    createdAt: -1,
  });

  if (limit) query.limit(limit);

  const docs = await query.lean();
  return docs.map((doc) => serializeMediathequeItem(doc));
}

export async function getPublishedGallery(limit?: number): Promise<GalleryImage[]> {
  const items = await getPublishedMediathequeItems(limit);
  return items.map((item) => toGalleryImage(item));
}

/** Slugs publiés pour le sitemap */
export async function getPublishedActualiteSlugs() {
  await connectDB();
  const docs = await ActualiteModel.find({ status: "publie" })
    .select("slug publishedAt updatedAt")
    .sort({ publishedAt: -1 })
    .lean();
  return docs.map((doc) => ({
    slug: doc.slug,
    lastModified: doc.updatedAt ?? doc.publishedAt ?? new Date(),
  }));
}

export async function getPublishedPublicationSlugs() {
  await connectDB();
  const docs = await PublicationModel.find({ status: "publie" })
    .select("slug publishedAt updatedAt")
    .sort({ publishedAt: -1 })
    .lean();
  return docs.map((doc) => ({
    slug: doc.slug,
    lastModified: doc.updatedAt ?? doc.publishedAt ?? new Date(),
  }));
}
