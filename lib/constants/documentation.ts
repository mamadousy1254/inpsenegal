
export const DOCUMENTATION_RUBRIQUES = [
  "rapports-publications",
  "guides-techniques",
  "bulletins-scientifiques",
  "open-data",
  "archives",
  "textes-reglementaires",
] as const;

export type DocumentationRubrique = (typeof DOCUMENTATION_RUBRIQUES)[number];

export const DOCUMENTATION_RUBRIQUE_LABELS: Record<DocumentationRubrique, string> = {
  "rapports-publications": "Rapports & publications",
  "guides-techniques": "Guides techniques",
  "bulletins-scientifiques": "Bulletins scientifiques",
  "open-data": "Open Data",
  archives: "Archives",
  "textes-reglementaires": "Textes réglementaires",
};

export const DOCUMENTATION_RUBRIQUE_PATHS: Record<DocumentationRubrique, string> = {
  "rapports-publications": "/documentation/rapports-publications",
  "guides-techniques": "/documentation/guides-techniques",
  "bulletins-scientifiques": "/documentation/bulletins-scientifiques",
  "open-data": "/documentation/open-data",
  archives: "/documentation/archives",
  "textes-reglementaires": "/documentation/textes-reglementaires",
};

export const GUIDE_CATEGORIES = ["Terrain", "Laboratoire", "Cartographie"] as const;
export const OPEN_DATA_CATEGORIES = ["Terrain", "Laboratoire", "Cartographie"] as const;
export const OPEN_DATA_FORMATS = ["GeoJSON", "CSV", "XLS"] as const;

export const DOCUMENTATION_DOC_TYPES = [
  "Rapport technique",
  "Publication scientifique",
  "Guide technique",
  "Fiche technique",
  "Étude",
  "Carte",
  "Bulletin",
] as const;

export type DocumentationDocType = (typeof DOCUMENTATION_DOC_TYPES)[number];

export const ARCHIVE_DOC_TYPES = [
  "Rapport technique",
  "Publication scientifique",
  "Bulletin",
] as const;

export const TEXTES_LEGAL_CATEGORIES = [
  "base-legale",
  "national",
  "international",
] as const;

export type TextesLegalCategory = (typeof TEXTES_LEGAL_CATEGORIES)[number];

export const TEXTES_LEGAL_CATEGORY_LABELS: Record<TextesLegalCategory, string> = {
  "base-legale": "Base légale de l'Institut",
  national: "Textes nationaux relatifs aux sols",
  international: "Conventions internationales",
};

export const TEXTES_LEGAL_TYPES = [
  "Décret",
  "Loi",
  "Document de politique",
  "Convention internationale",
  "Accord international",
] as const;

export type TextesLegalType = (typeof TEXTES_LEGAL_TYPES)[number];
