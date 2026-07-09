import type { IMission } from "@/lib/mongo/models/mission.model";
import { MISSION_VALIDATION_STEPS } from "@/lib/constants/mission";
import {
  notifyMissionCreator,
  notifyMissionParticipantsValidated,
  notifyMissionValidators,
} from "@/lib/services/mission/notify-mission-workflow";
import {
  resolveMissionNotifyTargets,
  type MissionNotifyTarget,
} from "@/lib/services/mission/resolve-mission-notify-targets";

function resolveChefFullname(mission: IMission): string | undefined {
  const chefId = mission.chefMissionId.toString();
  return mission.missionnaires.find((m) => m.userId.toString() === chefId)?.fullname;
}

function resolveDestinationLabel(mission: IMission): string | undefined {
  return (
    mission.commune ||
    mission.departement ||
    mission.region ||
    (mission.pays !== "Sénégal" ? mission.pays : undefined)
  );
}

function missionNotifyPayload(mission: IMission) {
  return {
    _id: mission._id.toString(),
    numero: mission.numero,
    objet: mission.objet,
    direction: mission.direction,
    dateDepart: mission.dateDepart,
    dateRetour: mission.dateRetour,
    chefFullname: resolveChefFullname(mission),
    destinationLabel: resolveDestinationLabel(mission),
  };
}

/** Informe tous les agents missionnaires une fois la mission entièrement validée. */
export async function notifyAfterMissionFullyValidated(mission: IMission): Promise<void> {
  const payload = missionNotifyPayload(mission);
  await notifyMissionParticipantsValidated({
    mission: payload,
    participants: (mission.missionnaires ?? []).map((m) => ({
      userId: m.userId.toString(),
      fullname: m.fullname,
      email: m.email,
      phone: m.phone,
    })),
  });
}

export async function notifyAfterMissionSubmitted(mission: IMission): Promise<void> {
  await notifyMissionPendingValidators(mission);
}

/** Notifie chef de service et directeur lors de la création/soumission. */
export async function notifyMissionPendingValidators(mission: IMission): Promise<void> {
  const payload = missionNotifyPayload(mission);
  const seen = new Set<string>();
  const targets: MissionNotifyTarget[] = [];

  for (const step of MISSION_VALIDATION_STEPS) {
    const stepTargets = await resolveMissionNotifyTargets({
      step,
      direction: mission.direction,
    });
    for (const target of stepTargets) {
      if (seen.has(target.userId)) continue;
      seen.add(target.userId);
      targets.push(target);
    }
  }

  if (!targets.length) return;

  await notifyMissionValidators({
    mission: payload,
    targets,
  });
}

export async function notifyAfterMissionValidated(input: {
  mission: IMission;
  action: "approve" | "reject";
  comment?: string;
}): Promise<void> {
  const { mission, action, comment } = input;
  const payload = missionNotifyPayload(mission);
  const creatorId = mission.createdById.toString();

  if (action === "reject") {
    await notifyMissionCreator({
      creatorId,
      mission: payload,
      event: "rejected",
      comment,
    });
    return;
  }

  if (mission.status === "validee") {
    await notifyAfterMissionFullyValidated(mission);
    return;
  }

  // Les validateurs sont notifiés uniquement à la soumission, pas à chaque étape.
}
