export const CMS_STATUSES = ["brouillon", "publie"] as const;
export type CmsStatus = (typeof CMS_STATUSES)[number];

export const CMS_STATUS_LABELS: Record<CmsStatus, string> = {
  brouillon: "Brouillon",
  publie: "Publié",
};

export const CMS_CLOUDINARY_ROOT = "cms";

export const CMS_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const CMS_PDF_MAX_BYTES = 15 * 1024 * 1024;

export const CMS_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const CMS_PDF_MIME_TYPES = ["application/pdf"] as const;

export type NewsCategory =
  | "evenements"
  | "recherche"
  | "partenariats"
  | "projets"
  | "publications";

export const NEWS_CATEGORIES: NewsCategory[] = [
  "evenements",
  "recherche",
  "partenariats",
  "projets",
  "publications",
];

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  evenements: "Événements",
  recherche: "Recherche",
  partenariats: "Partenariats",
  projets: "Projets",
  publications: "Publications",
};

export type PublicationType =
  | "rapport-technique"
  | "article-scientifique"
  | "etude-nationale"
  | "fiche-technique";

export const PUBLICATION_TYPES: PublicationType[] = [
  "rapport-technique",
  "article-scientifique",
  "etude-nationale",
  "fiche-technique",
];

export const PUBLICATION_TYPE_LABELS: Record<PublicationType, string> = {
  "rapport-technique": "Rapport technique",
  "article-scientifique": "Article scientifique",
  "etude-nationale": "Étude nationale",
  "fiche-technique": "Fiche technique",
};

export const RESEARCH_AXES = [
  "Fertilité des sols",
  "Dégradation & érosion",
  "Salinisation & irrigation",
  "Analyse physico-chimique",
  "Modélisation & SIG",
  "Agriculture durable",
] as const;

export type CmsVideoPlatform = "youtube" | "facebook";

export const CMS_VIDEO_PLATFORMS: CmsVideoPlatform[] = ["youtube", "facebook"];
