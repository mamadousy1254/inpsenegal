import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ACTION_TYPES } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import ActivityHistoryModel from "@/lib/mongo/models/activity-history.model";
import { canManageUsers } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type { ActivityHistoryEntry } from "@/lib/types/audit";

function serializeActivity(doc: Record<string, unknown>): ActivityHistoryEntry {
  return {
    _id: String(doc._id),
    actorId: String(doc.actorId),
    actorEmail: String(doc.actorEmail),
    actorFirstname: String(doc.actorFirstname),
    actorLastname: String(doc.actorLastname),
    action: String(doc.action),
    actionType: doc.actionType as ActivityHistoryEntry["actionType"],
    resource: String(doc.resource),
    resourceId: doc.resourceId ? String(doc.resourceId) : undefined,
    description: doc.description ? String(doc.description) : undefined,
    metadata: doc.metadata as Record<string, unknown> | undefined,
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
    const actionType = searchParams.get("actionType")?.trim() ?? "";
    const action = searchParams.get("action")?.trim() ?? "";

    await connectDB();

    const filter: Record<string, unknown> = {};

    if (actionType && ACTION_TYPES.includes(actionType as (typeof ACTION_TYPES)[number])) {
      filter.actionType = actionType;
    }

    if (action) {
      filter.action = action;
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { actorEmail: regex },
        { actorFirstname: regex },
        { actorLastname: regex },
        { description: regex },
        { action: regex },
        { resource: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ActivityHistoryModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityHistoryModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      items: items.map((item) => serializeActivity(item as Record<string, unknown>)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("GET /api/activity-history", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique des actions" },
      { status: 500 },
    );
  }
}
