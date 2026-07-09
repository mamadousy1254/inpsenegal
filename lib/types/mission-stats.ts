export type MissionChartBreakdown = {
  key: string;
  label: string;
  count: number;
  color: string;
};

export type MissionMonthlyPoint = {
  label: string;
  month: string;
  count: number;
  budgetPrevu: number;
  budgetConsomme: number;
};

export type MissionCharts = {
  byType: MissionChartBreakdown[];
  byStatus: MissionChartBreakdown[];
  byRegion: MissionChartBreakdown[];
  byDirection: MissionChartBreakdown[];
  monthlyTrend: MissionMonthlyPoint[];
};

export type MissionDashboardStats = {
  enCours: number;
  aVenir: number;
  terminees: number;
  annulees: number;
  enValidation: number;
  cetteSemaine: number;
  ceMois: number;
  agentsEnDeplacement: number;
  budgetConsomme: number;
  budgetRestant: number;
  internationales: number;
  nationales: number;
  rapportsManquants: number;
  charts: MissionCharts;
};
