/* ------------------------------------------------------------------ */
/*  Types, placeholder data & helpers for Documentation page           */
/*  In production → fetched from Parse "Documents" collection          */
/* ------------------------------------------------------------------ */

export type DocType =
  | "fiche-technique"
  | "rapport"
  | "guide"
  | "etude"
  | "carte";

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  "fiche-technique": "Fiche technique",
  rapport: "Rapport",
  guide: "Guide",
  etude: "Étude",
  carte: "Carte",
};

export const DOC_TYPE_COLORS: Record<DocType, string> = {
  "fiche-technique": "bg-violet-50 text-violet-700 border-violet-200",
  rapport: "bg-blue-50 text-blue-700 border-blue-200",
  guide: "bg-amber-50 text-amber-700 border-amber-200",
  etude: "bg-amber-50 text-amber-700 border-amber-200",
  carte: "bg-rose-50 text-rose-700 border-rose-200",
};

export const RESEARCH_AXES = [
  "Fertilité des sols",
  "Dégradation & érosion",
  "Salinisation & irrigation",
  "Analyse physico-chimique",
  "Modélisation & SIG",
  "Agriculture durable",
];

export const REGIONS = [
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Ziguinchor",
  "Kaolack",
  "Fatick",
  "Tambacounda",
  "Kédougou",
  "National",
];

export interface DocItem {
  slug: string;
  title: string;
  description: string;
  type: DocType;
  year: number;
  author: string;
  region: string;
  researchAxis: string;
  tags: string[];
  fileSize: string;
  pages: number;
  version: string;
  downloads: number;
}

/* ------------------------------------------------------------------ */
/*  Placeholder documents                                              */
/* ------------------------------------------------------------------ */

export const DOCUMENTS: DocItem[] = [
  {
    slug: "protocole-analyse-granulometrique-inp",
    title: "Protocole standardisé d'analyse granulométrique des sols",
    description:
      "Guide technique complet décrivant le protocole d'analyse granulométrique adopté par les laboratoires de l'INP, en conformité avec la norme ISO 11277. Couvre la préparation des échantillons, les méthodes de sédimentation et de tamisage, et l'interprétation des résultats selon le triangle textural.",
    type: "fiche-technique",
    year: 2024,
    author: "Laboratoire d'Analyse Physico-Chimique — INP",
    region: "National",
    researchAxis: "Analyse physico-chimique",
    tags: ["granulométrie", "norme ISO", "laboratoire", "protocole"],
    fileSize: "2.4 Mo",
    pages: 28,
    version: "3.1",
    downloads: 342,
  },
  {
    slug: "rapport-annuel-inp-2024",
    title: "Rapport annuel d'activités de l'INP — Exercice 2024",
    description:
      "Synthèse des activités de recherche, de cartographie, d'analyse et de coopération menées par l'Institut national de Pédologie au cours de l'année 2024. Inclut les indicateurs de performance, les projets réalisés et les perspectives.",
    type: "rapport",
    year: 2024,
    author: "Direction Générale — INP",
    region: "National",
    researchAxis: "Agriculture durable",
    tags: ["rapport annuel", "bilan", "indicateurs", "2024"],
    fileSize: "8.7 Mo",
    pages: 96,
    version: "1.0",
    downloads: 518,
  },
  {
    slug: "guide-classification-sols-wrb-senegal",
    title: "Guide pratique de classification des sols du Sénégal — Référentiel WRB",
    description:
      "Document de référence pour la classification des sols sénégalais selon le World Reference Base for Soil Resources (WRB 2022). Fournit des clés de détermination adaptées au contexte local avec des illustrations de profils types.",
    type: "guide",
    year: 2023,
    author: "Pr. Ousmane Seck — INP",
    region: "National",
    researchAxis: "Analyse physico-chimique",
    tags: ["classification", "WRB", "référentiel", "pédologie"],
    fileSize: "5.2 Mo",
    pages: 64,
    version: "2.0",
    downloads: 421,
  },
  {
    slug: "etude-salinisation-delta-fleuve-senegal",
    title: "Dynamique de salinisation des sols dans le delta du fleuve Sénégal",
    description:
      "Étude de trois ans documentant l'extension progressive de la salinisation des sols dans le delta. Identifie les facteurs causaux, quantifie les surfaces affectées et propose des stratégies de réhabilitation fondées sur le drainage.",
    type: "etude",
    year: 2024,
    author: "Dr. Fatou Ndiaye — INP",
    region: "Saint-Louis",
    researchAxis: "Salinisation & irrigation",
    tags: ["salinisation", "delta", "fleuve Sénégal", "drainage"],
    fileSize: "4.1 Mo",
    pages: 52,
    version: "1.0",
    downloads: 287,
  },
  {
    slug: "carte-pedologique-casamance-2023",
    title: "Carte pédologique de la Casamance — Échelle 1/200 000",
    description:
      "Carte numérique des sols de la Casamance produite par Digital Soil Mapping intégrant données Sentinel-2, covariables SRTM et algorithmes Random Forest. Résolution 30 m. Format GeoTIFF et PDF haute résolution.",
    type: "carte",
    year: 2023,
    author: "Plateforme SIG & Data — INP",
    region: "Ziguinchor",
    researchAxis: "Modélisation & SIG",
    tags: ["carte", "Casamance", "DSM", "GeoTIFF"],
    fileSize: "15.3 Mo",
    pages: 1,
    version: "1.0",
    downloads: 198,
  },
  {
    slug: "guide-prelevement-echantillons-sols",
    title: "Guide de prélèvement d'échantillons de sols — Manuel de terrain",
    description:
      "Manuel pratique destiné aux techniciens de terrain. Décrit les procédures de prélèvement, de conservation et d'envoi des échantillons de sols vers les laboratoires de l'INP.",
    type: "guide",
    year: 2023,
    author: "Unité de Recherche Terrain — INP",
    region: "National",
    researchAxis: "Analyse physico-chimique",
    tags: ["prélèvement", "terrain", "échantillons", "manuel"],
    fileSize: "1.8 Mo",
    pages: 22,
    version: "2.3",
    downloads: 456,
  },
  {
    slug: "fiche-sols-ferrugineux-tropicaux",
    title: "Fiche technique — Sols ferrugineux tropicaux du Sénégal",
    description:
      "Fiche de référence décrivant les propriétés physiques, chimiques et agronomiques des sols ferrugineux tropicaux. Inclut des recommandations de gestion et de fertilisation adaptées.",
    type: "fiche-technique",
    year: 2022,
    author: "Laboratoire de Fertilité — INP",
    region: "Kaolack",
    researchAxis: "Fertilité des sols",
    tags: ["sols ferrugineux", "fiche technique", "fertilité", "gestion"],
    fileSize: "1.2 Mo",
    pages: 8,
    version: "1.1",
    downloads: 312,
  },
  {
    slug: "rapport-erosion-niayes-2023",
    title: "Évaluation de l'érosion des sols dans la zone des Niayes",
    description:
      "Rapport technique quantifiant les pertes en sol par érosion hydrique et éolienne dans la zone maraîchère des Niayes. Évalue l'efficacité des techniques conservatoires (paillage, brise-vents, terrasses).",
    type: "rapport",
    year: 2023,
    author: "Dr. Ibrahima Sarr — INP",
    region: "Thiès",
    researchAxis: "Dégradation & érosion",
    tags: ["érosion", "Niayes", "conservation", "maraîchage"],
    fileSize: "3.6 Mo",
    pages: 44,
    version: "1.0",
    downloads: 189,
  },
  {
    slug: "etude-impact-agroforesterie-senegal-oriental",
    title: "Impact de l'agroforesterie sur la matière organique au Sénégal oriental",
    description:
      "Étude mesurant l'influence de l'intégration d'arbres (Faidherbia albida, Piliostigma reticulatum) sur le carbone organique, la structure du sol et les rendements céréaliers.",
    type: "etude",
    year: 2022,
    author: "Pr. Moussa Diop — INP",
    region: "Tambacounda",
    researchAxis: "Agriculture durable",
    tags: ["agroforesterie", "carbone organique", "Faidherbia", "rendement"],
    fileSize: "3.0 Mo",
    pages: 38,
    version: "1.0",
    downloads: 245,
  },
  {
    slug: "carte-fertilite-bassin-arachidier",
    title: "Carte de fertilité des sols du bassin arachidier",
    description:
      "Carte thématique de fertilité produite à partir de 800 échantillons. Représente les niveaux de matière organique, phosphore assimilable et potassium échangeable à l'échelle départementale.",
    type: "carte",
    year: 2024,
    author: "Dr. Aminata Ba — INP",
    region: "Kaolack",
    researchAxis: "Fertilité des sols",
    tags: ["carte", "fertilité", "bassin arachidier", "N-P-K"],
    fileSize: "12.1 Mo",
    pages: 1,
    version: "1.0",
    downloads: 167,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getDocYears(): number[] {
  const years = [...new Set(DOCUMENTS.map((d) => d.year))];
  return years.sort((a, b) => b - a);
}

export function getDocBySlug(slug: string): DocItem | undefined {
  return DOCUMENTS.find((d) => d.slug === slug);
}
