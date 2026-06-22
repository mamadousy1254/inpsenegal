/** Jours de congé acquis par mois civil (politique INP). */
export const LEAVE_DAYS_PER_MONTH = 2;

export const ABSENCE_TYPES = ["conge", "absence", "maladie", "autre"] as const;
export type AbsenceType = (typeof ABSENCE_TYPES)[number];

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  conge: "Congé payé",
  absence: "Absence",
  maladie: "Maladie",
  autre: "Autre",
};

/** Motifs détaillés affichés dans le formulaire de demande */
export const ABSENCE_REASON_OPTIONS = [
  { value: "raison personnelle", label: "Raison personnelle", type: "absence" as const },
  { value: "raison medicale", label: "Raison médicale", type: "maladie" as const },
  { value: "repos medicale", label: "Repos médical", type: "maladie" as const },
  { value: "raison familiale", label: "Raison familiale", type: "absence" as const },
  { value: "convenance personnelle", label: "Convenance personnelle", type: "absence" as const },
  { value: "conges", label: "Congés", type: "conge" as const },
  {
    value: "raison administrative ou judiciaire",
    label: "Raison administrative ou judiciaire",
    type: "autre" as const,
  },
  {
    value: "raison d'études ou de formation",
    label: "Raison d'études ou de formation",
    type: "autre" as const,
  },
  { value: "raison religieuse", label: "Raison religieuse", type: "autre" as const },
] as const;

export type AbsenceReasonValue =
  (typeof ABSENCE_REASON_OPTIONS)[number]["value"];

export function getAbsenceTypeFromReason(reason: string): AbsenceType {
  const found = ABSENCE_REASON_OPTIONS.find((r) => r.value === reason);
  return found?.type ?? "absence";
}

export function getAbsenceReasonLabel(reason: string): string {
  const found = ABSENCE_REASON_OPTIONS.find((r) => r.value === reason);
  return found?.label ?? reason;
}

/** Motifs qui n'impactent pas le solde de congés (maladie / repos médical). */
const LEAVE_EXEMPT_REASON_VALUES = new Set<AbsenceReasonValue>([
  "raison medicale",
  "repos medicale",
]);

/** Indique si une demande approuvée doit déduire des jours du solde de congés. */
export function shouldDeductLeaveBalance(raison: string): boolean {
  const trimmed = raison.trim();
  const match =
    ABSENCE_REASON_OPTIONS.find((r) => r.value === trimmed) ??
    ABSENCE_REASON_OPTIONS.find((r) => r.label === trimmed);

  if (match) {
    return !LEAVE_EXEMPT_REASON_VALUES.has(match.value);
  }

  const lower = trimmed.toLowerCase();
  return lower !== "raison médicale" && lower !== "repos médical";
}

export const VALIDATION_STATUSES = [
  "en_attente",
  "en_cours",
  "approuvee",
  "rejetee",
] as const;
export type ValidationStatus = (typeof VALIDATION_STATUSES)[number];

export const VALIDATION_STATUS_LABELS: Record<ValidationStatus, string> = {
  en_attente: "En attente",
  en_cours: "En cours de validation",
  approuvee: "Approuvée",
  rejetee: "Rejetée",
};
