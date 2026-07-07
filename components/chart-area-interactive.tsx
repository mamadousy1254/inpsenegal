"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardChartPoint } from "@/lib/types/dashboard-stats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

const chartConfig = {
  absences: {
    label: "Absences",
    color: "#7B4F2A",
  },
  convocations: {
    label: "Convocations",
    color: "#0ea5e9",
  },
  documents: {
    label: "Documents GED",
    color: "#D8C3A5",
  },
} satisfies ChartConfig;

type ChartAreaInteractiveProps = {
  data: DashboardChartPoint[];
};

function filterByRange(data: DashboardChartPoint[], timeRange: string) {
  const days =
    timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  return data.filter((item) => new Date(item.date) >= start);
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("7d");

  const filteredData = filterByRange(data, timeRange);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Activité de la plateforme</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Absences, convocations et documents ajoutés
          </span>
          <span className="@[540px]/card:hidden">Activité récente</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={timeRange ? [timeRange] : []}
            onValueChange={(value) => {
              setTimeRange(value[0] ?? "90d");
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">7 jours</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 jours</ToggleGroupItem>
            <ToggleGroupItem value="90d">3 mois</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) {
                setTimeRange(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Période"
            >
              <SelectValue placeholder="7 jours" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                7 jours
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 jours
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                3 mois
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAbsences" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7B4F2A" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#7B4F2A" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillConvocations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillDocuments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D8C3A5" stopOpacity={0.65} />
                <stop offset="95%" stopColor="#D8C3A5" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="absences"
              type="monotone"
              fill="url(#fillAbsences)"
              stroke="#7B4F2A"
              strokeWidth={2}
            />
            <Area
              dataKey="convocations"
              type="monotone"
              fill="url(#fillConvocations)"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
            <Area
              dataKey="documents"
              type="monotone"
              fill="url(#fillDocuments)"
              stroke="#8B5E3C"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
