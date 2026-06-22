import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ACTION_TYPE_LABELS, type ActionType } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import ActivityHistoryModel from "@/lib/mongo/models/activity-history.model";
import LoginHistoryModel from "@/lib/mongo/models/login-history.model";
import { canManageUsers } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type { ActionBreakdownPoint } from "@/lib/types/audit";
import {
  formatDayLabel,
  getLastNDays,
  toDayKey,
} from "@/lib/utils/audit-charts";
import { startOfToday } from "@/lib/utils/format-datetime";

const ACTION_TYPE_COLORS: Record<ActionType, string> = {
  create: "#10b981",
  update: "#0ea5e9",
  delete: "#f43f5e",
  read: "#64748b",
  login: "#14b8a6",
  logout: "#f59e0b",
  export: "#8b5cf6",
  validate: "#22c55e",
  reject: "#f97316",
  share: "#6366f1",
  other: "#94a3b8",
};

const CHART_DAYS = 7;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await connectDB();

    const today = startOfToday();
    const chartDays = getLastNDays(CHART_DAYS);
    const chartStart = chartDays[0];

    const [
      totalActivities,
      activitiesToday,
      totalLogins,
      successfulLogins,
      failedLogins,
      successfulLoginsToday,
      failedLoginsToday,
      activityByDay,
      loginByDay,
      actionByType,
    ] = await Promise.all([
      ActivityHistoryModel.countDocuments(),
      ActivityHistoryModel.countDocuments({ createdAt: { $gte: today } }),
      LoginHistoryModel.countDocuments(),
      LoginHistoryModel.countDocuments({ success: true }),
      LoginHistoryModel.countDocuments({ success: false }),
      LoginHistoryModel.countDocuments({
        success: true,
        createdAt: { $gte: today },
      }),
      LoginHistoryModel.countDocuments({
        success: false,
        createdAt: { $gte: today },
      }),
      ActivityHistoryModel.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: chartStart } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]),
      LoginHistoryModel.aggregate<{
        _id: { day: string; success: boolean };
        count: number;
      }>([
        { $match: { createdAt: { $gte: chartStart } } },
        {
          $group: {
            _id: {
              day: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              success: "$success",
            },
            count: { $sum: 1 },
          },
        },
      ]),
      ActivityHistoryModel.aggregate<{ _id: ActionType; count: number }>([
        { $group: { _id: "$actionType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const activityMap = new Map(
      activityByDay.map((row) => [row._id, row.count]),
    );

    const loginMap = new Map<string, { success: number; failed: number }>();
    for (const row of loginByDay) {
      const key = row._id.day;
      const current = loginMap.get(key) ?? { success: 0, failed: 0 };
      if (row._id.success) current.success = row.count;
      else current.failed = row.count;
      loginMap.set(key, current);
    }

    const activityTrend = chartDays.map((day) => {
      const key = toDayKey(day);
      return {
        date: key,
        label: formatDayLabel(day),
        count: activityMap.get(key) ?? 0,
      };
    });

    const loginTrend = chartDays.map((day) => {
      const key = toDayKey(day);
      const counts = loginMap.get(key) ?? { success: 0, failed: 0 };
      return {
        date: key,
        label: formatDayLabel(day),
        success: counts.success,
        failed: counts.failed,
      };
    });

    const actionBreakdown: ActionBreakdownPoint[] = actionByType.map((row) => ({
      type: row._id,
      label: ACTION_TYPE_LABELS[row._id] ?? row._id,
      count: row.count,
      color: ACTION_TYPE_COLORS[row._id] ?? "#94a3b8",
    }));

    return NextResponse.json({
      stats: {
        totalActivities,
        activitiesToday,
        totalLogins,
        successfulLogins,
        failedLogins,
        successfulLoginsToday,
        failedLoginsToday,
      },
      charts: {
        activityTrend,
        loginTrend,
        actionBreakdown,
      },
    });
  } catch (error) {
    console.error("GET /api/audit/stats", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 },
    );
  }
}
