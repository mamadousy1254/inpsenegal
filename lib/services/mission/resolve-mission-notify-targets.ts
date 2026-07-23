import type { MissionValidationStep } from "@/lib/constants/mission";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import mongoose from "mongoose";

export type MissionNotifyTarget = {
  userId: string;
  fullname: string;
  email?: string;
  phone?: string;
};

export async function resolveMissionNotifyTargets(input: {
  step: MissionValidationStep;
  direction?: string;
  chefMissionId?: string;
}): Promise<MissionNotifyTarget[]> {
  await connectDB();

  switch (input.step) {
    case "chef_service": {
      const chefId = input.chefMissionId?.trim();
      if (!chefId || !mongoose.Types.ObjectId.isValid(chefId)) return [];
      const chef = await UserModel.findOne({ _id: chefId, isActive: true })
        .select("firstname lastname email phone")
        .lean();
      if (!chef) return [];
      return [
        {
          userId: chef._id.toString(),
          fullname: `${chef.firstname} ${chef.lastname}`.trim(),
          email: chef.email,
          phone: chef.phone,
        },
      ];
    }
    case "directeur": {
      const users = await UserModel.find({
        isActive: true,
        role: "directeur",
      })
        .select("firstname lastname email phone")
        .lean();
      return users.map((user) => ({
        userId: user._id.toString(),
        fullname: `${user.firstname} ${user.lastname}`.trim(),
        email: user.email,
        phone: user.phone,
      }));
    }
    default:
      return [];
  }
}
