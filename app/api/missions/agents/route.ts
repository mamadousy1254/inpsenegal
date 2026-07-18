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
    const service = searchParams.get("service")?.trim() ?? "";
    const occupation = searchParams.get("occupation")?.trim() ?? "";

    await connectDB();

    const filter: Record<string, unknown> = {
      isActive: true,
      role: { $ne: "partenaire" },
    };

    if (service) {
      filter.service = new RegExp(
        `^${service.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      );
    }

    if (occupation) {
      filter.occupation = new RegExp(
        `^${occupation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      );
    }

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
        { service: regex },
      ];
    }

    const [users, servicesRaw, occupationsRaw] = await Promise.all([
      UserModel.find(filter)
        .select("firstname lastname email phone occupation service")
        .sort({ lastname: 1, firstname: 1 })
        .limit(80)
        .lean(),
      UserModel.distinct("service", {
        isActive: true,
        role: { $ne: "partenaire" },
        service: { $nin: [null, ""] },
      }),
      UserModel.distinct("occupation", {
        isActive: true,
        role: { $ne: "partenaire" },
        occupation: { $nin: [null, ""] },
      }),
    ]);

    const services = (servicesRaw as string[])
      .map((s) => s.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "fr"));

    const occupations = (occupationsRaw as string[])
      .map((s) => s.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "fr"));

    return NextResponse.json({
      users: users.map((user) => ({
        _id: String(user._id),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone ?? undefined,
        occupation: user.occupation,
        service: user.service ?? undefined,
      })),
      services,
      occupations,
    });
  } catch (error) {
    console.error("GET /api/missions/agents", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche des agents" },
      { status: 500 },
    );
  }
}
