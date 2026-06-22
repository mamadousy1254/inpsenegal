import type { DelegationScope, DelegationStatus } from "@/lib/constants/delegation";

export type ValidatorDelegationEntry = {
  _id: string;
  delegatorUserId: string;
  delegatorFullname: string;
  delegateUserId: string;
  delegateFullname: string;
  scope: DelegationScope;
  startAt: string;
  endAt: string;
  status: DelegationStatus;
  reason?: string;
  createdAt?: string;
};

export type DelegationCandidate = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  occupation: string;
  role: string;
};

export type DelegationListResponse = {
  given: ValidatorDelegationEntry[];
  received: ValidatorDelegationEntry[];
  candidates: DelegationCandidate[];
  actingForDelegatorIds: string[];
  canManageForOthers?: boolean;
};
