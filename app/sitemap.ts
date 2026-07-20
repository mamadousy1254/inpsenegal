import type { MetadataRoute } from "next";
import {
  getPublishedActualiteSlugs,
  getPublishedPublicationSlugs,
} from "@/lib/services/cms/get-published-content";
import { getPublishedDocumentationSlugs } from "@/lib/services/documentation/get-published-documentation";
import { getPublishedInstitutDelegationSlugs } from "@/lib/services/institut/get-published-institut";
import { getPublishedRecrutements } from "@/lib/services/recrutement/get-published-recrutements";
import {
  DOCUMENTATION_RUBRIQUE_PATHS,
  type DocumentationRubrique,
} from "@/lib/constants/documentation";
import { getSiteUrl } from "@/lib/constants/site-url";

/**
 * Pages publiques indexables.
 * Exclues volontairement : /login, /dashboard/*, /partage/* (liens privés GED).
 */
const STATIC_PUBLIC_PATHS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.3 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.3 },
  { path: "/accessibilite", changeFrequency: "yearly", priority: 0.3 },
  { path: "/plan-du-site", changeFrequency: "monthly", priority: 0.4 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/liens-utiles", changeFrequency: "monthly", priority: 0.5 },
  { path: "/institut", changeFrequency: "monthly", priority: 0.9 },
  { path: "/institut/presentation", changeFrequency: "monthly", priority: 0.8 },
  { path: "/institut/objectifs", changeFrequency: "monthly", priority: 0.7 },
  { path: "/institut/missions", changeFrequency: "monthly", priority: 0.8 },
  { path: "/institut/axes-intervention", changeFrequency: "monthly", priority: 0.7 },
  { path: "/institut/organigramme", changeFrequency: "monthly", priority: 0.7 },
  { path: "/institut/mot-directeur", changeFrequency: "monthly", priority: 0.7 },
  { path: "/institut/equipe", changeFrequency: "monthly", priority: 0.7 },
  { path: "/institut/cadre-juridique", changeFrequency: "yearly", priority: 0.5 },
  { path: "/activites", changeFrequency: "monthly", priority: 0.8 },
  {
    path: "/activites/gestion-durable-des-terres",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/activites/appui-aux-politiques-agricoles",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/activites/formation-renforcement-des-capacites",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/missions", changeFrequency: "monthly", priority: 0.8 },
  { path: "/recherche", changeFrequency: "weekly", priority: 0.9 },
  {
    path: "/recherche/publications-scientifiques",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/recherche/programmes-de-recherche",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/recherche/projets-scientifiques",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/recherche/innovation-sig", changeFrequency: "monthly", priority: 0.7 },
  { path: "/cartographie", changeFrequency: "monthly", priority: 0.8 },
  { path: "/laboratoires", changeFrequency: "monthly", priority: 0.8 },
  { path: "/publications", changeFrequency: "weekly", priority: 0.9 },
  { path: "/actualites", changeFrequency: "weekly", priority: 0.9 },
  { path: "/mediatheque", changeFrequency: "weekly", priority: 0.8 },
  { path: "/cartotheque", changeFrequency: "weekly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/partenaires", changeFrequency: "monthly", priority: 0.7 },
  { path: "/documentation", changeFrequency: "weekly", priority: 0.8 },
  { path: "/demande-analyse", changeFrequency: "monthly", priority: 0.8 },
  { path: "/candidature-spontanee", changeFrequency: "weekly", priority: 0.7 },
];

function documentationDetailUrl(
  rubrique: DocumentationRubrique | "documentation",
  slug: string,
  baseUrl: string,
) {
  if (rubrique === "textes-reglementaires") {
    return `${baseUrl}/documentation/textes-reglementaires/${slug}`;
  }
  return `${baseUrl}/documentation/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PUBLIC_PATHS.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }),
  );

  const docListEntries: MetadataRoute.Sitemap = Object.values(
    DOCUMENTATION_RUBRIQUE_PATHS,
  ).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const [
    publications,
    actualites,
    documentation,
    delegationSlugs,
    recrutements,
  ] = await Promise.all([
    getPublishedPublicationSlugs(),
    getPublishedActualiteSlugs(),
    getPublishedDocumentationSlugs(),
    getPublishedInstitutDelegationSlugs(),
    getPublishedRecrutements(),
  ]);

  const publicationEntries: MetadataRoute.Sitemap = publications.map((pub) => ({
    url: `${baseUrl}/publications/${pub.slug}`,
    lastModified: pub.lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const newsEntries: MetadataRoute.Sitemap = actualites.map((item) => ({
    url: `${baseUrl}/actualites/${item.slug}`,
    lastModified: item.lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const docEntries: MetadataRoute.Sitemap = documentation.map((d) => ({
    url: documentationDetailUrl(d.rubrique, d.slug, baseUrl),
    lastModified: d.lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const delegationEntries: MetadataRoute.Sitemap = delegationSlugs.map((slug) => ({
    url: `${baseUrl}/institut/delegations/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const recrutementEntries: MetadataRoute.Sitemap = recrutements.map((offer) => ({
    url: `${baseUrl}/candidature-spontanee/postuler/${offer.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...docListEntries,
    ...publicationEntries,
    ...newsEntries,
    ...docEntries,
    ...delegationEntries,
    ...recrutementEntries,
  ];
}
