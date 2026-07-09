"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3Icon,
  MapPinnedIcon,
  PieChartIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MissionCharts } from "@/lib/types/mission-stats";

const monthlyChartConfig = {
  count: {
    label: "Missions",
    color: "var(--inp-vert)",
  },
} satisfies ChartConfig;

const budgetChartConfig = {
  budgetPrevu: {
    label: "Budget prévu",
    color: "#0ea5e9",
  },
  budgetConsomme: {
    label: "Budget consommé",
    color: "var(--inp-vert)",
  },
} satisfies ChartConfig;

const regionChartConfig = {
  count: {
    label: "Missions",
    color: "var(--inp-vert)",
  },
} satisfies ChartConfig;

type MissionsChartsProps = {
  charts: MissionCharts | null;
  loading?: boolean;
  showDirectionChart?: boolean;
};

function ChartSkeleton() {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <div className="size-full animate-pulse rounded-xl bg-muted/60" />
    </div>
  );
}

function formatBudgetFcfa(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center">
      <PieChartIcon className="size-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function BreakdownPieCard({
  title,
  description,
  icon,
  iconClass,
  data,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  iconClass: string;
  data: MissionCharts["byType"];
}) {
  const pieData = data.filter((item) => item.count > 0);
  const pieConfig = pieData.reduce<ChartConfig>((acc, item) => {
    acc[item.key] = { label: item.label, color: item.color };
    return acc;
  }, {});

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex size-8 items-center justify-center rounded-lg ring-1 ${iconClass}`}
          >
            {icon}
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {pieData.length === 0 ? (
          <EmptyChartState message="Pas encore de données" />
        ) : (
          <div className="space-y-3">
            <ChartContainer config={pieConfig} className="mx-auto aspect-auto h-[180px] w-full min-w-0 max-w-[220px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="grid gap-1.5">
              {pieData.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MissionsCharts({
  charts,
  loading,
  showDirectionChart = false,
}: MissionsChartsProps) {
  if (loading || !charts) {
    return (
      <div className="min-w-0 space-y-4 overflow-hidden">
        <div className="grid min-w-0 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <ChartSkeleton />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <ChartSkeleton />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const regionData = charts.byRegion.filter((item) => item.count > 0);
  const directionData = charts.byDirection.filter((item) => item.count > 0);
  const hasMonthlyData = charts.monthlyTrend.some(
    (item) => item.count > 0 || item.budgetPrevu > 0 || item.budgetConsomme > 0,
  );

  return (
    <div className="min-w-0 space-y-4 overflow-hidden">
      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        <BreakdownPieCard
          title="Missions par type"
          description="Répartition par nature de mission"
          icon={<PieChartIcon className="size-4" />}
          iconClass="bg-emerald-500/10 text-emerald-700 ring-emerald-500/20"
          data={charts.byType}
        />

        <BreakdownPieCard
          title="Missions par statut"
          description="État actuel du portefeuille"
          icon={<BarChart3Icon className="size-4" />}
          iconClass="bg-sky-500/10 text-sky-700 ring-sky-500/20"
          data={charts.byStatus}
        />

        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/20">
                <TrendingUpIcon className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Missions par mois
                </CardTitle>
                <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!hasMonthlyData ? (
              <EmptyChartState message="Pas encore de missions sur cette période" />
            ) : (
              <ChartContainer config={monthlyChartConfig} className="aspect-auto h-[220px] w-full min-w-0">
                <BarChart
                  data={charts.monthlyTrend}
                  margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/60"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--inp-vert)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700 ring-1 ring-teal-500/20">
                <WalletIcon className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Budget mensuel</CardTitle>
                <CardDescription>Prévu vs consommé (6 derniers mois)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!hasMonthlyData ? (
              <EmptyChartState message="Pas encore de budget enregistré" />
            ) : (
              <ChartContainer config={budgetChartConfig} className="aspect-auto h-[220px] w-full min-w-0">
                <BarChart
                  data={charts.monthlyTrend}
                  margin={{ top: 8, right: 4, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/60"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value: number) =>
                      value >= 1_000_000
                        ? `${(value / 1_000_000).toFixed(1)}M`
                        : value >= 1_000
                          ? `${Math.round(value / 1_000)}k`
                          : String(value)
                    }
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatBudgetFcfa(Number(value))}
                      />
                    }
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    dataKey="budgetPrevu"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  />
                  <Bar
                    dataKey="budgetConsomme"
                    fill="var(--inp-vert)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-800 ring-1 ring-amber-500/20">
                <MapPinnedIcon className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Top régions</CardTitle>
                <CardDescription>Zones de déplacement les plus fréquentes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {regionData.length === 0 ? (
              <EmptyChartState message="Aucune région renseignée" />
            ) : (
              <ChartContainer config={regionChartConfig} className="aspect-auto h-[220px] w-full min-w-0">
                <BarChart
                  layout="vertical"
                  data={regionData}
                  margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    className="stroke-border/60"
                  />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={88}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={18}>
                    {regionData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {showDirectionChart && directionData.length > 0 && (
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20">
                <BarChart3Icon className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Missions par direction
                </CardTitle>
                <CardDescription>Répartition organisationnelle</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={regionChartConfig} className="aspect-auto h-[240px] w-full min-w-0">
              <BarChart
                data={directionData}
                margin={{ top: 8, right: 4, left: -20, bottom: 48 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/60"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={56}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {directionData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
