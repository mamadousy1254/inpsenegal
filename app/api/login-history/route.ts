import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import LoginHistoryModel from "@/lib/mongo/models/login-history.model";
import { canManageUsers } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type { LoginHistoryEntry } from "@/lib/types/audit";

function serializeLogin(doc: Record<string, unknown>): LoginHistoryEntry {
  return {
    _id: String(doc._id),
    userId: doc.userId ? String(doc.userId) : undefined,
    email: String(doc.email),
    success: Boolean(doc.success),
    failureReason: doc.failureReason ? String(doc.failureReason) : undefined,
    ip: doc.ip ? String(doc.ip) : undefined,
    userAgent: doc.userAgent ? String(doc.userAgent) : undefined,
    createdAt: new Date(doc.createdAt as string).toISOString(),
  };
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") ?? 20)),
    );
    const search = searchParams.get("search")?.trim() ?? "";
    const successParam = searchParams.get("success");

    await connectDB();

    const filter: Record<string, unknown> = {};

    if (successParam === "true") {
      filter.success = true;
    } else if (successParam === "false") {
      filter.success = false;
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.email = regex;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LoginHistoryModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LoginHistoryModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      items: items.map((item) => serializeLogin(item as Record<string, unknown>)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("GET /api/login-history", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique des connexions" },
      { status: 500 },
    );
  }
}
