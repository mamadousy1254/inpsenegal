import type { IMission } from "@/lib/mongo/models/mission.model";
import {
  computeMissionBudgetPrevu,
  computeMissionBudgetRestant,
  computeMissionDurationDays,
} from "@/lib/services/mission/compute-mission";

/** Recalcule durée et budget avant persistance. */
export function applyMissionComputedFields(mission: IMission): void {
  mission.dureeCalculee = computeMissionDurationDays({
    dateDepart: mission.dateDepart,
    heureDepart: mission.heureDepart,
    dateRetour: mission.dateRetour,
    heureRetour: mission.heureRetour,
  });

  if (!mission.budget) {
    mission.budget = {};
  }

  mission.budget.budgetPrevu = computeMissionBudgetPrevu(mission.budget);
  mission.budget.budgetRestant = computeMissionBudgetRestant(
    mission.budget.budgetPrevu,
    mission.budget.budgetConsomme ?? 0,
  );
}
