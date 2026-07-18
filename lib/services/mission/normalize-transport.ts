import mongoose from "mongoose";
import type { IMissionTransport } from "@/lib/mongo/models/mission.model";

type OccupantInput = {
  userId?: string;
  fullname?: string;
  occupation?: string;
  service?: string;
};

/** Normalise le transport (occupants) avant persistance Mongo. */
export function normalizeMissionTransport(
  transport: Record<string, unknown> | IMissionTransport | undefined | null,
): IMissionTransport {
  if (!transport || typeof transport !== "object") {
    return {};
  }

  const raw = transport as Record<string, unknown>;
  const occupantsRaw = Array.isArray(raw.occupantsParVehicule)
    ? (raw.occupantsParVehicule as OccupantInput[][])
    : [];

  const occupantsParVehicule = occupantsRaw.map((vehicle) =>
    (Array.isArray(vehicle) ? vehicle : [])
      .filter((o) => o?.userId && o?.fullname)
      .map((o) => ({
        userId: new mongoose.Types.ObjectId(String(o.userId)),
        fullname: String(o.fullname).trim(),
        occupation: o.occupation?.trim() || undefined,
        service: o.service?.trim() || undefined,
      })),
  );

  return {
    ...(raw as IMissionTransport),
    occupantsParVehicule,
  };
}
