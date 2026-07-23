import type { MissionValidationStep } from "@/lib/constants/mission";
import type { IMission } from "@/lib/mongo/models/mission.model";
import {
  canDeleteAnyMission,
  canManageAllMissions,
  canViewAllMissions,
  isDirectorOrAdminRole,
  isMissionManagerRole,
} from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

export type MissionSessionUser = {
  id: string;
  role: UserRole;
  direction?: string;
  service?: string;
};

export function isMissionParticipant(
  mission: Pick<IMission, "chefMissionId" | "missionnaires" | "createdById">,
  userId: string,
): boolean {
  const uid = userId.toString();
  if (mission.createdById.toString() === uid) return true;
  if (mission.chefMissionId.toString() === uid) return true;
  return (mission.missionnaires ?? []).some((m) => m.userId.toString() === uid);
}

export function canAccessMission(
  user: MissionSessionUser,
  mission: Pick<
    IMission,
    "chefMissionId" | "missionnaires" | "createdById" | "direction"
  >,
): boolean {
  if (canViewAllMissions(user.role)) return true;
  if (isMissionParticipant(mission, user.id)) return true;
  if (
    isMissionManagerRole(user.role) &&
    user.direction &&
    mission.direction &&
    mission.direction === user.direction
  ) {
    return true;
  }
  return false;
}

/** Rôles autorisés à valider une étape du workflow (chef de mission, puis directeur). */
export function canValidateMissionStep(
  user: MissionSessionUser,
  step: MissionValidationStep,
  mission: Pick<IMission, "chefMissionId">,
): boolean {
  switch (step) {
    case "chef_service":
      return mission.chefMissionId.toString() === user.id.toString();
    case "directeur":
      return isDirectorOrAdminRole(user.role);
    default:
      return false;
  }
}

/** Validation complète à la création (admin / RH). */
export function canValidateMissionOnCreate(role: UserRole): boolean {
  return canManageAllMissions(role);
}

export function canEditMission(
  user: MissionSessionUser,
  mission: Pick<IMission, "status" | "createdById" | "chefMissionId" | "missionnaires">,
): boolean {
  if (canManageAllMissions(user.role)) return true;
  if (!["brouillon", "en_validation"].includes(mission.status)) return false;
  return mission.createdById.toString() === user.id;
}

export function canDeleteMission(
  user: MissionSessionUser,
  _mission: Pick<IMission, "status" | "createdById">,
): boolean {
  return canDeleteAnyMission(user.role);
}

export function canSubmitMission(
  user: MissionSessionUser,
  mission: Pick<IMission, "status" | "createdById" | "chefMissionId" | "missionnaires">,
): boolean {
  if (mission.status !== "brouillon") return false;
  if (canManageAllMissions(user.role)) return true;
  return isMissionParticipant(mission, user.id);
}

export function canTrackMissionTerrain(
  user: MissionSessionUser,
  mission: Pick<
    IMission,
    "status" | "chefMissionId" | "missionnaires" | "createdById"
  >,
): boolean {
  if (mission.status !== "en_cours") return false;
  if (canManageAllMissions(user.role)) return true;
  return isMissionParticipant(mission, user.id);
}
