import type { ActionType } from "@/lib/constants/action-types";

export type ActivityHistoryEntry = {
  _id: string;
  actorId: string;
  actorEmail: string;
  actorFirstname: string;
  actorLastname: string;
  action: string;
  actionType: ActionType;
  resource: string;
  resourceId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: string;
};

export type LoginHistoryEntry = {
  _id: string;
  userId?: string;
  email: string;
  success: boolean;
  failureReason?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
};

export type AuditStats = {
  totalActivities: number;
  activitiesToday: number;
  totalLogins: number;
  successfulLoginsToday: number;
  failedLoginsToday: number;
  successfulLogins: number;
  failedLogins: number;
};

export type ActivityTrendPoint = {
  date: string;
  label: string;
  count: number;
};

export type LoginTrendPoint = {
  date: string;
  label: string;
  success: number;
  failed: number;
};

export type ActionBreakdownPoint = {
  type: string;
  label: string;
  count: number;
  color: string;
};

export type AuditCharts = {
  activityTrend: ActivityTrendPoint[];
  loginTrend: LoginTrendPoint[];
  actionBreakdown: ActionBreakdownPoint[];
};

export type AuditStatsResponse = {
  stats: AuditStats;
  charts: AuditCharts;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
