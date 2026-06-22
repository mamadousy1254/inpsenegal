import type { AbsenceRequestEntry, LeaveBalanceSummary } from "@/lib/types/absence";
import type { ValidatorDelegationEntry } from "@/lib/types/delegation";
import type { ValidatorAssignment } from "@/lib/types/validator-assignment";
import type { UserRole } from "@/lib/permissions/roles";

export type MySpaceProfile = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  avatar?: string;
  matricule?: string;
  occupation: string;
  service?: string;
  direction?: string;
  section: string;
  role: UserRole;
  contractType?: string;
  contractYear?: number;
  hireDate?: string;
  grade?: string;
  city?: string;
  lastLoginAt?: string;
};

export type MySpaceData = {
  profile: MySpaceProfile;
  leaveBalance: LeaveBalanceSummary;
  validators: ValidatorAssignment[];
  delegations: {
    given: ValidatorDelegationEntry[];
    received: ValidatorDelegationEntry[];
    actingForDelegatorIds: string[];
  };
  counts: {
    toValidate: number;
    myPendingAbsences: number;
    activeDelegationsGiven: number;
    activeDelegationsReceived: number;
  };
  toValidate: AbsenceRequestEntry[];
  recentAbsences: AbsenceRequestEntry[];
};
