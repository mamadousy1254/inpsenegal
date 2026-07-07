/* ------------------------------------------------------------------ */
/*  Shared publication types & placeholder data                        */
/*  In production, fetched from Parse "Publications" collection        */
/* ------------------------------------------------------------------ */

export interface PublicationItem {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  type: PublicationType;
  abstract: string;
  tags: string[];
  doi?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  researchAxis: string;
  isFeatured: boolean;
  methodology?: string;
  results?: string;
}

export type PublicationType =
  | "rapport-technique"
  | "article-scientifique"
  | "etude-nationale"
  | "fiche-technique";

export const TYPE_LABELS: Record<PublicationType, string> = {
  "rapport-technique": "Rapport technique",
  "article-scientifique": "Article scientifique",
  "etude-nationale": "Étude nationale",
  "fiche-technique": "Fiche technique",
};

export const TYPE_COLORS: Record<PublicationType, string> = {
  "rapport-technique": "bg-blue-50 text-blue-700 border-blue-200",
  "article-scientifique": "bg-[#F7F1E6] text-[#7B4F2A] border-[#DCC8A8]",
  "etude-nationale": "bg-amber-50 text-amber-700 border-amber-200",
  "fiche-technique": "bg-violet-50 text-violet-700 border-violet-200",
};

export const RESEARCH_AXES = [
  "Fertilité des sols",
  "Dégradation & érosion",
  "Salinisation & irrigation",
  "Analyse physico-chimique",
  "Modélisation & SIG",
  "Agriculture durable",
];

export const PUBLICATIONS: PublicationItem[] = [
  {
    slug: "atlas-pedologique-senegal-2024",
    title:
      "Atlas pédologique du Sénégal : Cartographie nationale des types de sols",
    authors: ["Dr. Ousmane Seck", "Dr. Fatou Ndiaye", "Pr. Moussa Diop"],
    year: 2024,
    type: "rapport-technique",
    abstract:
      "Ce rapport constitue la synthèse cartographique la plus complète de la diversité pédologique du territoire national. Fondé sur 12 000 profils de référence, il offre une lecture actualisée de la distribution spatiale des sols, de leurs propriétés physiques et chimiques, ainsi que de leur potentiel agronomique. L'atlas est destiné aux décideurs, chercheurs et techniciens agricoles.",
    tags: ["cartographie", "sols", "SIG", "référence nationale"],
    doi: "10.5281/inp.2024.001",
    researchAxis: "Modélisation & SIG",
    isFeatured: true,
    methodology:
      "Compilation de 12 000 profils pédologiques, analyse géostatistique, télédétection Sentinel-2, validation terrain sur 250 sites.",
    results:
      "14 régions cartographiées, 8 grands groupes de sols identifiés, base de données géoréférencée de 45 000 points.",
  },
  {
    slug: "fertilite-sols-bassin-arachidier",
    title:
      "Évaluation de la fertilité des sols du bassin arachidier : état des lieux et recommandations",
    authors: ["Dr. Aminata Ba", "Dr. Ibrahima Sarr"],
    year: 2024,
    type: "article-scientifique",
    abstract:
      "Cette étude évalue la fertilité chimique et biologique des sols du bassin arachidier, principale zone de production agricole du Sénégal. Les analyses montrent un appauvrissement progressif en matière organique et en phosphore assimilable, avec des recommandations de fertilisation adaptées.",
    tags: ["fertilité", "bassin arachidier", "matière organique", "phosphore"],
    doi: "10.5281/inp.2024.002",
    researchAxis: "Fertilité des sols",
    isFeatured: true,
    methodology:
      "Prélèvement et analyse de 800 échantillons, dosage N-P-K, mesure du carbone organique, tests biologiques.",
    results:
      "Déficit moyen de 40% en matière organique, recommandation d'apport de compost à 5 t/ha, cartographie de fertilité sur 3 départements.",
  },
  {
    slug: "salinisation-sols-delta-fleuve",
    title:
      "Dynamique de salinisation des sols dans le Delta du fleuve Sénégal",
    authors: ["Dr. Fatou Ndiaye", "Pr. Ousmane Seck"],
    year: 2023,
    type: "etude-nationale",
    abstract:
      "L'étude documente l'extension progressive de la salinisation des sols dans le delta du fleuve Sénégal, identifie les facteurs causaux (remontée de la nappe, intrusion marine, pratiques d'irrigation) et propose des stratégies de réhabilitation fondées sur le drainage et l'amendement gypseux.",
    tags: ["salinisation", "delta", "fleuve Sénégal", "réhabilitation"],
    researchAxis: "Salinisation & irrigation",
    isFeatured: false,
    methodology:
      "Suivi piézométrique sur 3 ans, analyses de conductivité électrique, modélisation hydrologique.",
    results:
      "12 000 ha affectés identifiés, modèle prédictif de progression, protocole de réhabilitation validé sur 200 ha pilotes.",
  },
  {
    slug: "protocole-analyse-granulometrique",
    title:
      "Protocole standardisé d'analyse granulométrique des sols : Guide technique INP",
    authors: ["Dr. Aminata Ba"],
    year: 2023,
    type: "fiche-technique",
    abstract:
      "Ce guide présente le protocole standardisé d'analyse granulométrique adopté par les laboratoires de l'INP, en conformité avec les normes ISO 11277 et les adaptations nationales. Il couvre la préparation des échantillons, les méthodes de sédimentation et de tamisage, ainsi que l'interprétation des résultats selon le triangle textural.",
    tags: ["granulométrie", "protocole", "laboratoire", "norme ISO"],
    researchAxis: "Analyse physico-chimique",
    isFeatured: false,
  },
  {
    slug: "erosion-sols-niayes",
    title:
      "Évaluation de l'érosion des sols dans la zone des Niayes : facteurs et mesures conservatoires",
    authors: ["Dr. Ibrahima Sarr", "Dr. Moussa Diop"],
    year: 2023,
    type: "article-scientifique",
    abstract:
      "Cette publication analyse les processus d'érosion hydrique et éolienne dans la zone des Niayes, zone maraîchère stratégique du Sénégal. L'étude quantifie les pertes en sol et évalue l'efficacité de techniques conservatoires telles que le paillage, les brise-vents et les terrasses.",
    tags: ["érosion", "Niayes", "conservation", "maraîchage"],
    doi: "10.5281/inp.2023.005",
    researchAxis: "Dégradation & érosion",
    isFeatured: false,
    methodology:
      "Parcelles d'érosion de Wischmeier, pluviométrie journalière, modèle RUSLE, suivi sur 2 saisons.",
    results:
      "Pertes de 15 t/ha/an sans protection, réduction de 60% avec paillage, cartographie des zones à risque.",
  },
  {
    slug: "impact-agroforesterie-matiere-organique",
    title:
      "Impact des systèmes agroforestiers sur la matière organique et la fertilité des sols au Sénégal oriental",
    authors: ["Pr. Moussa Diop", "Dr. Aminata Ba", "Dr. Fatou Ndiaye"],
    year: 2022,
    type: "article-scientifique",
    abstract:
      "Cette étude évalue l'influence de l'intégration d'arbres (Faidherbia albida, Piliostigma reticulatum) dans les systèmes agricoles sur les teneurs en carbone organique, la structure du sol et les rendements céréaliers dans le Sénégal oriental.",
    tags: ["agroforesterie", "matière organique", "Faidherbia", "carbone"],
    doi: "10.5281/inp.2022.003",
    researchAxis: "Agriculture durable",
    isFeatured: false,
    methodology:
      "Comparaison parcelles avec et sans arbres, prélèvements 0-30 cm, dosage du carbone de Walkley-Black, mesure des rendements.",
    results:
      "+35% de carbone organique sous couvert arboré, amélioration de la macroporosité, rendement mil +20%.",
  },
  {
    slug: "cartographie-numerique-casamance",
    title:
      "Cartographie numérique des sols de Casamance par apprentissage automatique",
    authors: ["Dr. Fatou Ndiaye", "Dr. Ibrahima Sarr"],
    year: 2022,
    type: "rapport-technique",
    abstract:
      "Application des méthodes de digital soil mapping (DSM) intégrant données de télédétection, covariables environnementales et algorithmes de Random Forest pour produire des cartes prédictives des propriétés des sols en Casamance.",
    tags: ["DSM", "machine learning", "Casamance", "télédétection"],
    researchAxis: "Modélisation & SIG",
    isFeatured: false,
    methodology:
      "200 points de calibration, Random Forest, covariables SRTM et Sentinel-2, validation croisée 10-fold.",
    results:
      "R² = 0.72 pour la texture, 0.68 pour le carbone organique. Cartes à 30 m de résolution.",
  },
  {
    slug: "guide-classification-sols-senegal",
    title:
      "Guide pratique de classification des sols du Sénégal selon le référentiel WRB",
    authors: ["Pr. Ousmane Seck"],
    year: 2021,
    type: "fiche-technique",
    abstract:
      "Document de référence pour la classification des sols sénégalais selon le World Reference Base for Soil Resources (WRB 2022). Il fournit des clés de détermination adaptées au contexte local avec des illustrations de profils types.",
    tags: ["classification", "WRB", "référentiel", "pédologie"],
    researchAxis: "Analyse physico-chimique",
    isFeatured: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getYears(): number[] {
  const years = [...new Set(PUBLICATIONS.map((p) => p.year))];
  return years.sort((a, b) => b - a);
}

export function getPublicationBySlug(
  slug: string
): PublicationItem | undefined {
  return PUBLICATIONS.find((p) => p.slug === slug);
}
