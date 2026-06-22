import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import type { UserRole } from "@/lib/permissions/roles";
import { getMySpaceData } from "@/lib/services/user/get-my-space-data";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await getMySpaceData(
      session.user.id,
      session.user.role as UserRole,
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/users/me/space", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement de votre espace",
      },
      { status: 500 },
    );
  }
}
