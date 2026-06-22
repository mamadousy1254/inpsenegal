export const PARTENAIRE_CATEGORIES = [
  "gouvernement",
  "international",
  "universite",
  "societe-civile",
  "recherche",
] as const;

export type PartenaireCategory = (typeof PARTENAIRE_CATEGORIES)[number];

export const PARTENAIRE_CATEGORY_LABELS: Record<PartenaireCategory, string> = {
  gouvernement: "Gouvernement & Agences publiques",
  international: "Partenaires internationaux",
  universite: "Universités",
  "societe-civile": "Société civile",
  recherche: "Recherche & Think Tanks",
};

export const PARTENAIRE_CATEGORY_COLORS: Record<PartenaireCategory, string> = {
  gouvernement: "bg-[#7B4F2A] text-white",
  international: "bg-[#5A6F47] text-white",
  universite: "bg-[#C9A574] text-[#2A1F18]",
  "societe-civile": "bg-[#1877F2] text-white",
  recherche: "bg-[#9B59B6] text-white",
};

export const PARTENAIRE_CATEGORY_ACCENT: Record<PartenaireCategory, string> = {
  gouvernement: "#7B4F2A",
  international: "#5A6F47",
  universite: "#C9A574",
  "societe-civile": "#1877F2",
  recherche: "#9B59B6",
};

export const PARTENAIRE_CATEGORIES_ORDER: PartenaireCategory[] = [
  "gouvernement",
  "international",
  "universite",
  "societe-civile",
  "recherche",
];
