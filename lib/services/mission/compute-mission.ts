import type { IMissionBudget } from "@/lib/mongo/models/mission.model";

export type MissionDateTimeInput = {
  dateDepart: Date | string;
  heureDepart?: string;
  dateRetour: Date | string;
  heureRetour?: string;
};

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/** Parse "HH:mm" en minutes depuis minuit. */
function parseTimeMinutes(time?: string): number | null {
  if (!time?.trim()) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/**
 * Calcule la durée d'une mission en jours (décimal).
 * Si des heures sont fournies, la fraction de journée est prise en compte.
 */
export function computeMissionDurationDays(input: MissionDateTimeInput): number {
  const depart = toDate(input.dateDepart);
  const retour = toDate(input.dateRetour);

  const departMinutes = parseTimeMinutes(input.heureDepart) ?? 0;
  const retourMinutes = parseTimeMinutes(input.heureRetour) ?? 24 * 60;

  const startMs =
    depart.getTime() -
    depart.getHours() * 3_600_000 -
    depart.getMinutes() * 60_000 +
    departMinutes * 60_000;

  const endMs =
    retour.getTime() -
    retour.getHours() * 3_600_000 -
    retour.getMinutes() * 60_000 +
    retourMinutes * 60_000;

  if (endMs <= startMs) return 0;

  const diffDays = (endMs - startMs) / (24 * 60 * 60 * 1000);
  return Math.round(diffDays * 100) / 100;
}

export type MissionBudgetInput = Partial<IMissionBudget> & {
  budgetConsomme?: number;
};

/** Budget prévisionnel : postes détaillés (anciennes missions) ou budget global. */
export function computeMissionBudgetPrevu(budget: MissionBudgetInput): number {
  const fields: (keyof IMissionBudget)[] = [
    "perDiem",
    "hebergement",
    "transport",
    "carburant",
    "peage",
    "communication",
    "divers",
  ];

  const linesTotal = fields.reduce(
    (sum, key) => sum + (Number(budget[key]) || 0),
    0,
  );

  if (linesTotal > 0) {
    return Math.round(linesTotal);
  }

  return Math.round(Number(budget.budgetPrevu) || 0);
}

/** Budget restant = prévu − consommé (minimum 0). */
export function computeMissionBudgetRestant(
  budgetPrevu: number,
  budgetConsomme = 0,
): number {
  return Math.max(0, Math.round(budgetPrevu - budgetConsomme));
}

/** Détermine si une mission est internationale (hors Sénégal). */
export function isInternationalMission(pays?: string): boolean {
  if (!pays?.trim()) return false;
  const normalized = pays.trim().toLowerCase();
  return normalized !== "sénégal" && normalized !== "senegal";
}
