import { auth } from "@/lib/auth/auth";
import { canManageLabRequests } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

export async function requireLabAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Non autorisé", status: 401 as const, session: null };
  }

  const role = session.user.role as UserRole;
  if (!canManageLabRequests(role)) {
    return { error: "Non autorisé", status: 403 as const, session: null };
  }

  return { error: null, status: null, session };
}
