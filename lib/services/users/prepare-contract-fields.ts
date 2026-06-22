import type { ContractType } from "@/lib/permissions/roles";
import {
  getCurrentContractYear,
  resolveEndDateForUser,
} from "@/lib/services/leave/contract-period";

export function resolveUserContractYear(input: {
  contractYear?: number | string;
  hireDate?: Date | string;
}): number | undefined {
  if (
    input.contractYear !== undefined &&
    input.contractYear !== "" &&
    !Number.isNaN(Number(input.contractYear))
  ) {
    return Number(input.contractYear);
  }

  if (input.hireDate) {
    return new Date(input.hireDate).getFullYear();
  }

  return getCurrentContractYear();
}

export function prepareUserContractFields(input: {
  contractType?: ContractType;
  hireDate?: string | Date;
  contractYear?: number | string;
  endDate?: string | Date;
}) {
  const contractType = input.contractType;
  if (!contractType) {
    return {
      contractType: undefined,
      hireDate: input.hireDate ? new Date(input.hireDate) : undefined,
      contractYear: undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    };
  }

  const hireDate = input.hireDate ? new Date(input.hireDate) : undefined;
  const contractYear = resolveUserContractYear({
    contractYear: input.contractYear,
    hireDate,
  });

  const endDate = resolveEndDateForUser({
    contractType,
    hireDate,
    contractYear,
    endDate: input.endDate ? new Date(input.endDate) : undefined,
  });

  return { contractType, hireDate, contractYear, endDate };
}
