export const RECRUTEMENT_TYPES = [
  "recrutement",
  "appel-candidature",
  "stage",
] as const;

export type RecrutementType = (typeof RECRUTEMENT_TYPES)[number];

export const RECRUTEMENT_TYPE_LABELS: Record<RecrutementType, string> = {
  recrutement: "Recrutement",
  "appel-candidature": "Appel à candidature",
  stage: "Stage",
};

export const RECRUTEMENT_TYPE_COLORS: Record<
  RecrutementType,
  { bg: string; text: string }
> = {
  recrutement: { bg: "#7B4F2A", text: "#FFFFFF" },
  "appel-candidature": { bg: "#5A6F47", text: "#FFFFFF" },
  stage: { bg: "#C9A574", text: "#2A1F18" },
};

export const RECRUTEMENT_CMS_STATUSES = ["brouillon", "publie"] as const;
export type RecrutementCmsStatus = (typeof RECRUTEMENT_CMS_STATUSES)[number];

export const RECRUTEMENT_OFFER_STATUSES = ["ouvert", "ferme"] as const;
export type RecrutementOfferStatus = (typeof RECRUTEMENT_OFFER_STATUSES)[number];

export const RECRUTEMENT_CMS_STATUS_LABELS: Record<RecrutementCmsStatus, string> = {
  brouillon: "Brouillon",
  publie: "Publié",
};

export const RECRUTEMENT_OFFER_STATUS_LABELS: Record<RecrutementOfferStatus, string> = {
  ouvert: "Ouvert",
  ferme: "Fermé",
};
