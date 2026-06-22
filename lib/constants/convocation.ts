export const CONVOCATION_STATUSES = [
  "brouillon",
  "envoyee",
  "terminee",
  "archivee",
  "annulee",
] as const;

export type ConvocationStatus = (typeof CONVOCATION_STATUSES)[number];

export const CONVOCATION_STATUS_LABELS: Record<ConvocationStatus, string> = {
  brouillon: "Brouillon",
  envoyee: "Envoyée",
  terminee: "Terminée",
  archivee: "Archivée",
  annulee: "Annulée",
};

export const CONVOCATION_LOCATION_TYPES = ["presentiel", "visio"] as const;

export type ConvocationLocationType =
  (typeof CONVOCATION_LOCATION_TYPES)[number];

export const CONVOCATION_LOCATION_TYPE_LABELS: Record<
  ConvocationLocationType,
  string
> = {
  presentiel: "Présentiel",
  visio: "Visioconférence",
};

export const CONVOCATION_RESPONSE_STATUSES = [
  "pending",
  "present",
  "absent",
  "excused",
] as const;

export type ConvocationResponseStatus =
  (typeof CONVOCATION_RESPONSE_STATUSES)[number];

export const CONVOCATION_RESPONSE_LABELS: Record<
  ConvocationResponseStatus,
  string
> = {
  pending: "En attente",
  present: "Présent",
  absent: "Absent",
  excused: "Excusé",
};

export const CONVOCATION_TARGET_MODES = [
  "individual",
  "service",
  "direction",
  "section",
] as const;

export type ConvocationTargetMode = (typeof CONVOCATION_TARGET_MODES)[number];

export const CONVOCATION_TARGET_MODE_LABELS: Record<
  ConvocationTargetMode,
  string
> = {
  individual: "Agents individuels",
  service: "Par service",
  direction: "Par direction",
  section: "Par section / région",
};

export const CONVOCATION_ATTENDANCE_METHODS = ["code", "secretary", "self"] as const;

export type ConvocationAttendanceMethod =
  (typeof CONVOCATION_ATTENDANCE_METHODS)[number];
