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

/* ------------------------------------------------------------------ */
/*  Axes de recherche (CMS) — icônes & couleurs                        */
/* ------------------------------------------------------------------ */

export const RESEARCH_AXIS_ICONS = [
  "sprout",
  "mountain",
  "droplets",
  "flask",
  "chart",
  "leaf",
  "microscope",
  "globe",
] as const;

export type ResearchAxisIcon = (typeof RESEARCH_AXIS_ICONS)[number];

export const RESEARCH_AXIS_ICON_LABELS: Record<ResearchAxisIcon, string> = {
  sprout: "Pousse (fertilité)",
  mountain: "Montagne (érosion)",
  droplets: "Gouttes (eau / irrigation)",
  flask: "Fiole (analyse)",
  chart: "Graphique (modélisation / SIG)",
  leaf: "Feuille (agriculture durable)",
  microscope: "Microscope (laboratoire)",
  globe: "Globe (territoire)",
};

export const RESEARCH_AXIS_COLORS = [
  "amber",
  "blue",
  "violet",
  "rose",
  "emerald",
  "teal",
] as const;

export type ResearchAxisColor = (typeof RESEARCH_AXIS_COLORS)[number];

export const RESEARCH_AXIS_COLOR_LABELS: Record<ResearchAxisColor, string> = {
  amber: "Ambre",
  blue: "Bleu",
  violet: "Violet",
  rose: "Rose",
  emerald: "Vert",
  teal: "Turquoise",
};

/* ------------------------------------------------------------------ */
/*  Projets de recherche (CMS)                                         */
/* ------------------------------------------------------------------ */

export const RESEARCH_PROJECT_STATUSES = [
  "en_cours",
  "termine",
  "partenariat",
] as const;

export type ResearchProjectStatus = (typeof RESEARCH_PROJECT_STATUSES)[number];

export const RESEARCH_PROJECT_STATUS_LABELS: Record<
  ResearchProjectStatus,
  string
> = {
  en_cours: "En cours",
  termine: "Terminé",
  partenariat: "En partenariat",
};

export type CmsVideoPlatform =
  | "youtube"
  | "facebook"
  | "vimeo"
  | "dailymotion"
  | "autre";

export const CMS_VIDEO_PLATFORMS: CmsVideoPlatform[] = [
  "youtube",
  "facebook",
  "vimeo",
  "dailymotion",
  "autre",
];

export const CMS_VIDEO_PLATFORM_LABELS: Record<CmsVideoPlatform, string> = {
  youtube: "YouTube",
  facebook: "Facebook",
  vimeo: "Vimeo",
  dailymotion: "Dailymotion",
  autre: "Autre",
};
