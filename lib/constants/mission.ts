/* ------------------------------------------------------------------ */
/*  Types de mission                                                   */
/* ------------------------------------------------------------------ */

export const MISSION_TYPES = [
  "terrain",
  "formation",
  "atelier",
  "reunion",
  "urgente",
] as const;
export type MissionType = (typeof MISSION_TYPES)[number];

export const MISSION_TYPE_LABELS: Record<MissionType, string> = {
  terrain: "Terrain",
  formation: "Formation",
  atelier: "Atelier",
  reunion: "Réunion",
  urgente: "Urgente",
};

/** Couleurs Tailwind pour badges / calendrier */
export const MISSION_TYPE_COLORS: Record<MissionType, string> = {
  terrain: "bg-emerald-500",
  formation: "bg-sky-500",
  atelier: "bg-violet-500",
  reunion: "bg-amber-500",
  urgente: "bg-rose-500",
};

export const MISSION_TYPE_BADGE_STYLES: Record<MissionType, string> = {
  terrain: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  formation: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  atelier: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
  reunion: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  urgente: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
};

/** Couleurs hex pour graphiques Recharts */
export const MISSION_TYPE_CHART_COLORS: Record<MissionType, string> = {
  terrain: "#10b981",
  formation: "#0ea5e9",
  atelier: "#8b5cf6",
  reunion: "#f59e0b",
  urgente: "#f43f5e",
};

/* ------------------------------------------------------------------ */
/*  Priorité                                                           */
/* ------------------------------------------------------------------ */

export const MISSION_PRIORITIES = ["basse", "normale", "haute", "urgente"] as const;
export type MissionPriority = (typeof MISSION_PRIORITIES)[number];

export const MISSION_PRIORITY_LABELS: Record<MissionPriority, string> = {
  basse: "Basse",
  normale: "Normale",
  haute: "Haute",
  urgente: "Urgente",
};

/* ------------------------------------------------------------------ */
/*  Statut global                                                      */
/* ------------------------------------------------------------------ */

export const MISSION_STATUSES = [
  "brouillon",
  "en_validation",
  "validee",
  "en_cours",
  "terminee",
  "annulee",
] as const;
export type MissionStatus = (typeof MISSION_STATUSES)[number];

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  brouillon: "Brouillon",
  en_validation: "En validation",
  validee: "Validée",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
};

export const MISSION_STATUS_BADGE_STYLES: Record<MissionStatus, string> = {
  brouillon: "bg-slate-500/10 text-slate-600 ring-slate-500/20",
  en_validation: "bg-orange-500/10 text-orange-700 ring-orange-500/20",
  validee: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  en_cours: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  terminee: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
  annulee: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
};

/** Couleurs hex pour graphiques Recharts */
export const MISSION_STATUS_CHART_COLORS: Record<MissionStatus, string> = {
  brouillon: "#64748b",
  en_validation: "#f97316",
  validee: "#0ea5e9",
  en_cours: "#10b981",
  terminee: "#8b5cf6",
  annulee: "#f43f5e",
};

/* ------------------------------------------------------------------ */
/*  Transport                                                          */
/* ------------------------------------------------------------------ */

export const MISSION_TRANSPORT_MEANS = [
  "vehicule_inp",
  "avion",
  "train",
  "bus",
  "taxi",
  "moto",
  "vehicule_personnel",
] as const;
export type MissionTransportMean = (typeof MISSION_TRANSPORT_MEANS)[number];

export const MISSION_TRANSPORT_LABELS: Record<MissionTransportMean, string> = {
  vehicule_inp: "Véhicule INP",
  avion: "Avion",
  train: "Train",
  bus: "Bus",
  taxi: "Taxi",
  moto: "Moto",
  vehicule_personnel: "Véhicule personnel",
};

/* ------------------------------------------------------------------ */
/*  Workflow de validation                                             */
/* ------------------------------------------------------------------ */

export const MISSION_VALIDATION_STEPS = ["chef_service", "directeur"] as const;
export type MissionValidationStep = (typeof MISSION_VALIDATION_STEPS)[number];

export const MISSION_VALIDATION_STEP_LABELS: Record<MissionValidationStep, string> = {
  chef_service: "Chef de mission",
  directeur: "Directeur",
};

/** Libellés pour d'anciennes missions encore en base. */
export const MISSION_VALIDATION_STEP_LEGACY_LABELS: Record<string, string> = {
  agent: "Agent",
  direction_generale: "Direction générale",
};

export const MISSION_VALIDATION_STEP_STATUSES = [
  "en_attente",
  "valide",
  "rejete",
] as const;
export type MissionValidationStepStatus = (typeof MISSION_VALIDATION_STEP_STATUSES)[number];

export const MISSION_VALIDATION_STEP_STATUS_LABELS: Record<
  MissionValidationStepStatus,
  string
> = {
  en_attente: "En attente",
  valide: "Validé",
  rejete: "Rejeté",
};

/* ------------------------------------------------------------------ */
/*  Pièces jointes                                                     */
/* ------------------------------------------------------------------ */

export const MISSION_ATTACHMENT_TYPES = [
  "ordre_mission",
  "lettre",
  "convocation",
  "billet_avion",
  "reservation_hotel",
  "bon_carburant",
  "photo",
  "pdf",
  "autre",
] as const;
export type MissionAttachmentType = (typeof MISSION_ATTACHMENT_TYPES)[number];

export const MISSION_ATTACHMENT_TYPE_LABELS: Record<MissionAttachmentType, string> = {
  ordre_mission: "Ordre de mission",
  lettre: "Lettre",
  convocation: "Convocation",
  billet_avion: "Billet d'avion",
  reservation_hotel: "Réservation hôtel",
  bon_carburant: "Bon de carburant",
  photo: "Photo",
  pdf: "Document PDF",
  autre: "Autre",
};
