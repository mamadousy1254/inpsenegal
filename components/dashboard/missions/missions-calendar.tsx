"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  MapPinIcon,
} from "lucide-react";

import { MissionStatusBadge } from "@/components/dashboard/missions/mission-status-badge";
import { MissionTypeBadge } from "@/components/dashboard/missions/mission-type-badge";
import type { MissionsFiltersState } from "@/components/dashboard/missions/missions-filters";
import { Button } from "@/components/ui/button";
import {
  MISSION_TYPE_COLORS,
  MISSION_TYPE_LABELS,
  MISSION_TYPES,
  type MissionType,
} from "@/lib/constants/mission";
import type { SerializedMissionCalendarItem } from "@/lib/services/mission/serialize-mission-calendar";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MAX_VISIBLE_MISSIONS = 3;

type MissionsCalendarProps = {
  scope: "mine" | "all";
  filters: MissionsFiltersState;
  onMissionClick?: (mission: SerializedMissionCalendarItem) => void;
};

function missionCoversDay(mission: SerializedMissionCalendarItem, day: Date) {
  const start = startOfDay(parseISO(mission.dateDepart));
  const end = startOfDay(parseISO(mission.dateRetour));
  const current = startOfDay(day);
  return current >= start && current <= end;
}

function formatDayRange(mission: SerializedMissionCalendarItem) {
  const start = format(parseISO(mission.dateDepart), "d MMM yyyy", { locale: fr });
  const end = format(parseISO(mission.dateRetour), "d MMM yyyy", { locale: fr });
  return `${start} → ${end}`;
}

export function MissionsCalendar({
  scope,
  filters,
  onMissionClick,
}: MissionsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date>(() => startOfDay(new Date()));
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedMissionCalendarItem[]>([]);

  const monthKey = format(currentMonth, "yyyy-MM");

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        month: monthKey,
        scope,
      });
      if (filters.search.trim()) params.set("search", filters.search.trim());
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.type !== "all") params.set("type", filters.type);
      if (filters.region.trim()) params.set("region", filters.region.trim());
      if (filters.direction.trim()) params.set("direction", filters.direction.trim());

      const res = await fetch(`/api/missions/calendar?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [monthKey, scope, filters]);

  useEffect(() => {
    void fetchCalendar();
  }, [fetchCalendar]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  const missionsByDay = useMemo(() => {
    const map = new Map<string, SerializedMissionCalendarItem[]>();
    for (const day of calendarDays) {
      const key = format(day, "yyyy-MM-dd");
      map.set(
        key,
        items.filter((mission) => missionCoversDay(mission, day)),
      );
    }
    return map;
  }, [calendarDays, items]);

  const selectedDayMissions = useMemo(() => {
    const key = format(selectedDay, "yyyy-MM-dd");
    return missionsByDay.get(key) ?? [];
  }, [missionsByDay, selectedDay]);

  const monthMissionCount = items.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
            aria-label="Mois précédent"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <h2 className="min-w-0 flex-1 basis-full text-center text-lg font-semibold capitalize sm:basis-auto sm:min-w-[180px]">
            {format(currentMonth, "MMMM yyyy", { locale: fr })}
          </h2>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            aria-label="Mois suivant"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const today = startOfDay(new Date());
              setCurrentMonth(startOfMonth(today));
              setSelectedDay(today);
            }}
          >
            Aujourd&apos;hui
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2Icon className="size-4 animate-spin" />
              Chargement…
            </span>
          ) : (
            <>
              <strong className="text-foreground">{monthMissionCount}</strong> mission
              {monthMissionCount > 1 ? "s" : ""} ce mois
            </>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-border/50 bg-muted/15 px-4 py-3">
        {MISSION_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("size-2.5 rounded-full", MISSION_TYPE_COLORS[type])} />
            {MISSION_TYPE_LABELS[type]}
          </div>
        ))}
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="grid grid-cols-7 border-b border-border/60 bg-muted/25">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const dayMissions = missionsByDay.get(dayKey) ?? [];
              const inMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDay);
              const visible = dayMissions.slice(0, MAX_VISIBLE_MISSIONS);
              const hiddenCount = dayMissions.length - visible.length;

              return (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "min-h-[108px] border-r border-b border-border/40 p-1.5 text-left transition-colors last:border-r-0",
                    !inMonth && "bg-muted/10",
                    isSelected && "bg-[var(--inp-vert)]/5 ring-1 ring-inset ring-[var(--inp-vert)]/25",
                    inMonth && !isSelected && "hover:bg-muted/20",
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium",
                        isToday(day) &&
                          "bg-[var(--inp-vert)] text-white",
                        !isToday(day) && !inMonth && "text-muted-foreground/60",
                        !isToday(day) && inMonth && "text-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayMissions.length > 0 && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {dayMissions.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {visible.map((mission) => (
                      <div
                        key={`${dayKey}-${mission._id}`}
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          onMissionClick?.(mission);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            onMissionClick?.(mission);
                          }
                        }}
                        className={cn(
                          "block w-full truncate rounded px-1.5 py-0.5 text-left text-[10px] font-medium text-white",
                          MISSION_TYPE_COLORS[mission.type as MissionType],
                          mission.status === "annulee" && "opacity-50 line-through",
                          mission.status === "brouillon" && "opacity-80",
                        )}
                        title={`${mission.numero} — ${mission.objet}`}
                      >
                        {mission.numero}
                      </div>
                    ))}
                    {hiddenCount > 0 && (
                      <p className="px-1 text-[10px] font-medium text-muted-foreground">
                        +{hiddenCount} autre{hiddenCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="border-b border-border/60 pb-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Journée sélectionnée
            </p>
            <h3 className="mt-1 text-lg font-semibold capitalize">
              {format(selectedDay, "EEEE d MMMM yyyy", { locale: fr })}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedDayMissions.length} mission
              {selectedDayMissions.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2Icon className="size-5 animate-spin" />
              </div>
            ) : selectedDayMissions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune mission prévue ce jour.
              </p>
            ) : (
              selectedDayMissions.map((mission) => (
                <button
                  key={mission._id}
                  type="button"
                  onClick={() => onMissionClick?.(mission)}
                  className="w-full rounded-xl border border-border/70 bg-muted/15 p-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[var(--inp-vert)]">
                      {mission.numero}
                    </span>
                    <MissionTypeBadge type={mission.type} />
                    <MissionStatusBadge status={mission.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium">{mission.objet}</p>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPinIcon className="mt-0.5 size-3.5 shrink-0" />
                    {mission.destinationLabel}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDayRange(mission)} · Chef : {mission.chefFullname}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
