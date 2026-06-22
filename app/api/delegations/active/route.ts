import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { canManageUsers } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { findActiveDelegationsForDelegators } from "@/lib/services/delegation/delegation-service";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const rawIds = searchParams.get("delegatorIds")?.trim() ?? "";
    const delegatorIds = rawIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const delegations = await findActiveDelegationsForDelegators(delegatorIds);

    return NextResponse.json({ delegations });
  } catch (error) {
    console.error("GET /api/delegations/active", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des délégations" },
      { status: 500 },
    );
  }
}
