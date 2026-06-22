import LeaveBalanceModel from "@/lib/mongo/models/leave-balance.model";

/** Consomme des jours de congé (FIFO) sur le contrat actif. */
export async function consumeLeaveDays(
  userId: string,
  days: number,
): Promise<boolean> {
  const balance = await LeaveBalanceModel.findOne({ userId });
  if (!balance) return false;

  const contract = balance.contracts.find((c) => c.isActive);
  if (!contract) return false;

  let remaining = days;
  const sorted = [...contract.monthlyBalances].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  for (const month of sorted) {
    const available = month.accrued - month.consumed;
    if (available <= 0) continue;
    const take = Math.min(available, remaining);
    month.consumed += take;
    remaining -= take;
    if (remaining <= 0) break;
  }

  if (remaining > 0) return false;

  await balance.save();
  return true;
}

/** Consomme des jours de congé ; autorise un solde négatif (dette) si nécessaire. */
export async function consumeLeaveDaysWithDebt(
  userId: string,
  days: number,
): Promise<{ ok: boolean; debtDays: number }> {
  const balance = await LeaveBalanceModel.findOne({ userId });
  if (!balance) return { ok: false, debtDays: days };

  const contract = balance.contracts.find((c) => c.isActive);
  if (!contract?.monthlyBalances.length) {
    return { ok: false, debtDays: days };
  }

  let remaining = days;
  const sorted = [...contract.monthlyBalances].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  for (const month of sorted) {
    const available = month.accrued - month.consumed;
    if (available <= 0) continue;
    const take = Math.min(available, remaining);
    month.consumed += take;
    remaining -= take;
    if (remaining <= 0) break;
  }

  const debtDays = remaining;
  if (debtDays > 0) {
    sorted[sorted.length - 1].consumed += debtDays;
  }

  await balance.save();
  return { ok: true, debtDays };
}

export async function getLeaveBalanceSummary(userId: string) {
  const balance = await LeaveBalanceModel.findOne({ userId }).lean();
  if (!balance?.contracts?.length) {
    return { accrued: 0, consumed: 0, available: 0 };
  }

  const active =
    balance.contracts.find((c) => c.isActive) ??
    balance.contracts[balance.contracts.length - 1];

  const accrued = active.monthlyBalances.reduce((s, m) => s + m.accrued, 0);
  const consumed = active.monthlyBalances.reduce((s, m) => s + m.consumed, 0);

  return {
    accrued,
    consumed,
    available: Math.max(0, accrued - consumed),
    contractYear: active.contractYear,
    contractType: active.contractType,
  };
}
