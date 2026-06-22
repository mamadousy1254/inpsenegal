import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import { canManageLeaveSettings } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { ensureLeaveBalanceForUser } from "@/lib/services/leave/init-leave-balance";
import { getUserLeaveSummary } from "@/lib/services/leave/get-user-leave-summary";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canManageLeaveSettings(role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const user = await UserModel.findById(id)
      .select(
        "firstname lastname email occupation section contractType contractYear hireDate",
      )
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const setup = await ensureLeaveBalanceForUser(id);

    const refreshedUser = await UserModel.findById(id)
      .select(
        "firstname lastname email occupation section contractType contractYear hireDate",
      )
      .lean();

    const summary = await getUserLeaveSummary(id);

    return NextResponse.json({
      user: {
        _id: String(refreshedUser!._id),
        firstname: refreshedUser!.firstname,
        lastname: refreshedUser!.lastname,
        email: refreshedUser!.email,
        occupation: refreshedUser!.occupation,
        section: refreshedUser!.section,
        contractType: refreshedUser!.contractType,
        contractYear: refreshedUser!.contractYear,
        hireDate: refreshedUser!.hireDate
          ? new Date(refreshedUser!.hireDate).toISOString().slice(0, 10)
          : undefined,
      },
      summary,
      setup: setup.ok
        ? { ok: true as const }
        : { ok: false as const, missingFields: setup.missingFields },
    });
  } catch (error) {
    console.error("GET /api/users/[id]/leave-summary", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du solde" },
      { status: 500 },
    );
  }
}
