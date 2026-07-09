import type { IMission, IMissionValidation } from "@/lib/mongo/models/mission.model";
import { canManageAllMissions, isMissionManagerRole } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import {
  canDeleteMission,
  canEditMission,
  canSubmitMission,
  canTrackMissionTerrain,
  isMissionParticipant,
  type MissionSessionUser,
} from "@/lib/services/mission/mission-access";
import type { SerializedMission } from "@/lib/services/mission/serialize-mission";
import {
  canUserActOnPendingStep,
  getCurrentPendingStep,
} from "@/lib/services/mission/validation-workflow";

export function buildMissionSessionUser(input: {
  id: string;
  role: UserRole;
  direction?: string;
  service?: string;
}): MissionSessionUser {
  return {
    id: input.id,
    role: input.role,
    direction: input.direction,
    service: input.service,
  };
}

function asMissionRef(mission: SerializedMission) {
  return mission as unknown as Pick<
    IMission,
    "status" | "createdById" | "chefMissionId" | "missionnaires" | "direction"
  >;
}

function asValidations(validations: SerializedMission["validations"]) {
  return validations as unknown as IMissionValidation[];
}

export function getMissionDetailPermissions(input: {
  user: MissionSessionUser;
  mission: SerializedMission;
}) {
  const { user, mission } = input;
  const missionRef = asMissionRef(mission);
  const validations = asValidations(mission.validations);
  const participant = isMissionParticipant(missionRef, user.id);
  const validation = canUserActOnPendingStep(user, validations);
  const pendingStep = getCurrentPendingStep(validations);

  const canReviewProlongation =
    canManageAllMissions(user.role) ||
    (isMissionManagerRole(user.role) &&
      Boolean(user.direction) &&
      mission.direction === user.direction);

  return {
    canSubmit: canSubmitMission(user, missionRef),
    canValidate: mission.status === "en_validation" && validation.allowed,
    pendingValidationStep: validation.step,
    canStart:
      mission.status === "validee" &&
      (participant || canManageAllMissions(user.role)),
    canTrackTerrain: canTrackMissionTerrain(user, missionRef),
    canSubmitReport:
      mission.status === "en_cours" &&
      (participant || canManageAllMissions(user.role)),
    canEdit: canEditMission(user, missionRef),
    canDelete: canDeleteMission(user, missionRef),
    canCancel:
      ["validee", "en_cours"].includes(mission.status) &&
      canManageAllMissions(user.role),
    canReviewProlongation,
    pendingStepLabel: pendingStep?.step,
  };
}
