import type { AbsenceType, ValidationStatus } from "@/lib/constants/leave";
import type { ValidatorRole } from "@/lib/permissions/roles";

export type AbsenceValidationEntry = {
  validatorUserId: string;
  level: number;
  role: ValidatorRole;
  email: string;
  fullname: string;
  phone?: string;
  isValidated: boolean;
  isRejected: boolean;
  comment?: string;
  validatedAt?: string;
  actedByUserId?: string;
  actedByFullname?: string;
  onBehalfOfUserId?: string;
  delegationId?: string;
  activeDelegation?: {
    delegateUserId: string;
    delegateFullname: string;
    startAt: string;
    endAt: string;
    reason?: string;
  };
};

export type AbsenceJustificatifEntry = {
  url: string;
  cloudinaryId: string;
  filename: string;
  format: string;
  resourceType: string;
  bytes: number;
  /** Liens signés (côté client uniquement), expirent. */
  signedUrl?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
};

export type AbsenceRequestEntry = {
  _id: string;
  requesterId: string;
  requesterEmail?: string;
  firstname: string;
  lastname: string;
  phone?: string;
  occupation: string;
  absenceType: AbsenceType;
  dateDepart: string;
  dateFin: string;
  dateSoumission: string;
  raison: string;
  duree: number;
  contractYear?: number;
  validations: AbsenceValidationEntry[];
  statutValidation: ValidationStatus;
  requiredValidatorsCount: number;
  createdAt?: string;
  justificatif?: AbsenceJustificatifEntry;
};

export type LeaveBalanceSummary = {
  accrued: number;
  consumed: number;
  available: number;
  contractYear?: number;
  contractType?: string;
  debtDays?: number;
};

export type MonthlyLeaveBreakdown = {
  year: number;
  month: number;
  label: string;
  accrued: number;
  consumed: number;
  available: number;
};

export type UserLeaveStats = {
  totalRequests: number;
  approved: number;
  pending: number;
  rejected: number;
  daysDeductedFromBalance: number;
  daysMedicalOrExempt: number;
  daysApprovedTotal: number;
};

export type UserLeaveSummary = {
  balance: LeaveBalanceSummary;
  monthlyBreakdown: MonthlyLeaveBreakdown[];
  stats: UserLeaveStats;
  absences: AbsenceRequestEntry[];
};
