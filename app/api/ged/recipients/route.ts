import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";

    await connectDB();

    const filter: Record<string, unknown> = {
      isActive: true,
      role: { $ne: "partenaire" },
      _id: { $ne: session.user.id },
    };

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
      filter.$or = [
        { firstname: regex },
        { lastname: regex },
        { email: regex },
        { occupation: regex },
      ];
    }

    const users = await UserModel.find(filter)
      .select("firstname lastname email phone occupation")
      .sort({ lastname: 1, firstname: 1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      users: users.map((user) => ({
        _id: String(user._id),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone ?? undefined,
        occupation: user.occupation,
      })),
    });
  } catch (error) {
    console.error("GET /api/ged/recipients", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche des destinataires" },
      { status: 500 },
    );
  }
}
