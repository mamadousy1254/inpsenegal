import type { IMission } from "@/lib/mongo/models/mission.model";
import type { MissionStatus, MissionType } from "@/lib/constants/mission";

export type SerializedMissionCalendarItem = {
  _id: string;
  numero: string;
  objet: string;
  type: MissionType;
  status: MissionStatus;
  dateDepart: string;
  dateRetour: string;
  destinationLabel: string;
  chefFullname: string;
};

function formatDestination(doc: IMission): string {
  const parts = [
    doc.village,
    doc.commune,
    doc.departement,
    doc.region,
    doc.pays !== "Sénégal" ? doc.pays : undefined,
  ].filter(Boolean);
  return parts.join(", ") || doc.pays || "—";
}

export function serializeMissionCalendarItem(
  doc: IMission | Record<string, unknown>,
): SerializedMissionCalendarItem {
  const d = doc as IMission;
  const chefId = d.chefMissionId?.toString();
  const chef =
    (d.missionnaires ?? []).find((m) => m.userId?.toString() === chefId)?.fullname ??
    "—";

  return {
    _id: d._id.toString(),
    numero: d.numero,
    objet: d.objet,
    type: d.type,
    status: d.status,
    dateDepart: d.dateDepart.toISOString(),
    dateRetour: d.dateRetour.toISOString(),
    destinationLabel: formatDestination(d),
    chefFullname: chef,
  };
}
