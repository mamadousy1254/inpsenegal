import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { canManageMaintenance } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import {
  getMaintenanceSettings,
  setMaintenanceMode,
} from "@/lib/services/site-settings/maintenance-mode";

const patchSchema = z.object({
  enabled: z.boolean(),
  message: z.string().trim().max(500).optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canManageMaintenance(role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const settings = await getMaintenanceSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/site-settings/maintenance", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du mode maintenance" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canManageMaintenance(role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 },
      );
    }

    const settings = await setMaintenanceMode({
      enabled: parsed.data.enabled,
      message: parsed.data.message,
      updatedById: session.user.id,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PATCH /api/site-settings/maintenance", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du mode maintenance" },
      { status: 500 },
    );
  }
}
