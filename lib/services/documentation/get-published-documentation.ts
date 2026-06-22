import { connectDB } from "@/lib/mongo/db";
import DocumentationResourceModel from "@/lib/mongo/models/documentation-resource.model";
import {
  DOCUMENTATION_RUBRIQUES,
  type DocumentationRubrique,
} from "@/lib/constants/documentation";
import { serializeDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

export async function getPublishedDocumentation(rubrique: DocumentationRubrique) {
  await connectDB();

  const rubriqueFilter =
    rubrique === "rapports-publications"
      ? { $in: ["rapports-publications", "documentation"] }
      : rubrique;

  const items = await DocumentationResourceModel.find({
    rubrique: rubriqueFilter,
    status: "publie",
  })
    .sort({ year: -1, publishedAt: -1, createdAt: -1 })
    .lean();

  return items.map(serializeDocumentationResource);
}

export async function getPublishedDocumentationBySlug(slug: string) {
  await connectDB();

  const doc = await DocumentationResourceModel.findOne({
    slug,
    status: "publie",
  }).lean();

  if (!doc) return null;
  return serializeDocumentationResource(doc);
}

export async function getPublishedDocumentationByRubriqueAndSlug(
  rubrique: DocumentationRubrique,
  slug: string,
) {
  await connectDB();

  const doc = await DocumentationResourceModel.findOne({
    rubrique,
    slug,
    status: "publie",
  }).lean();

  if (!doc) return null;
  return serializeDocumentationResource(doc);
}

export async function getPublishedDocumentationCounts() {
  await connectDB();

  const counts = Object.fromEntries(
    DOCUMENTATION_RUBRIQUES.map((rubrique) => [rubrique, 0]),
  ) as Record<DocumentationRubrique, number>;

  const grouped = await DocumentationResourceModel.aggregate<{ _id: DocumentationRubrique; count: number }>([
    { $match: { status: "publie" } },
    { $group: { _id: "$rubrique", count: { $sum: 1 } } },
  ]);

  for (const row of grouped) {
    if (row._id === "documentation") {
      counts["rapports-publications"] += row.count;
    } else if (DOCUMENTATION_RUBRIQUES.includes(row._id)) {
      counts[row._id] = row.count;
    }
  }

  return counts;
}

export async function getPublishedDocumentationSlugs() {
  await connectDB();

  const docs = await DocumentationResourceModel.find({ status: "publie" })
    .select("slug rubrique publishedAt updatedAt")
    .sort({ publishedAt: -1, year: -1 })
    .lean();

  return docs.map((doc) => ({
    slug: doc.slug,
    rubrique: doc.rubrique as DocumentationRubrique,
    lastModified: doc.updatedAt ?? doc.publishedAt ?? new Date(),
  }));
}
