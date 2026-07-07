// TODO: REMPLACER PAR APPEL API BACK-OFFICE — données fictives de démonstration

export type RecrutementType =
  | "recrutement"      // CDI/CDD
  | "appel-candidature" // Appel à candidature pour poste précis
  | "stage";           // Offre de stage

export interface Recrutement {
  slug: string;
  type: RecrutementType;
  title: string;
  shortDescription: string;
  location: string;          // Délégation ou direction
  contractType: string;      // "Contrat à durée indéterminée", "Stage", etc.
  publishedDate: string;     // Date de publication
  deadline: string;          // Date limite de candidature
  status: "ouvert" | "ferme";
  emailContact: string;
  references: string;        // Référence du dossier (ex: "INP/2026/RH/001")
}

export const demoRecrutements: Recrutement[] = [
  {
    slug: "demo-techniciens-pedologues",
    type: "recrutement",
    title: "[Exemple] Recrutement de 12 techniciens pédologues",
    shortDescription: "L'INP recrute 12 techniciens pédologues pour renforcer les équipes de terrain et de laboratoire dans le cadre de l'extension du programme national de cartographie des sols.",
    location: "Délégations territoriales (toutes zones)",
    contractType: "Contrat à durée déterminée — 24 mois renouvelables",
    publishedDate: "15 juin 2026",
    deadline: "31 juillet 2026",
    status: "ouvert",
    emailContact: "rh@inp.sn",
    references: "INP/2026/RH/001",
  },
  {
    slug: "demo-chercheur-cartographie",
    type: "appel-candidature",
    title: "[Exemple] Appel à candidature — Chercheur en cartographie pédologique",
    shortDescription: "L'INP recrute un(e) chercheur(se) spécialisé(e) en cartographie pédologique et systèmes d'information géographique pour la Direction Scientifique.",
    location: "Direction Centrale — Dakar",
    contractType: "Contrat à durée indéterminée",
    publishedDate: "10 juin 2026",
    deadline: "15 août 2026",
    status: "ouvert",
    emailContact: "rh@inp.sn",
    references: "INP/2026/RH/002",
  },
  {
    slug: "demo-stage-laboratoire",
    type: "stage",
    title: "[Exemple] Offre de stage — Analyse pédologique en laboratoire",
    shortDescription: "Le laboratoire central de l'INP propose un stage de 6 mois pour des étudiants en agronomie ou sciences du sol intéressés par les techniques d'analyse pédologique.",
    location: "Laboratoire central — Dakar",
    contractType: "Stage de fin d'études — 6 mois",
    publishedDate: "5 juin 2026",
    deadline: "30 juillet 2026",
    status: "ouvert",
    emailContact: "stages@inp.sn",
    references: "INP/2026/STAGE/001",
  },
  {
    slug: "demo-ingenieur-sig",
    type: "appel-candidature",
    title: "[Exemple] Appel à candidature — Ingénieur SIG / Géomaticien",
    shortDescription: "L'INP recherche un(e) ingénieur(e) SIG / géomaticien(ne) pour développer et maintenir la plateforme cartographique nationale des sols du Sénégal.",
    location: "Direction Scientifique — Dakar",
    contractType: "Contrat à durée indéterminée",
    publishedDate: "1 juin 2026",
    deadline: "5 août 2026",
    status: "ouvert",
    emailContact: "rh@inp.sn",
    references: "INP/2026/RH/003",
  },
];

export function getRecrutementsActifs(): Recrutement[] {
  return demoRecrutements.filter((r) => r.status === "ouvert");
}

export function getRecrutementBySlug(slug: string): Recrutement | null {
  return demoRecrutements.find((r) => r.slug === slug) || null;
}

export const recrutementTypeLabels: Record<RecrutementType, string> = {
  recrutement: "Recrutement",
  "appel-candidature": "Appel à candidature",
  stage: "Stage",
};

export const recrutementTypeColors: Record<RecrutementType, { bg: string; text: string }> = {
  recrutement: { bg: "#7B4F2A", text: "#FFFFFF" },        // brun terre
  "appel-candidature": { bg: "#5A6F47", text: "#FFFFFF" }, // vert mousse
  stage: { bg: "#C9A574", text: "#2A1F18" },              // ocre
};
