import AbsenceRequestModel from "@/lib/mongo/models/absence-request.model";
import LeaveBalanceModel from "@/lib/mongo/models/leave-balance.model";
import {
  shouldDeductLeaveBalance,
} from "@/lib/constants/leave";
import { serializeAbsenceRequest } from "@/lib/services/absence/serialize-absence";
import { getLeaveBalanceSummary } from "@/lib/services/leave/leave-balance-service";
import type { UserLeaveSummary } from "@/lib/types/absence";

function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

export async function getUserLeaveSummary(
  userId: string,
): Promise<UserLeaveSummary> {
  const [balanceSummary, leaveBalance, absences] = await Promise.all([
    getLeaveBalanceSummary(userId),
    LeaveBalanceModel.findOne({ userId }).lean(),
    AbsenceRequestModel.find({ requesterId: userId })
      .sort({ dateSoumission: -1 })
      .limit(50)
      .lean(),
  ]);

  const activeContract =
    leaveBalance?.contracts?.find((c) => c.isActive) ??
    leaveBalance?.contracts?.[leaveBalance.contracts.length - 1];

  const monthlyBreakdown =
    activeContract?.monthlyBalances
      .map((m) => ({
        year: m.year,
        month: m.month,
        label: formatMonthLabel(m.year, m.month),
        accrued: m.accrued,
        consumed: m.consumed,
        available: m.accrued - m.consumed,
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      }) ?? [];

  const serializedAbsences = absences.map((a) => serializeAbsenceRequest(a));

  const approved = serializedAbsences.filter(
    (a) => a.statutValidation === "approuvee",
  );
  const pending = serializedAbsences.filter((a) =>
    ["en_attente", "en_cours"].includes(a.statutValidation),
  );
  const rejected = serializedAbsences.filter(
    (a) => a.statutValidation === "rejetee",
  );

  const approvedDeducting = approved.filter((a) =>
    shouldDeductLeaveBalance(a.raison),
  );
  const approvedMedical = approved.filter(
    (a) => !shouldDeductLeaveBalance(a.raison),
  );

  const daysDeductedFromBalance = approvedDeducting.reduce(
    (sum, a) => sum + a.duree,
    0,
  );
  const daysMedical = approvedMedical.reduce((sum, a) => sum + a.duree, 0);

  const rawAvailable = balanceSummary.accrued - balanceSummary.consumed;
  const debtDays = Math.max(0, balanceSummary.consumed - balanceSummary.accrued);

  return {
    balance: {
      ...balanceSummary,
      available: rawAvailable,
      debtDays,
    },
    monthlyBreakdown,
    stats: {
      totalRequests: serializedAbsences.length,
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      daysDeductedFromBalance,
      daysMedicalOrExempt: daysMedical,
      daysApprovedTotal: approved.reduce((sum, a) => sum + a.duree, 0),
    },
    absences: serializedAbsences,
  };
}
