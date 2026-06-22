import type { Session } from "next-auth";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import type { UserRole } from "@/lib/permissions/roles";
import type { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";

/**
 * Session NextAuth enrichie avec les données utilisateur à jour en base
 * (rôle, nom, etc.) — évite un JWT figé depuis la connexion.
 */
export async function getFreshSession(): Promise<Session | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    await connectDB();
    const dbUser = await UserModel.findById(session.user.id)
      .select(
        "email firstname lastname role section occupation avatar isActive",
      )
      .lean();

    if (!dbUser?.isActive) {
      return null;
    }

    return {
      ...session,
      user: {
        ...session.user,
        email: dbUser.email,
        firstname: dbUser.firstname,
        lastname: dbUser.lastname,
        role: dbUser.role as UserRole,
        section: dbUser.section as (typeof SENEGAL_REGIONS)[number],
        occupation: dbUser.occupation,
        avatar: dbUser.avatar,
      },
    };
  } catch (error) {
    console.error("getFreshSession:", error);
    return session;
  }
}
