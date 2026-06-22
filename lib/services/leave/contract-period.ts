import type { ContractType } from "@/lib/permissions/roles";

export type ContractPeriod = {
  contractYear: number;
  startDate: Date;
  endDate: Date | null;
};

export function isIndefiniteContract(contractType?: ContractType): boolean {
  return contractType === "cdi";
}

/** Détermine la période de contrat à partir du type, de l'embauche et de l'année. */
export function resolveContractPeriod(input: {
  contractType: ContractType;
  hireDate: Date;
  contractYear: number;
}): ContractPeriod {
  const { contractType, hireDate, contractYear } = input;
  const yearStart = new Date(contractYear, 0, 1);
  const yearEnd = new Date(contractYear, 11, 31, 23, 59, 59, 999);

  if (isIndefiniteContract(contractType)) {
    return {
      contractYear,
      startDate: hireDate,
      endDate: null,
    };
  }

  const startDate = hireDate > yearStart ? hireDate : yearStart;

  return {
    contractYear,
    startDate,
    endDate: yearEnd,
  };
}

/** Pour les CDD : fin de contrat = 31 déc. de l'année si non précisée. */
export function resolveEndDateForUser(input: {
  contractType?: ContractType;
  hireDate?: Date;
  contractYear?: number;
  endDate?: Date;
}): Date | undefined {
  if (input.endDate) return input.endDate;
  if (!input.contractType || !input.contractYear) return undefined;
  if (isIndefiniteContract(input.contractType)) return undefined;
  return new Date(input.contractYear, 11, 31, 23, 59, 59, 999);
}

export function getCurrentContractYear(): number {
  return new Date().getFullYear();
}
