import type { MissionValidationStep } from "@/lib/constants/mission";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";

export type MissionNotifyTarget = {
  userId: string;
  fullname: string;
  email?: string;
  phone?: string;
};

export async function resolveMissionNotifyTargets(input: {
  step: MissionValidationStep;
  direction?: string;
}): Promise<MissionNotifyTarget[]> {
  await connectDB();

  let filter: Record<string, unknown> = {
    isActive: true,
    role: { $ne: "partenaire" },
  };

  switch (input.step) {
    case "chef_service":
      filter.role = "manager";
      if (input.direction?.trim()) {
        filter.direction = input.direction.trim();
      }
      break;
    case "directeur":
      filter.role = { $in: ["directeur", "admin", "super_admin"] };
      break;
    default:
      return [];
  }

  const users = await UserModel.find(filter)
    .select("firstname lastname email phone")
    .lean();

  return users.map((user) => ({
    userId: user._id.toString(),
    fullname: `${user.firstname} ${user.lastname}`.trim(),
    email: user.email,
    phone: user.phone,
  }));
}
