import mongoose from "mongoose";
import UserModel from "@/lib/mongo/models/user.model";
import { connectDB } from "@/lib/mongo/db";
import type { IMissionParticipant } from "@/lib/mongo/models/mission.model";

export async function resolveMissionParticipants(
  userIds: string[],
  chefMissionId: string,
): Promise<IMissionParticipant[]> {
  await connectDB();

  const uniqueIds = [...new Set(userIds.map(String))];
  if (!uniqueIds.includes(chefMissionId)) {
    uniqueIds.push(chefMissionId);
  }

  const objectIds = uniqueIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  const users = await UserModel.find({
    _id: { $in: objectIds },
    isActive: true,
  })
    .select("firstname lastname email phone occupation service")
    .lean();

  if (!users.length) {
    throw new Error("Aucun agent valide sélectionné");
  }

  const chef = users.find((u) => u._id.toString() === chefMissionId);
  if (!chef) {
    throw new Error("Chef de mission introuvable ou inactif");
  }

  return users.map((user) => ({
    userId: user._id as mongoose.Types.ObjectId,
    fullname: `${user.firstname} ${user.lastname}`.trim(),
    occupation: user.occupation,
    service: user.service,
    phone: user.phone,
    email: user.email,
  }));
}

export async function resolveChefMissionId(chefMissionId: string): Promise<{
  id: mongoose.Types.ObjectId;
  fullname: string;
  direction?: string;
  service?: string;
}> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(chefMissionId)) {
    throw new Error("Chef de mission invalide");
  }

  const user = await UserModel.findOne({
    _id: chefMissionId,
    isActive: true,
  })
    .select("firstname lastname direction service")
    .lean();

  if (!user) {
    throw new Error("Chef de mission introuvable");
  }

  return {
    id: user._id as mongoose.Types.ObjectId,
    fullname: `${user.firstname} ${user.lastname}`.trim(),
    direction: user.direction,
    service: user.service,
  };
}
