export const CANDIDATURE_STATUSES = [
  "nouvelle",
  "en_cours",
  "retenue",
  "refusee",
  "archivee",
] as const;

export type CandidatureStatus = (typeof CANDIDATURE_STATUSES)[number];

export const CANDIDATURE_STATUS_LABELS: Record<CandidatureStatus, string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  retenue: "Retenue",
  refusee: "Refusée",
  archivee: "Archivée",
};

export const CANDIDATURE_CV_MAX_BYTES = 5 * 1024 * 1024;
