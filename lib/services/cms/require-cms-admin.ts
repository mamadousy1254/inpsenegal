import { auth } from "@/lib/auth/auth";
import { canManageSiteContent } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

export async function requireCmsAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Non autorisé", status: 401 as const, session: null };
  }

  const role = session.user.role as UserRole;
  if (!canManageSiteContent(role)) {
    return { error: "Non autorisé", status: 403 as const, session: null };
  }

  return { error: null, status: null, session };
}
