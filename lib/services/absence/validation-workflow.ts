import type { ValidationStatus } from "@/lib/constants/leave";
import type { IAbsenceValidation } from "@/lib/mongo/models/absence-request.model";

export type ValidationStepLike = {
  validatorUserId: { toString(): string } | string;
  level: number;
  isValidated: boolean;
  isRejected: boolean;
  fullname?: string;
};

function validatorId(value: ValidationStepLike["validatorUserId"]): string {
  return typeof value === "string" ? value : value.toString();
}

export function determineValidationStatus(
  validations: ValidationStepLike[],
): ValidationStatus {
  if (validations.some((v) => v.isRejected)) return "rejetee";
  if (validations.length === 0) return "en_attente";

  const sorted = [...validations].sort((a, b) => a.level - b.level);
  const allApproved = sorted.every((v) => v.isValidated);
  if (allApproved) return "approuvee";

  const firstPendingIndex = sorted.findIndex(
    (v) => !v.isValidated && !v.isRejected,
  );
  if (firstPendingIndex === 0) return "en_attente";
  return "en_cours";
}

function getSortedValidations(validations: ValidationStepLike[]) {
  return [...validations].sort((a, b) => a.level - b.level);
}

/** Validation en attente au niveau courant (premier niveau non traité). */
export function getCurrentPendingValidation(
  validations: ValidationStepLike[],
): ValidationStepLike | undefined {
  const sorted = getSortedValidations(validations);
  const pending = sorted.find((v) => !v.isValidated && !v.isRejected);
  if (!pending) return undefined;

  const lowerLevels = sorted.filter((v) => v.level < pending.level);
  if (!lowerLevels.every((v) => v.isValidated)) return undefined;

  return pending;
}

/**
 * Retourne l'entrée de validation que l'utilisateur peut traiter
 * (titulaire ou délégué actif).
 */
export function findActingValidation(
  validations: ValidationStepLike[],
  actingUserId: string,
  delegatorIdsForActor: string[] = [],
): ValidationStepLike | undefined {
  const pending = getCurrentPendingValidation(validations);
  if (!pending) return undefined;

  const pendingValidatorId = validatorId(pending.validatorUserId);
  if (pendingValidatorId === actingUserId) return pending;
  if (delegatorIdsForActor.includes(pendingValidatorId)) return pending;

  return undefined;
}

/** Le validateur au niveau courant peut agir si les niveaux inférieurs sont approuvés. */
export function canValidatorAct(
  validations: ValidationStepLike[],
  validatorUserId: string,
  delegatorIdsForActor: string[] = [],
): boolean {
  return (
    findActingValidation(validations, validatorUserId, delegatorIdsForActor) !==
    undefined
  );
}

export function countApproved(validations: ValidationStepLike[]): number {
  return validations.filter((v) => v.isValidated && !v.isRejected).length;
}

export function countRejected(validations: ValidationStepLike[]): number {
  return validations.filter((v) => v.isRejected).length;
}

/** Décision finale : plus aucune validation en attente. */
export function isFinalValidationStatus(status: ValidationStatus): boolean {
  return status === "approuvee" || status === "rejetee";
}

/** Validateurs du niveau courant en attente de traitement. */
export function getValidatorsToNotify(
  validations: IAbsenceValidation[],
): IAbsenceValidation[] {
  const sorted = [...validations].sort((a, b) => a.level - b.level);
  const firstPending = sorted.find((v) => !v.isValidated && !v.isRejected);
  if (!firstPending) return [];

  return sorted.filter(
    (v) =>
      v.level === firstPending.level && !v.isValidated && !v.isRejected,
  );
}
