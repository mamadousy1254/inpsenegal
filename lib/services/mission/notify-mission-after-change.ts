import type { IMission } from "@/lib/mongo/models/mission.model";
import {
  notifyMissionCreator,
  notifyMissionParticipantsValidated,
  notifyMissionValidators,
} from "@/lib/services/mission/notify-mission-workflow";
import {
  resolveMissionNotifyTargets,
} from "@/lib/services/mission/resolve-mission-notify-targets";
import { getCurrentPendingStep } from "@/lib/services/mission/validation-workflow";

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

/** Notifie uniquement le validateur de l'étape en cours (chef de mission, puis directeur). */
export async function notifyMissionPendingValidators(mission: IMission): Promise<void> {
  const pending = getCurrentPendingStep(mission.validations ?? []);
  if (!pending) return;

  const payload = missionNotifyPayload(mission);
  const targets = await resolveMissionNotifyTargets({
    step: pending.step,
    direction: mission.direction,
    chefMissionId: mission.chefMissionId.toString(),
  });

  if (!targets.length) return;

  await notifyMissionValidators({
    mission: payload,
    step: pending.step,
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

  if (mission.status === "en_validation") {
    await notifyMissionPendingValidators(mission);
  }
}
