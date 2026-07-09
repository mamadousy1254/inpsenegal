import mongoose from "mongoose";

import { canViewAllMissions, isMissionManagerRole } from "@/lib/permissions/can";
import type { MissionSessionUser } from "@/lib/services/mission/mission-access";

/** Filtre MongoDB pour la liste des missions selon le rôle. */
export function buildMissionListFilter(
  user: MissionSessionUser,
  scope: "all" | "mine" = "mine",
): Record<string, unknown> {
  if (canViewAllMissions(user.role) && scope === "all") {
    return {};
  }

  const uid = new mongoose.Types.ObjectId(user.id);
  const orConditions: Record<string, unknown>[] = [
    { createdById: uid },
    { chefMissionId: uid },
    { "missionnaires.userId": uid },
  ];

  if (isMissionManagerRole(user.role) && user.direction?.trim()) {
    orConditions.push({ direction: user.direction.trim() });
  }

  return { $or: orConditions };
}
