import type { Session } from "next-auth";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import type { UserRole } from "@/lib/permissions/roles";
import type { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";

export type FreshSessionResult =
  | { status: "ok"; session: Session }
  | { status: "unauthenticated" }
  | { status: "inactive" };

/**
 * Session NextAuth enrichie avec les données utilisateur à jour en base
 * (rôle, nom, etc.) — évite un JWT figé depuis la connexion.
 */
export async function resolveFreshSession(): Promise<FreshSessionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "unauthenticated" };
  }

  try {
    await connectDB();
    const dbUser = await UserModel.findById(session.user.id)
      .select(
        "email firstname lastname role section occupation avatar isActive",
      )
      .lean();

    if (!dbUser) {
      // Échec de lecture / utilisateur introuvable : ne pas invalider
      // la session JWT (évite une boucle login ↔ dashboard).
      return { status: "ok", session };
    }

    if (!dbUser.isActive) {
      return { status: "inactive" };
    }

    return {
      status: "ok",
      session: {
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
      },
    };
  } catch (error) {
    console.error("resolveFreshSession:", error);
    return { status: "ok", session };
  }
}

/** Compatibilité : session enrichie, ou null si non authentifié / inactif. */
export async function getFreshSession(): Promise<Session | null> {
  const result = await resolveFreshSession();
  if (result.status === "ok") return result.session;
  return null;
}
