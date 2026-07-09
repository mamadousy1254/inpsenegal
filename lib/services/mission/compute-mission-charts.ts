import { format } from "date-fns";
import { fr } from "date-fns/locale";

import {
  MISSION_STATUS_CHART_COLORS,
  MISSION_STATUS_LABELS,
  MISSION_TYPE_CHART_COLORS,
  MISSION_TYPE_LABELS,
} from "@/lib/constants/mission";
import MissionModel from "@/lib/mongo/models/mission.model";
import type {
  MissionChartBreakdown,
  MissionCharts,
  MissionMonthlyPoint,
} from "@/lib/types/mission-stats";

const REGION_CHART_COLORS = [
  "#10b981",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#f43f5e",
  "#14b8a6",
  "#6366f1",
  "#ec4899",
];

type CountAggRow = { _id: string; count: number };

type MonthlyAggRow = {
  _id: { year: number; month: number };
  count: number;
  budgetPrevu: number;
  budgetConsomme: number;
};

function buildLastMonths(count: number) {
  const now = new Date();
  const months: { year: number; month: number; label: string; monthKey: string }[] =
    [];

  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: format(date, "MMM yy", { locale: fr }),
      monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    });
  }

  return months;
}

function mapBreakdown(
  rows: CountAggRow[],
  labels: Record<string, string>,
  colors: Record<string, string>,
  fallbackColor = "#94a3b8",
): MissionChartBreakdown[] {
  return rows
    .filter((row) => row._id)
    .map((row, index) => ({
      key: row._id,
      label: labels[row._id] ?? row._id,
      count: row.count,
      color: colors[row._id] ?? REGION_CHART_COLORS[index % REGION_CHART_COLORS.length] ?? fallbackColor,
    }))
    .sort((a, b) => b.count - a.count);
}

function mapMonthlyTrend(rows: MonthlyAggRow[]): MissionMonthlyPoint[] {
  const byKey = new Map(
    rows.map((row) => [
      `${row._id.year}-${String(row._id.month).padStart(2, "0")}`,
      row,
    ]),
  );

  return buildLastMonths(6).map((month) => {
    const row = byKey.get(month.monthKey);
    return {
      label: month.label,
      month: month.monthKey,
      count: row?.count ?? 0,
      budgetPrevu: Math.round(row?.budgetPrevu ?? 0),
      budgetConsomme: Math.round(row?.budgetConsomme ?? 0),
    };
  });
}

export async function computeMissionCharts(
  baseFilter: Record<string, unknown>,
): Promise<MissionCharts> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [byTypeRows, byStatusRows, byRegionRows, byDirectionRows, monthlyRows] =
    await Promise.all([
      MissionModel.aggregate<CountAggRow>([
        { $match: baseFilter },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      MissionModel.aggregate<CountAggRow>([
        { $match: baseFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      MissionModel.aggregate<CountAggRow>([
        {
          $match: {
            ...baseFilter,
            region: { $exists: true, $nin: [null, ""] },
          },
        },
        { $group: { _id: "$region", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      MissionModel.aggregate<CountAggRow>([
        {
          $match: {
            ...baseFilter,
            direction: { $exists: true, $nin: [null, ""] },
          },
        },
        { $group: { _id: "$direction", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      MissionModel.aggregate<MonthlyAggRow>([
        {
          $match: {
            ...baseFilter,
            dateDepart: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$dateDepart" },
              month: { $month: "$dateDepart" },
            },
            count: { $sum: 1 },
            budgetPrevu: { $sum: "$budget.budgetPrevu" },
            budgetConsomme: { $sum: "$budget.budgetConsomme" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

  return {
    byType: mapBreakdown(
      byTypeRows,
      MISSION_TYPE_LABELS,
      MISSION_TYPE_CHART_COLORS,
    ),
    byStatus: mapBreakdown(
      byStatusRows,
      MISSION_STATUS_LABELS,
      MISSION_STATUS_CHART_COLORS,
    ),
    byRegion: mapBreakdown(byRegionRows, {}, {}),
    byDirection: mapBreakdown(byDirectionRows, {}, {}),
    monthlyTrend: mapMonthlyTrend(monthlyRows),
  };
}
