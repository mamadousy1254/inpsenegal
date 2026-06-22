"use client";

import { Badge } from "@/components/ui/badge";
import type { DashboardStats } from "@/lib/types/dashboard-stats";
import { cn } from "@/lib/utils";
import {
  CalendarClockIcon,
  CalendarIcon,
  DatabaseIcon,
  MinusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

type SectionCardsProps = {
  stats: DashboardStats["cards"];
};

function TrendBadge({
  direction,
  value,
}: {
  direction: "up" | "down" | "neutral";
  value: number;
}) {
  if (direction === "neutral" || value === 0) {
    return (
      <Badge variant="outline" className="border-border/70 bg-background/70">
        <MinusIcon className="size-3" />
        Stable
      </Badge>
    );
  }

  const Icon = direction === "up" ? TrendingUpIcon : TrendingDownIcon;
  const trendClass =
    direction === "up"
      ? "border-emerald-200/80 bg-emerald-50 text-emerald-700"
      : "border-rose-200/80 bg-rose-50 text-rose-700";

  return (
    <Badge variant="outline" className={cn("font-medium", trendClass)}>
      <Icon className="size-3" />
      {direction === "up" ? "+" : "-"}
      {value}%
    </Badge>
  );
}

type CardConfig = {
  key: keyof DashboardStats["cards"];
  icon: React.ReactNode;
  iconClass: string;
  gradientClass: string;
  glowClass: string;
  borderClass: string;
  accentDot: string;
  stat: DashboardStats["cards"][keyof DashboardStats["cards"]];
};

export function SectionCards({ stats }: SectionCardsProps) {
  const cards: CardConfig[] = [
    {
      key: "activeUsers",
      icon: <UsersIcon className="size-5" />,
      iconClass:
        "bg-[var(--inp-vert)]/12 text-[var(--inp-vert)] ring-[var(--inp-vert)]/20",
      gradientClass:
        "bg-gradient-to-br from-emerald-200/70 via-[var(--inp-vert)]/[0.08] to-white dark:from-emerald-950/40 dark:via-[var(--inp-vert)]/10 dark:to-card",
      glowClass: "bg-emerald-400",
      borderClass: "border-emerald-200/60 dark:border-emerald-900/40",
      accentDot: "bg-[var(--inp-vert)]",
      stat: stats.activeUsers,
    },
    {
      key: "pendingAbsences",
      icon: <CalendarIcon className="size-5" />,
      iconClass: "bg-amber-500/12 text-amber-700 ring-amber-500/25",
      gradientClass:
        "bg-gradient-to-tr from-amber-300/55 via-orange-100/40 to-white dark:from-amber-950/35 dark:via-orange-950/20 dark:to-card",
      glowClass: "bg-amber-400",
      borderClass: "border-amber-300/60 dark:border-amber-900/40",
      accentDot: "bg-amber-500",
      stat: stats.pendingAbsences,
    },
    {
      key: "upcomingConvocations",
      icon: <CalendarClockIcon className="size-5" />,
      iconClass: "bg-sky-500/12 text-sky-700 ring-sky-500/25",
      gradientClass:
        "bg-gradient-to-bl from-sky-300/60 via-indigo-100/35 to-white dark:from-sky-950/35 dark:via-indigo-950/20 dark:to-card",
      glowClass: "bg-sky-400",
      borderClass: "border-sky-300/60 dark:border-sky-900/40",
      accentDot: "bg-sky-500",
      stat: stats.upcomingConvocations,
    },
    {
      key: "gedDocuments",
      icon: <DatabaseIcon className="size-5" />,
      iconClass:
        "bg-[var(--inp-marron)]/12 text-[var(--inp-marron)] ring-[var(--inp-marron)]/25",
      gradientClass:
        "bg-gradient-to-tl from-[var(--inp-beige)]/80 via-stone-200/30 to-white dark:from-[var(--inp-marron)]/25 dark:via-stone-900/20 dark:to-card",
      glowClass: "bg-[var(--inp-marron)]",
      borderClass: "border-[var(--inp-beige)] dark:border-[var(--inp-marron)]/30",
      accentDot: "bg-[var(--inp-marron)]",
      stat: stats.gedDocuments,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map(({ key, icon, iconClass, gradientClass, glowClass, borderClass, accentDot, stat }, index) => (
        <div
          key={key}
          className={cn(
            "group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
            gradientClass,
            borderClass,
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute size-28 rounded-full opacity-[0.12] blur-3xl transition-opacity group-hover:opacity-[0.2]",
              glowClass,
              index === 0 && "-right-8 -top-8",
              index === 1 && "-left-6 -top-6",
              index === 2 && "-right-6 -bottom-8",
              index === 3 && "-left-8 -bottom-6",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute size-16 rounded-full opacity-[0.08] blur-2xl",
              accentDot,
              index === 0 && "bottom-4 left-4",
              index === 1 && "bottom-6 right-6",
              index === 2 && "left-6 top-6",
              index === 3 && "right-4 top-8",
            )}
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {stat.value.toLocaleString("fr-FR")}
              </p>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {stat.footer}
              </p>
            </div>

            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset shadow-sm",
                iconClass,
              )}
            >
              {icon}
            </div>
          </div>

          <div className="relative mt-4 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
            <span className="text-[11px] text-muted-foreground">
              {stat.trendLabel}
            </span>
            <TrendBadge
              direction={stat.trendDirection}
              value={stat.trendValue}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
