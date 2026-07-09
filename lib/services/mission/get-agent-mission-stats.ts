import mongoose from "mongoose";
import MissionModel from "@/lib/mongo/models/mission.model";
import { connectDB } from "@/lib/mongo/db";
import {
  computeMissionDurationDays,
  isInternationalMission,
} from "@/lib/services/mission/compute-mission";
import type { MissionAgentStats } from "@/lib/services/mission/serialize-mission";

/**
 * Calcule l'historique mission d'un agent à partir des documents Mission.
 * Pas de champs stockés sur User — agrégation à la demande.
 */
export async function getAgentMissionStats(userId: string): Promise<MissionAgentStats> {
  await connectDB();

  const uid = new mongoose.Types.ObjectId(userId);
  const missions = await MissionModel.find({
    status: { $in: ["validee", "en_cours", "terminee"] },
    $or: [{ chefMissionId: uid }, { "missionnaires.userId": uid }],
  })
    .select(
      "pays dateDepart dateRetour heureDepart heureRetour budget status rapport chefMissionId missionnaires",
    )
    .sort({ dateDepart: -1 })
    .lean();

  let nombreJoursMission = 0;
  let budgetTotalConsomme = 0;
  let missionsInternationales = 0;
  let missionsNationales = 0;
  let rapportsDeposes = 0;
  let rapportsManquants = 0;

  for (const m of missions) {
    nombreJoursMission += computeMissionDurationDays({
      dateDepart: m.dateDepart,
      heureDepart: m.heureDepart,
      dateRetour: m.dateRetour,
      heureRetour: m.heureRetour,
    });

    budgetTotalConsomme += m.budget?.budgetConsomme ?? 0;

    if (isInternationalMission(m.pays)) {
      missionsInternationales += 1;
    } else {
      missionsNationales += 1;
    }

    if (m.status === "terminee") {
      if (m.rapport?.dateDepot) {
        rapportsDeposes += 1;
      } else {
        rapportsManquants += 1;
      }
    }
  }

  return {
    userId,
    nombreMissions: missions.length,
    nombreJoursMission: Math.round(nombreJoursMission * 100) / 100,
    budgetTotalConsomme: Math.round(budgetTotalConsomme),
    missionsInternationales,
    missionsNationales,
    derniereMission: missions[0]?.dateDepart
      ? new Date(missions[0].dateDepart).toISOString()
      : undefined,
    rapportsDeposes,
    rapportsManquants,
  };
}
