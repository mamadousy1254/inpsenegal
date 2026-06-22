/* ------------------------------------------------------------------ */
/*  Shared types & placeholder data for Actualités                     */
/*  In production → fetched from Parse "News" collection               */
/* ------------------------------------------------------------------ */

export type NewsCategory =
  | "evenements"
  | "recherche"
  | "partenariats"
  | "projets"
  | "publications";

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  evenements: "Événements",
  recherche: "Recherche",
  partenariats: "Partenariats",
  projets: "Projets",
  publications: "Publications",
};

export const CATEGORY_COLORS: Record<NewsCategory, string> = {
  evenements: "bg-blue-50 text-blue-700 border-blue-200",
  recherche: "bg-amber-50 text-amber-700 border-amber-200",
  partenariats: "bg-violet-50 text-violet-700 border-violet-200",
  projets: "bg-amber-50 text-amber-700 border-amber-200",
  publications: "bg-rose-50 text-rose-700 border-rose-200",
};

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: NewsCategory;
  author: string;
  publishedAt: string; // ISO date
  isFeatured: boolean;
  tags: string[];
}

/* ------------------------------------------------------------------ */
/*  Placeholder articles                                               */
/* ------------------------------------------------------------------ */

export const NEWS: NewsItem[] = [
  {
    slug: "atelier-regional-cartographie-sols-2024",
    title:
      "L'INP organise l'atelier régional sur la cartographie numérique des sols",
    excerpt:
      "Trois jours d'échanges scientifiques réunissant des experts de 8 pays de la sous-région autour des méthodologies de Digital Soil Mapping.",
    content: `## Contexte

L'Institut national de Pédologie a organisé du 18 au 20 novembre 2024 un atelier régional de haut niveau consacré à la **cartographie numérique des sols** (Digital Soil Mapping — DSM). Cet événement s'inscrit dans le cadre du Programme africain des sols (AfSP) et de la Charte mondiale des sols de la FAO.

## Participants

L'atelier a réuni **65 chercheurs et techniciens** provenant de 8 pays de la sous-région ouest-africaine : Sénégal, Mali, Burkina Faso, Guinée, Mauritanie, Gambie, Côte d'Ivoire et Niger.

## Sessions techniques

Les travaux se sont articulés autour de quatre axes :

1. **Méthodes de prospection pédologique** assistées par télédétection
2. **Algorithmes prédictifs** (Random Forest, Gradient Boosting) pour la cartographie des propriétés de sols
3. **Intégration des données** Sentinel-2 et SRTM dans les workflows DSM
4. **Harmonisation des bases de données** pédologiques nationales

## Résultats

Les participants ont adopté une feuille de route commune pour l'harmonisation des méthodologies de cartographie numérique des sols à l'échelle sous-régionale, avec un calendrier de mise en œuvre sur 3 ans.

## Prochaines étapes

Un comité de suivi composé de représentants des 8 pays a été constitué, avec un premier rapport d'avancement prévu pour mars 2025.`,
    image: "/images/hero/slide-1.jpg",
    category: "evenements",
    author: "Direction de la Communication — INP",
    publishedAt: "2024-11-20",
    isFeatured: true,
    tags: ["DSM", "cartographie", "sous-région", "FAO", "atelier"],
  },
  {
    slug: "publication-atlas-pedologique-senegal",
    title:
      "Publication de l'Atlas pédologique du Sénégal — Édition 2024",
    excerpt:
      "Le document de référence le plus complet sur la diversité des sols sénégalais, fondé sur 12 000 profils de référence.",
    content: `## Un ouvrage de référence nationale

L'INP est fier d'annoncer la publication officielle de l'**Atlas pédologique du Sénégal — Édition 2024**, fruit de cinq années de travaux de recherche, de prospection terrain et d'analyse géostatistique.

## Contenu

L'Atlas couvre l'ensemble des 14 régions administratives et présente :

- **8 grands groupes de sols** cartographiés selon le référentiel WRB
- **12 000 profils** de référence géoréférencés
- Des cartes thématiques (fertilité, érosion, salinisation)
- Des fiches régionales détaillées

## Téléchargement

L'Atlas est disponible en téléchargement libre au format PDF sur le portail de l'INP, dans la section Publications.`,
    image: "/images/hero/slide-2.jpg",
    category: "publications",
    author: "Service des Publications — INP",
    publishedAt: "2024-10-05",
    isFeatured: false,
    tags: ["atlas", "cartographie", "WRB", "publication"],
  },
  {
    slug: "partenariat-fao-programme-sols-durables",
    title:
      "Signature d'un accord de partenariat entre l'INP et la FAO pour le Programme Sols Durables",
    excerpt:
      "Un partenariat stratégique pour renforcer les capacités nationales en gestion durable des sols et en lutte contre la dégradation des terres.",
    content: `## Un engagement international

L'INP et l'Organisation des Nations Unies pour l'alimentation et l'agriculture (FAO) ont signé le 15 septembre 2024 un protocole d'accord portant sur le **Programme Sols Durables** pour la période 2024-2028.

## Axes du partenariat

1. Renforcement des capacités analytiques des laboratoires de l'INP
2. Formation de 50 techniciens en méthodes avancées d'analyse des sols
3. Mise en place d'un réseau national de surveillance de la qualité des sols
4. Transfert de technologies de cartographie numérique

## Financement

Le programme bénéficie d'un financement de **2,5 millions USD** sur 4 ans, couvrant les équipements, la formation et les opérations terrain.`,
    image: "/images/hero/slide-3.jpg",
    category: "partenariats",
    author: "Direction Générale — INP",
    publishedAt: "2024-09-15",
    isFeatured: false,
    tags: ["FAO", "partenariat", "sols durables", "coopération"],
  },
  {
    slug: "lancement-projet-fertilite-bassin-arachidier",
    title:
      "Lancement du projet de restauration de la fertilité des sols du bassin arachidier",
    excerpt:
      "Un projet pilote ciblant 500 exploitations agricoles pour tester des techniques innovantes de restauration de la fertilité.",
    content: `## Objectif

Restaurer la fertilité de **15 000 hectares** de terres dégradées dans le bassin arachidier grâce à des techniques combinant agroforesterie, compostage et gestion intégrée de la fertilité.

## Approche

Le projet adopte une démarche participative impliquant directement les producteurs dans la conception et la mise en œuvre des solutions.

## Partenaires

- INP (coordination scientifique)
- ISRA (appui agronomique)
- ANCAR (vulgarisation)
- Collectivités locales

## Durée

3 ans (2024-2027), avec des évaluations semestrielles.`,
    image: "/images/hero/slide-1.jpg",
    category: "projets",
    author: "Direction de la Recherche — INP",
    publishedAt: "2024-08-01",
    isFeatured: false,
    tags: ["fertilité", "bassin arachidier", "restauration", "agriculture"],
  },
  {
    slug: "resultats-etude-salinisation-delta",
    title:
      "Résultats de l'étude sur la dynamique de salinisation dans le delta du fleuve Sénégal",
    excerpt:
      "L'INP publie les conclusions d'une étude de trois ans sur l'extension de la salinisation et les stratégies de réhabilitation.",
    content: `## Contexte

La salinisation des sols constitue une menace croissante pour l'agriculture irriguée dans le delta du fleuve Sénégal. L'INP a conduit une étude approfondie de 2021 à 2024.

## Principaux résultats

- **12 000 hectares** affectés identifiés
- Taux de progression de 3% par an
- Corrélation forte avec la remontée de la nappe phréatique
- Efficacité du drainage souterrain validée sur 200 ha pilotes

## Recommandations

L'étude recommande la mise en place d'un programme national de drainage et de suivi de la salinité.`,
    image: "/images/hero/slide-2.jpg",
    category: "recherche",
    author: "Laboratoire de Fertilité — INP",
    publishedAt: "2024-06-20",
    isFeatured: false,
    tags: ["salinisation", "delta", "fleuve Sénégal", "recherche"],
  },
  {
    slug: "formation-sig-techniciens-regionaux",
    title:
      "Formation intensive en SIG pour 30 techniciens régionaux",
    excerpt:
      "L'INP forme une nouvelle cohorte de techniciens en systèmes d'information géographique appliqués à la cartographie des sols.",
    content: `## Programme

Une formation de 10 jours couvrant :

- Fondamentaux de QGIS et ArcGIS Pro
- Traitement d'images satellites (Sentinel-2)
- Création de cartes pédologiques numériques
- Gestion de bases de données géospatiales

## Participants

30 techniciens issus des 14 directions régionales de l'agriculture.

## Certification

Les participants reçoivent un certificat de compétence délivré conjointement par l'INP et l'Université Cheikh Anta Diop.`,
    image: "/images/hero/slide-3.jpg",
    category: "evenements",
    author: "Plateforme SIG & Data — INP",
    publishedAt: "2024-05-10",
    isFeatured: false,
    tags: ["SIG", "formation", "QGIS", "techniciens"],
  },
  {
    slug: "journee-mondiale-sols-2023",
    title:
      "L'INP célèbre la Journée mondiale des sols 2023 : « Les sols, source de vie »",
    excerpt:
      "Conférences, expositions et ateliers de terrain organisés sur le campus de l'INP à l'occasion de la Journée mondiale des sols.",
    content: `## Événement

À l'occasion de la Journée mondiale des sols (5 décembre 2023), l'INP a organisé une journée portes ouvertes accueillant plus de 300 visiteurs.

## Programme

- Conférence inaugurale du Directeur Général
- Exposition de profils de sols du Sénégal
- Démonstrations en laboratoire
- Atelier de terrain pour les étudiants

## Impact

L'événement a bénéficié d'une couverture médiatique nationale (RTS, APS).`,
    image: "/images/hero/slide-1.jpg",
    category: "evenements",
    author: "Direction de la Communication — INP",
    publishedAt: "2023-12-05",
    isFeatured: false,
    tags: ["journée mondiale", "sols", "communication", "2023"],
  },
  {
    slug: "convention-isra-inp-recherche-conjointe",
    title:
      "Signature d'une convention de recherche conjointe ISRA-INP",
    excerpt:
      "L'INP et l'ISRA renforcent leur collaboration scientifique à travers un programme de recherche conjoint sur la fertilité et l'agroécologie.",
    content: `## Partenariat scientifique

L'Institut national de Pédologie et l'Institut Sénégalais de Recherches Agricoles (ISRA) ont signé une convention cadre pour la période 2024-2026.

## Axes de recherche

1. Dynamique de la matière organique dans les systèmes de culture
2. Restauration écologique des sols dégradés
3. Indicateurs biologiques de qualité des sols

## Moyens

- 6 chercheurs associés
- Accès croisé aux laboratoires
- Budget de recherche partagé`,
    image: "/images/hero/slide-2.jpg",
    category: "partenariats",
    author: "Direction Générale — INP",
    publishedAt: "2023-10-12",
    isFeatured: false,
    tags: ["ISRA", "convention", "recherche conjointe"],
  },
  {
    slug: "acquisition-spectrometre-nouvelle-generation",
    title:
      "Le Laboratoire d'Analyse acquiert un spectromètre de nouvelle génération",
    excerpt:
      "Un investissement majeur pour renforcer les capacités analytiques de l'INP avec un spectromètre AAS de dernière génération.",
    content: `## Investissement

L'INP a acquis un spectromètre d'absorption atomique (AAS) de dernière génération, représentant un investissement de 150 millions FCFA.

## Capacités

Le nouvel équipement permet :

- Dosage simultané de 20 éléments
- Détection à l'état de traces (ppb)
- Cadence de 200 analyses/jour
- Conformité ISO 17025

## Impact

Cette acquisition triple la capacité analytique du laboratoire et réduit les délais de restitution des résultats.`,
    image: "/images/hero/slide-3.jpg",
    category: "projets",
    author: "Laboratoire d'Analyse — INP",
    publishedAt: "2023-07-18",
    isFeatured: false,
    tags: ["spectromètre", "laboratoire", "équipement", "investissement"],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getYears(): number[] {
  const years = [
    ...new Set(NEWS.map((n) => new Date(n.publishedAt).getFullYear())),
  ];
  return years.sort((a, b) => b - a);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return NEWS.find((n) => n.slug === slug);
}

export function getFeaturedNews(): NewsItem | undefined {
  return NEWS.find((n) => n.isFeatured);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
