export type DashboardTrendDirection = "up" | "down" | "neutral";

export interface DashboardCardStat {
  label: string;
  value: number;
  footer: string;
  trendLabel: string;
  trendValue: number;
  trendDirection: DashboardTrendDirection;
}

export interface DashboardChartPoint {
  date: string;
  absences: number;
  convocations: number;
  documents: number;
}

export interface DashboardStats {
  cards: {
    activeUsers: DashboardCardStat;
    pendingAbsences: DashboardCardStat;
    upcomingConvocations: DashboardCardStat;
    gedDocuments: DashboardCardStat;
  };
  chart: DashboardChartPoint[];
}
