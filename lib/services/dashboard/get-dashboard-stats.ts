import AbsenceRequestModel from "@/lib/mongo/models/absence-request.model";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import GedFileModel from "@/lib/mongo/models/ged-file.model";
import UserModel from "@/lib/mongo/models/user.model";
import type {
  DashboardCardStat,
  DashboardStats,
  DashboardTrendDirection,
} from "@/lib/types/dashboard-stats";
import { getLastNDays, toDayKey } from "@/lib/utils/audit-charts";

const CHART_DAYS = 90;

function getMonthBounds(monthsAgo: number): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() - monthsAgo + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return { start, end };
}

function computeTrend(
  current: number,
  previous: number,
): { value: number; direction: DashboardTrendDirection } {
  if (previous === 0) {
    if (current === 0) return { value: 0, direction: "neutral" };
    return { value: 100, direction: "up" };
  }

  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(change) * 10) / 10;

  if (change > 0) return { value: rounded, direction: "up" };
  if (change < 0) return { value: rounded, direction: "down" };
  return { value: 0, direction: "neutral" };
}

function buildCardStat(
  label: string,
  value: number,
  footer: string,
  currentMonthCount: number,
  previousMonthCount: number,
  trendSuffix: string,
): DashboardCardStat {
  const trend = computeTrend(currentMonthCount, previousMonthCount);

  return {
    label,
    value,
    footer,
    trendLabel: trendSuffix,
    trendValue: trend.value,
    trendDirection: trend.direction,
  };
}

async function aggregateByDay(
  model: Pick<typeof AbsenceRequestModel, "aggregate">,
  dateField: "createdAt" | "updatedAt",
  since: Date,
): Promise<Map<string, number>> {
  const rows = await model.aggregate<{ _id: string; count: number }>([
    { $match: { [dateField]: { $gte: since } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  return new Map(rows.map((row) => [row._id, row.count]));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const currentMonth = getMonthBounds(0);
  const previousMonth = getMonthBounds(1);
  const chartDays = getLastNDays(CHART_DAYS);
  const chartStart = chartDays[0];

  const [
    activeUsers,
    inactiveUsers,
    pendingAbsences,
    approvedAbsencesThisMonth,
    upcomingConvocations,
    convocationsThisMonth,
    convocationsLastMonth,
    gedDocuments,
    gedThisMonth,
    gedLastMonth,
    usersThisMonth,
    usersLastMonth,
    pendingThisMonth,
    pendingLastMonth,
    absenceByDay,
    convocationByDay,
    documentByDay,
  ] = await Promise.all([
    UserModel.countDocuments({ isActive: true }),
    UserModel.countDocuments({ isActive: false }),
    AbsenceRequestModel.countDocuments({ statutValidation: "en_attente" }),
    AbsenceRequestModel.countDocuments({
      statutValidation: "validee",
      updatedAt: { $gte: currentMonth.start },
    }),
    ConvocationModel.countDocuments({
      status: "envoyee",
      meetingAt: { $gte: now },
    }),
    ConvocationModel.countDocuments({
      createdAt: { $gte: currentMonth.start, $lte: currentMonth.end },
    }),
    ConvocationModel.countDocuments({
      createdAt: { $gte: previousMonth.start, $lte: previousMonth.end },
    }),
    GedFileModel.countDocuments(),
    GedFileModel.countDocuments({
      createdAt: { $gte: currentMonth.start, $lte: currentMonth.end },
    }),
    GedFileModel.countDocuments({
      createdAt: { $gte: previousMonth.start, $lte: previousMonth.end },
    }),
    UserModel.countDocuments({
      createdAt: { $gte: currentMonth.start, $lte: currentMonth.end },
    }),
    UserModel.countDocuments({
      createdAt: { $gte: previousMonth.start, $lte: previousMonth.end },
    }),
    AbsenceRequestModel.countDocuments({
      statutValidation: "en_attente",
      createdAt: { $gte: currentMonth.start, $lte: currentMonth.end },
    }),
    AbsenceRequestModel.countDocuments({
      statutValidation: "en_attente",
      createdAt: { $gte: previousMonth.start, $lte: previousMonth.end },
    }),
    aggregateByDay(AbsenceRequestModel, "createdAt", chartStart),
    aggregateByDay(ConvocationModel, "createdAt", chartStart),
    aggregateByDay(GedFileModel, "createdAt", chartStart),
  ]);

  const chart = chartDays.map((day) => {
    const key = toDayKey(day);
    return {
      date: key,
      absences: absenceByDay.get(key) ?? 0,
      convocations: convocationByDay.get(key) ?? 0,
      documents: documentByDay.get(key) ?? 0,
    };
  });

  return {
    cards: {
      activeUsers: buildCardStat(
        "Agents actifs",
        activeUsers,
        `${inactiveUsers} agent${inactiveUsers > 1 ? "s" : ""} inactif${inactiveUsers > 1 ? "s" : ""}`,
        usersThisMonth,
        usersLastMonth,
        "vs mois précédent",
      ),
      pendingAbsences: buildCardStat(
        "Absences en attente",
        pendingAbsences,
        `${approvedAbsencesThisMonth} validée${approvedAbsencesThisMonth > 1 ? "s" : ""} ce mois`,
        pendingThisMonth,
        pendingLastMonth,
        "nouvelles demandes",
      ),
      upcomingConvocations: buildCardStat(
        "Convocations à venir",
        upcomingConvocations,
        `${convocationsThisMonth} créée${convocationsThisMonth > 1 ? "s" : ""} ce mois`,
        convocationsThisMonth,
        convocationsLastMonth,
        "vs mois précédent",
      ),
      gedDocuments: buildCardStat(
        "Documents GED",
        gedDocuments,
        `${gedThisMonth} ajouté${gedThisMonth > 1 ? "s" : ""} ce mois`,
        gedThisMonth,
        gedLastMonth,
        "vs mois précédent",
      ),
    },
    chart,
  };
}
