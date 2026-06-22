import mongoose from "mongoose";
import type { ConvocationTargetMode } from "@/lib/constants/convocation";
import type { IConvocationInvitee } from "@/lib/mongo/models/convocation.model";
import UserModel from "@/lib/mongo/models/user.model";

export async function resolveConvocationInvitees(input: {
  targetMode: ConvocationTargetMode;
  userIds?: string[];
  service?: string;
  direction?: string;
  section?: string;
  excludeUserId?: string;
}): Promise<IConvocationInvitee[]> {
  const filter: Record<string, unknown> = {
    isActive: true,
    role: { $ne: "partenaire" },
  };

  if (input.excludeUserId) {
    filter._id = { $ne: new mongoose.Types.ObjectId(input.excludeUserId) };
  }

  switch (input.targetMode) {
    case "individual":
      if (!input.userIds?.length) return [];
      filter._id = {
        ...(filter._id as object),
        $in: input.userIds
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id)),
      };
      break;
    case "service":
      if (!input.service?.trim()) return [];
      filter.service = new RegExp(
        `^${input.service.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      );
      break;
    case "direction":
      if (!input.direction?.trim()) return [];
      filter.direction = new RegExp(
        `^${input.direction.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      );
      break;
    case "section":
      if (!input.section?.trim()) return [];
      filter.section = input.section.trim();
      break;
    default:
      return [];
  }

  const users = await UserModel.find(filter)
    .select("firstname lastname email phone service direction section")
    .sort({ lastname: 1, firstname: 1 })
    .lean();

  const seen = new Set<string>();

  return users.reduce<IConvocationInvitee[]>((acc, user) => {
    const userId = user._id.toString();
    if (seen.has(userId)) return acc;
    seen.add(userId);

    acc.push({
      userId: user._id,
      fullname: `${user.firstname} ${user.lastname}`.trim(),
      email: user.email,
      phone: user.phone,
      service: user.service,
      direction: user.direction,
      section: user.section,
      responseStatus: "pending",
    });

    return acc;
  }, []);
}

export async function listConvocationFilterOptions() {
  const users = await UserModel.find({
    isActive: true,
    role: { $ne: "partenaire" },
  })
    .select("service direction section")
    .lean();

  const services = new Set<string>();
  const directions = new Set<string>();
  const sections = new Set<string>();

  for (const user of users) {
    if (user.service?.trim()) services.add(user.service.trim());
    if (user.direction?.trim()) directions.add(user.direction.trim());
    if (user.section?.trim()) sections.add(user.section.trim());
  }

  return {
    services: [...services].sort((a, b) => a.localeCompare(b, "fr")),
    directions: [...directions].sort((a, b) => a.localeCompare(b, "fr")),
    sections: [...sections].sort((a, b) => a.localeCompare(b, "fr")),
  };
}
