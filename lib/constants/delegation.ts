export const DELEGATION_SCOPES = ["absence_validation"] as const;

export type DelegationScope = (typeof DELEGATION_SCOPES)[number];

export const DELEGATION_STATUSES = ["active", "revoked"] as const;

export type DelegationStatus = (typeof DELEGATION_STATUSES)[number];

export const DELEGATION_SCOPE_LABELS: Record<DelegationScope, string> = {
  absence_validation: "Validation des absences",
};
