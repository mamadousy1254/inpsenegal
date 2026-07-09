import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import type { UserRole } from "@/lib/permissions/roles";
import type { MissionSessionUser } from "@/lib/services/mission/mission-access";

/** Rôle et direction depuis la base (source de vérité pour les permissions missions). */
export async function resolveMissionSessionUser(input: {
  id: string;
  role?: UserRole;
}): Promise<MissionSessionUser | null> {
  await connectDB();

  const dbUser = await UserModel.findById(input.id)
    .select("role direction service isActive")
    .lean();

  if (!dbUser?.isActive) return null;

  const role = (dbUser.role ?? input.role) as UserRole;
  const sessionUser: MissionSessionUser = {
    id: input.id,
    role,
  };

  if (role === "manager") {
    sessionUser.direction = dbUser.direction;
    sessionUser.service = dbUser.service;
  }

  return sessionUser;
}
