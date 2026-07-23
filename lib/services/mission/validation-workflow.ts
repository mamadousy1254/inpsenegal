import type {
  MissionValidationStep,
  MissionValidationStepStatus,
} from "@/lib/constants/mission";
import { MISSION_VALIDATION_STEPS } from "@/lib/constants/mission";
import type { IMission, IMissionValidation } from "@/lib/mongo/models/mission.model";
import type { MissionSessionUser } from "@/lib/services/mission/mission-access";
import { canValidateMissionStep } from "@/lib/services/mission/mission-access";

export function buildInitialValidations(): IMissionValidation[] {
  return MISSION_VALIDATION_STEPS.map((step) => ({
    step,
    status: "en_attente" as MissionValidationStepStatus,
  }));
}

/** Première étape encore en attente. */
export function getCurrentPendingStep(
  validations: IMissionValidation[],
): IMissionValidation | undefined {
  return validations.find((v) => v.status === "en_attente");
}

export function areAllValidationsApproved(validations: IMissionValidation[]): boolean {
  return validations.every((v) => v.status === "valide");
}

export function hasRejectedValidation(validations: IMissionValidation[]): boolean {
  return validations.some((v) => v.status === "rejete");
}

export function canUserActOnPendingStep(
  user: MissionSessionUser,
  validations: IMissionValidation[],
  mission: Pick<IMission, "chefMissionId">,
): { allowed: boolean; step?: MissionValidationStep } {
  const pending = getCurrentPendingStep(validations);
  if (!pending) return { allowed: false };
  const allowed = canValidateMissionStep(user, pending.step, mission);
  return { allowed, step: pending.step };
}

export function resolveStatusAfterValidation(
  validations: IMissionValidation[],
): IMission["status"] {
  if (hasRejectedValidation(validations)) return "brouillon";
  if (areAllValidationsApproved(validations)) return "validee";
  return "en_validation";
}
