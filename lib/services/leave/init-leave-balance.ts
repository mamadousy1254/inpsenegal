import type { ContractType } from "@/lib/permissions/roles";
import { connectDB } from "@/lib/mongo/db";
import LeaveBalanceModel, {
  type IMonthlyBalance,
} from "@/lib/mongo/models/leave-balance.model";
import UserModel from "@/lib/mongo/models/user.model";
import {
  resolveContractPeriod,
  type ContractPeriod,
} from "@/lib/services/leave/contract-period";
import { buildInitialMonthlyBalances } from "@/lib/services/leave/monthly-accrual";
import { resolveUserContractYear } from "@/lib/services/users/prepare-contract-fields";

export type EnsureLeaveBalanceResult =
  | { ok: true }
  | { ok: false; missingFields: string[] };

function sameCalendarDay(a: Date, b: Date): boolean {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

function contractNeedsRefresh(
  active: {
    contractYear: number;
    contractType: ContractType;
    startDate: Date;
    endDate?: Date;
    monthlyBalances: IMonthlyBalance[];
  },
  period: ContractPeriod,
  contractType: ContractType,
): boolean {
  if (active.monthlyBalances.length === 0) return true;

  const expectedAccrued = buildInitialMonthlyBalances(
    period.startDate,
    period.endDate,
  ).reduce((sum, month) => sum + month.accrued, 0);
  const currentAccrued = active.monthlyBalances.reduce(
    (sum, month) => sum + month.accrued,
    0,
  );
  if (expectedAccrued > 0 && currentAccrued === 0) return true;

  if (active.contractYear !== period.contractYear) return true;
  if (active.contractType !== contractType) return true;
  if (!sameCalendarDay(active.startDate, period.startDate)) return true;

  const activeEnd = active.endDate?.toISOString().slice(0, 10) ?? null;
  const periodEnd = period.endDate?.toISOString().slice(0, 10) ?? null;
  if (activeEnd !== periodEnd) return true;

  return false;
}

function mergeMonthlyBalances(
  previous: IMonthlyBalance[],
  fresh: IMonthlyBalance[],
): IMonthlyBalance[] {
  const consumedByKey = new Map(
    previous.map((month) => [`${month.year}-${month.month}`, month.consumed]),
  );

  return fresh.map((month) => ({
    ...month,
    consumed: consumedByKey.get(`${month.year}-${month.month}`) ?? 0,
  }));
}

export async function ensureLeaveBalanceForUser(
  userId: string,
): Promise<EnsureLeaveBalanceResult> {
  await connectDB();

  const user = await UserModel.findById(userId)
    .select("contractType hireDate contractYear")
    .lean();

  if (!user) {
    return { ok: false, missingFields: ["utilisateur introuvable"] };
  }

  const missingFields: string[] = [];
  if (!user.contractType) missingFields.push("type de contrat");
  if (!user.hireDate) missingFields.push("date d'embauche");

  if (missingFields.length > 0) {
    return { ok: false, missingFields };
  }

  let contractYear = user.contractYear;
  if (!contractYear) {
    contractYear = resolveUserContractYear({ hireDate: user.hireDate });
    await UserModel.findByIdAndUpdate(userId, { $set: { contractYear } });
  }

  const balance = await LeaveBalanceModel.findOne({ userId });
  const active = balance?.contracts?.find((c) => c.isActive);

  const period = resolveContractPeriod({
    contractType: user.contractType as ContractType,
    hireDate: user.hireDate,
    contractYear,
  });

  const monthlyBalances = buildInitialMonthlyBalances(
    period.startDate,
    period.endDate,
  );

  if (active) {
    if (!contractNeedsRefresh(active, period, user.contractType as ContractType)) {
      return { ok: true };
    }

    active.monthlyBalances = mergeMonthlyBalances(
      active.monthlyBalances,
      monthlyBalances,
    );
    active.contractYear = period.contractYear;
    active.contractType = user.contractType as ContractType;
    active.startDate = period.startDate;
    active.endDate = period.endDate ?? undefined;
    await balance!.save();
    return { ok: true };
  }

  await initLeaveBalanceForUser({
    userId,
    contractType: user.contractType as ContractType,
    hireDate: user.hireDate,
    contractYear,
  });

  return { ok: true };
}

export async function initLeaveBalanceForUser(input: {
  userId: string;
  contractType: ContractType;
  hireDate: Date;
  contractYear: number;
}) {
  await connectDB();

  const period = resolveContractPeriod({
    contractType: input.contractType,
    hireDate: input.hireDate,
    contractYear: input.contractYear,
  });

  const monthlyBalances = buildInitialMonthlyBalances(
    period.startDate,
    period.endDate,
  );

  await LeaveBalanceModel.findOneAndUpdate(
    { userId: input.userId },
    {
      $push: {
        contracts: {
          contractYear: period.contractYear,
          contractType: input.contractType,
          startDate: period.startDate,
          endDate: period.endDate ?? undefined,
          isActive: true,
          monthlyBalances,
        },
      },
    },
    { upsert: true, new: true },
  );
}

export async function syncLeaveBalanceOnContractUpdate(input: {
  userId: string;
  contractType: ContractType;
  hireDate: Date;
  contractYear: number;
}) {
  await connectDB();

  const existing = await LeaveBalanceModel.findOne({ userId: input.userId });
  const hasActive = existing?.contracts.some(
    (c) => c.isActive && c.contractYear === input.contractYear,
  );

  if (hasActive) return;

  await initLeaveBalanceForUser(input);
}
