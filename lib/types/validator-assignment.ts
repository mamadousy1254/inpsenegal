import type { ValidatorRole } from "@/lib/permissions/roles";

export type ValidatorUserSummary = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  occupation: string;
  role: string;
};

export type ValidatorAssignment = {
  userId: string;
  level: number;
  role: ValidatorRole;
  user?: ValidatorUserSummary;
  activeDelegation?: {
    _id: string;
    delegatorUserId: string;
    delegatorFullname: string;
    delegateUserId: string;
    delegateFullname: string;
    startAt: string;
    endAt: string;
    reason?: string;
  };
};

export type ValidatorFormRow = {
  key: string;
  userId: string;
  level: number;
  role: ValidatorRole;
};
