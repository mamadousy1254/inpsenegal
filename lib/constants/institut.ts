export const INSTITUT_POLE_TYPES = [
  "direction",
  "technique",
  "administration",
  "communication",
  "delegations",
  "appui",
] as const;

export type InstitutPoleType = (typeof INSTITUT_POLE_TYPES)[number];

export const INSTITUT_POLE_LABELS: Record<InstitutPoleType, string> = {
  direction: "Direction Générale",
  technique: "Divisions Techniques",
  administration: "Administration & Finances",
  communication: "Communication & Informatique",
  delegations: "Délégations Territoriales",
  appui: "Personnel d'Appui",
};

export const INSTITUT_POLE_DESCRIPTIONS: Record<InstitutPoleType, string> = {
  direction: "L'équipe dirigeante qui pilote la stratégie et la gouvernance de l'INP.",
  technique:
    "Les responsables scientifiques et techniques : recherche, cartographie, fertilité, laboratoires et métrologie.",
  administration:
    "L'équipe qui assure la gestion administrative, financière, des ressources humaines et de la qualité.",
  communication:
    "La cellule en charge de la communication institutionnelle et des systèmes d'information.",
  delegations:
    "Les délégués et assistants qui représentent l'INP dans les zones pédoclimatiques du Sénégal.",
  appui: "Le personnel qui assure la logistique, le transport et la sécurité de l'Institut.",
};

export const INSTITUT_POLE_COLORS: Record<InstitutPoleType, string> = {
  direction: "bg-[#7B4F2A]",
  technique: "bg-[#5A6F47]",
  administration: "bg-[#C9A574]",
  communication: "bg-[#1877F2]",
  delegations: "bg-[#9B59B6]",
  appui: "bg-[#8B7355]",
};

export const INSTITUT_POLES_ORDER: InstitutPoleType[] = [
  "direction",
  "technique",
  "administration",
  "communication",
  "delegations",
  "appui",
];

/** Slug du directeur général pour la mise en avant sur la page équipe */
export const INSTITUT_DG_SLUG = "alfred-kouly-tine";

export function getInitialesInstitut(nom: string): string {
  const mots = nom.trim().split(/\s+/);
  if (mots.length === 1) return mots[0].slice(0, 2).toUpperCase();
  return (mots[0][0] + mots[mots.length - 1][0]).toUpperCase();
}
