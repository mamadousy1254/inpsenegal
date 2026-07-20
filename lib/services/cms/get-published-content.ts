import { connectDB } from "@/lib/mongo/db";
import ActualiteModel from "@/lib/mongo/models/actualite.model";
import CmsVideoModel from "@/lib/mongo/models/cms-video.model";
import PublicationModel from "@/lib/mongo/models/publication.model";
import MediathequeItemModel from "@/lib/mongo/models/mediatheque-item.model";
import CartothequeItemModel from "@/lib/mongo/models/cartotheque-item.model";
import ResearchAxisModel from "@/lib/mongo/models/research-axis.model";
import ResearchProjectModel from "@/lib/mongo/models/research-project.model";
import {
  serializeActualite,
  toNewsItem,
} from "@/lib/services/cms/serialize-actualite";
import { serializeResearchAxis } from "@/lib/services/cms/serialize-research-axis";
import { serializeResearchProject } from "@/lib/services/cms/serialize-research-project";
import {
  serializePublication,
  toPublicationItem,
} from "@/lib/services/cms/serialize-publication";
import {
  serializeMediathequeItem,
  toGalleryImage,
  type GalleryImage,
} from "@/lib/services/cms/serialize-mediatheque";
import {
  serializeCartothequeItem,
  toPublicCartothequeMap,
  type PublicCartothequeMap,
} from "@/lib/services/cms/serialize-cartotheque";

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

export async function getPublishedResearchAxes(limit?: number) {
  await connectDB();

  const query = ResearchAxisModel.find({ status: "publie" }).sort({
    order: 1,
    publishedAt: -1,
    createdAt: -1,
  });

  if (limit) query.limit(limit);

  const docs = await query.lean();
  return docs.map((doc) => serializeResearchAxis(doc));
}

export async function getPublishedResearchProjects(limit?: number) {
  await connectDB();

  const query = ResearchProjectModel.find({ status: "publie" }).sort({
    order: 1,
    publishedAt: -1,
    createdAt: -1,
  });

  if (limit) query.limit(limit);

  const docs = await query.lean();
  return docs.map((doc) => serializeResearchProject(doc));
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

export async function getPublishedCartothequeItems(limit?: number) {
  await connectDB();

  const query = CartothequeItemModel.find({ status: "publie" }).sort({
    publishedAt: -1,
    createdAt: -1,
  });

  if (limit) query.limit(limit);

  const docs = await query.lean();
  return docs.map((doc) => serializeCartothequeItem(doc));
}

export async function getPublishedCartothequeMaps(
  limit?: number,
): Promise<PublicCartothequeMap[]> {
  const items = await getPublishedCartothequeItems(limit);
  return items.map((item) => toPublicCartothequeMap(item));
}

export async function getPublishedCartothequePaginated(
  page: number,
  pageSize: number,
): Promise<{
  items: PublicCartothequeMap[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  await connectDB();

  const safePage = Math.max(1, page);
  const safeSize = Math.min(48, Math.max(1, pageSize));
  const skip = (safePage - 1) * safeSize;

  const filter = { status: "publie" as const };

  const [docs, total] = await Promise.all([
    CartothequeItemModel.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(safeSize)
      .lean(),
    CartothequeItemModel.countDocuments(filter),
  ]);

  const items = docs.map((doc) =>
    toPublicCartothequeMap(serializeCartothequeItem(doc)),
  );

  return {
    items,
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  };
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
