export const ANALYSIS_REQUEST_STATUSES = [
  "nouvelle",
  "en_cours",
  "traitee",
  "archivee",
] as const;

export type AnalysisRequestStatus = (typeof ANALYSIS_REQUEST_STATUSES)[number];

export const ANALYSIS_REQUEST_STATUS_LABELS: Record<AnalysisRequestStatus, string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  traitee: "Traitée",
  archivee: "Archivée",
};

export const ANALYSIS_REQUESTER_TYPES = [
  "Agriculteur",
  "ONG",
  "Collectivité",
  "Entreprise",
  "Projet de recherche",
] as const;

export const ANALYSIS_TYPE_OPTIONS = [
  { label: "Analyse physico-chimique", desc: "Propriétés physiques et chimiques du sol" },
  { label: "Analyse fertilité (NPK)", desc: "Azote, Phosphore, Potassium" },
  { label: "Analyse granulométrique", desc: "Texture et composition du sol" },
  { label: "Analyse salinité", desc: "Concentration en sels solubles" },
  { label: "Analyse pH", desc: "Acidité ou alcalinité du sol" },
  { label: "Analyse complète", desc: "Tous les paramètres pédologiques" },
] as const;

export const ANALYSIS_SEND_MODES = [
  { value: "depot", label: "Dépôt direct au laboratoire" },
  { value: "coursier", label: "Coursier / Transport" },
  { value: "collecte", label: "Collecte sur site (à planifier)" },
] as const;

export const ANALYSIS_REQUEST_NOTIFY_EMAIL =
  process.env.ANALYSIS_REQUEST_NOTIFY_EMAIL ?? "contact.inpsenegal@gmail.com";
