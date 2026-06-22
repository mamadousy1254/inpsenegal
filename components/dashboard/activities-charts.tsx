"use client";

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
  ActivityIcon,
  BarChart3Icon,
  LogInIcon,
  PieChartIcon,
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
import type { AuditCharts } from "@/lib/types/audit";

const activityChartConfig = {
  count: {
    label: "Actions",
    color: "var(--inp-vert)",
  },
} satisfies ChartConfig;

const loginChartConfig = {
  success: {
    label: "Connexions réussies",
    color: "#10b981",
  },
  failed: {
    label: "Tentatives refusées",
    color: "#f43f5e",
  },
} satisfies ChartConfig;

type ActivitiesChartsProps = {
  charts: AuditCharts | null;
  loading?: boolean;
};

function ChartSkeleton() {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <div className="size-full animate-pulse rounded-xl bg-muted/60" />
    </div>
  );
}

export function ActivitiesCharts({ charts, loading }: ActivitiesChartsProps) {
  if (loading || !charts) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
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
    );
  }

  const pieData = charts.actionBreakdown.filter((item) => item.count > 0);
  const pieConfig = pieData.reduce<ChartConfig>((acc, item) => {
    acc[item.type] = { label: item.label, color: item.color };
    return acc;
  }, {});

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20">
              <BarChart3Icon className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Actions cette semaine
              </CardTitle>
              <CardDescription>
                Nombre d&apos;événements par jour
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={activityChartConfig} className="h-[220px] w-full">
            <BarChart data={charts.activityTrend} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
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
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20">
              <LogInIcon className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Connexions cette semaine
              </CardTitle>
              <CardDescription>
                Réussies vs tentatives refusées
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={loginChartConfig} className="h-[220px] w-full">
            <BarChart data={charts.loginTrend} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/60" />
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
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="success" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="failed" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20">
              <PieChartIcon className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Types d&apos;actions
              </CardTitle>
              <CardDescription>Répartition globale</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pieData.length === 0 ? (
            <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-center">
              <ActivityIcon className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Pas encore de données</p>
            </div>
          ) : (
            <div className="space-y-3">
              <ChartContainer config={pieConfig} className="mx-auto h-[180px] w-full max-w-[220px]">
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
                      <Cell key={entry.type} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <ul className="grid gap-1.5">
                {pieData.map((item) => (
                  <li
                    key={item.type}
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
    </div>
  );
}
