import type { UserRole } from "@/lib/permissions/roles";

export const NOTIFIER_CHANNELS = ["sms", "email"] as const;
export type NotifierChannel = (typeof NOTIFIER_CHANNELS)[number];

export const NOTIFIER_CHANNEL_LABELS: Record<NotifierChannel, string> = {
  sms: "SMS",
  email: "E-mail",
};

/** Rôles pouvant être assignés comme validateurs d'absence. */
export const VALIDATOR_ELIGIBLE_ROLES = [
  "super_admin",
  "admin",
  "rh",
  "manager",
] as const satisfies readonly UserRole[];

export function canBeAbsenceValidator(role: UserRole): boolean {
  return (VALIDATOR_ELIGIBLE_ROLES as readonly UserRole[]).includes(role);
}
