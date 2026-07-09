import MissionModel from "@/lib/mongo/models/mission.model";

/** Génère un numéro unique au format MIS-YYYY-NNNN (ex. MIS-2026-0001). */
export async function generateMissionNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `MIS-${year}-`;

  const last = await MissionModel.findOne({ numero: new RegExp(`^${prefix}`) })
    .sort({ numero: -1 })
    .select("numero")
    .lean();

  if (!last?.numero) {
    return `${prefix}0001`;
  }

  const seq = Number(last.numero.replace(prefix, ""));
  const next = Number.isNaN(seq) ? 1 : seq + 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}
