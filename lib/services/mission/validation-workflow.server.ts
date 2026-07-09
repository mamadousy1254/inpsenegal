import mongoose from "mongoose";

import type {
  MissionValidationStep,
  MissionValidationStepStatus,
} from "@/lib/constants/mission";
import type { IMissionValidation } from "@/lib/mongo/models/mission.model";

export function markAllValidationsApproved(
  validations: IMissionValidation[],
  user: { id: string; fullname: string },
): IMissionValidation[] {
  const now = new Date();
  const validatorId = new mongoose.Types.ObjectId(user.id);
  return validations.map((v) => ({
    ...v,
    status: "valide" as const,
    validatorId,
    validatorFullname: user.fullname,
    validatedAt: now,
  }));
}

export function applyValidationDecision(input: {
  validations: IMissionValidation[];
  step: MissionValidationStep;
  action: "approve" | "reject";
  user: { id: string; fullname: string };
  comment?: string;
}): IMissionValidation[] {
  return input.validations.map((v) => {
    if (v.step !== input.step) return v;
    return {
      ...v,
      status: input.action === "approve" ? ("valide" as const) : ("rejete" as const),
      validatorId: new mongoose.Types.ObjectId(input.user.id),
      validatorFullname: input.user.fullname,
      validatedAt: new Date(),
      comment: input.comment,
    };
  });
}

/** Réinitialise le workflow après rejet ou nouvelle soumission. */
export function resetValidationsForResubmit(
  validations: IMissionValidation[],
): IMissionValidation[] {
  return validations.map((v) => ({
    step: v.step,
    status: "en_attente" as MissionValidationStepStatus,
  }));
}
