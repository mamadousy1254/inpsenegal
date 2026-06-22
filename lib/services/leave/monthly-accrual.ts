import { LEAVE_DAYS_PER_MONTH } from "@/lib/constants/leave";

export type MonthKey = { year: number; month: number };

export function listActiveMonths(
  startDate: Date,
  endDate: Date | null,
  upTo: Date = new Date(),
): MonthKey[] {
  const months: MonthKey[] = [];
  const end = endDate && endDate < upTo ? endDate : upTo;

  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cursor <= last) {
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() + 1 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
}

export function buildInitialMonthlyBalances(
  startDate: Date,
  endDate: Date | null,
): Array<{ year: number; month: number; accrued: number; consumed: number }> {
  return listActiveMonths(startDate, endDate).map(({ year, month }) => ({
    year,
    month,
    accrued: LEAVE_DAYS_PER_MONTH,
    consumed: 0,
  }));
}

export function sumLeaveBalance(
  monthlyBalances: Array<{ accrued: number; consumed: number }>,
): { accrued: number; consumed: number; available: number } {
  const accrued = monthlyBalances.reduce((s, m) => s + m.accrued, 0);
  const consumed = monthlyBalances.reduce((s, m) => s + m.consumed, 0);
  return { accrued, consumed, available: Math.max(0, accrued - consumed) };
}
