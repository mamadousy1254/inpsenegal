import type { MetadataRoute } from "next";
import {
  getPublishedActualiteSlugs,
  getPublishedPublicationSlugs,
} from "@/lib/services/cms/get-published-content";
import { getPublishedDocumentationSlugs } from "@/lib/services/documentation/get-published-documentation";
import {
  DOCUMENTATION_RUBRIQUE_PATHS,
  type DocumentationRubrique,
} from "@/lib/constants/documentation";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inp.sn";

const staticPaths = [
  "",
  "/institut",
  "/institut/presentation",
  "/institut/objectifs",
  "/institut/missions",
  "/institut/axes-intervention",
  "/institut/organigramme",
  "/institut/mot-directeur",
  "/missions",
  "/recherche",
  "/recherche/publications-scientifiques",
  "/cartographie",
  "/laboratoires",
  "/publications",
  "/actualites",
  "/mediatheque",
  "/services",
  "/partenaires",
  "/documentation",
  "/demande-analyse",
  "/contact",
  "/mentions-legales",
];

function documentationDetailUrl(rubrique: DocumentationRubrique | "documentation", slug: string) {
  if (rubrique === "textes-reglementaires") {
    return `${baseUrl}/documentation/textes-reglementaires/${slug}`;
  }
  return `${baseUrl}/documentation/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const [publications, actualites, documentation] = await Promise.all([
    getPublishedPublicationSlugs(),
    getPublishedActualiteSlugs(),
    getPublishedDocumentationSlugs(),
  ]);

  const publicationEntries = publications.map((pub) => ({
    url: `${baseUrl}/publications/${pub.slug}`,
    lastModified: pub.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const newsEntries = actualites.map((item) => ({
    url: `${baseUrl}/actualites/${item.slug}`,
    lastModified: item.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const docEntries = documentation.map((d) => ({
    url: documentationDetailUrl(d.rubrique, d.slug),
    lastModified: d.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const docListPaths = Object.values(DOCUMENTATION_RUBRIQUE_PATHS).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...publicationEntries,
    ...newsEntries,
    ...docListPaths,
    ...docEntries,
  ];
}
