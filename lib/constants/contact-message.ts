export const CONTACT_SUBJECTS = [
  "Demande d'information générale",
  "Demande de service technique",
  "Collaboration / partenariat",
  "Candidature / stage",
  "Presse / communication",
  "Réclamation",
  "Autre",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const CONTACT_MESSAGE_STATUSES = [
  "nouvelle",
  "en_cours",
  "traitee",
  "archivee",
] as const;

export type ContactMessageStatus = (typeof CONTACT_MESSAGE_STATUSES)[number];

export const CONTACT_MESSAGE_STATUS_LABELS: Record<ContactMessageStatus, string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  traitee: "Traitée",
  archivee: "Archivée",
};

export const CONTACT_NOTIFY_EMAIL =
  process.env.CONTACT_NOTIFY_EMAIL ??
  process.env.INP_NOTIFY_EMAIL ??
  "contact.inpsenegal@gmail.com";

export const CONTACT_DASHBOARD_URL = "/dashboard/rendez-vous";
