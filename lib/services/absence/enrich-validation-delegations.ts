import { findActiveDelegationsForDelegators } from "@/lib/services/delegation/delegation-service";
import type { AbsenceValidationEntry } from "@/lib/types/absence";

export async function enrichValidationsWithActiveDelegations(
  validations: AbsenceValidationEntry[],
): Promise<AbsenceValidationEntry[]> {
  if (validations.length === 0) return validations;

  const pendingValidatorIds = validations
    .filter((validation) => !validation.isValidated && !validation.isRejected)
    .map((validation) => validation.validatorUserId);

  if (pendingValidatorIds.length === 0) return validations;

  const delegations =
    await findActiveDelegationsForDelegators(pendingValidatorIds);

  return validations.map((validation) => {
    const delegation = delegations[validation.validatorUserId];
    if (
      !delegation ||
      validation.isValidated ||
      validation.isRejected
    ) {
      return validation;
    }

    return {
      ...validation,
      activeDelegation: {
        delegateUserId: delegation.delegateUserId,
        delegateFullname: delegation.delegateFullname,
        startAt: delegation.startAt,
        endAt: delegation.endAt,
        reason: delegation.reason,
      },
    };
  });
}

export async function enrichAbsenceValidations<
  T extends { validations: AbsenceValidationEntry[] },
>(absence: T): Promise<T> {
  return {
    ...absence,
    validations: await enrichValidationsWithActiveDelegations(
      absence.validations,
    ),
  };
}
