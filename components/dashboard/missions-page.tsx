"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { useCurrentDbUser } from "@/components/providers/current-user-provider";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  GlobeIcon,
  ListIcon,
  Loader2Icon,
  MapPinnedIcon,
  PlaneIcon,
  PlusIcon,
  WalletIcon,
} from "lucide-react";
import { toast } from "sonner";

import { MissionStatCard } from "@/components/dashboard/missions/mission-stat-card";
import { MissionsCharts } from "@/components/dashboard/missions/missions-charts";
import { MissionFormDialog } from "@/components/dashboard/missions/mission-form-dialog";
import { MissionDetailDialog } from "@/components/dashboard/missions/mission-detail-dialog";
import {
  MissionsFilters,
  type MissionsFiltersState,
} from "@/components/dashboard/missions/missions-filters";
import { MissionsTable } from "@/components/dashboard/missions/missions-table";
import { MissionsCalendar } from "@/components/dashboard/missions/missions-calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  canViewAllMissions,
  canCreateMission,
  canDeleteAnyMission,
} from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type { SerializedMission } from "@/lib/services/mission/serialize-mission";
import type { MissionDashboardStats } from "@/lib/types/mission-stats";
import type { PaginatedResponse } from "@/lib/types/audit";

type MissionStats = MissionDashboardStats;

const EMPTY_FILTERS: MissionsFiltersState = {
  search: "",
  status: "all",
  type: "all",
  region: "",
  direction: "",
  dateFrom: "",
  dateTo: "",
};

function formatBudgetShort(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".", ",")} M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} k`;
  }
  return value.toLocaleString("fr-FR");
}

export function MissionsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { user: dbUser, isLoading: userLoading } = useCurrentDbUser();
  const role = (dbUser?.role ?? session?.user?.role) as UserRole | undefined;
  const roleReady = sessionStatus !== "loading" && !userLoading && Boolean(role);
  const showAllScope = role ? canViewAllMissions(role) : false;
  const canCreate = role ? canCreateMission(role) : false;

  const [view, setView] = useState<"list" | "calendar">("list");
  const [scope, setScope] = useState<"mine" | "all">("all");
  const queryScope: "mine" | "all" = showAllScope ? scope : "mine";
  const [filters, setFilters] = useState<MissionsFiltersState>(EMPTY_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [data, setData] = useState<PaginatedResponse<SerializedMission> | null>(null);
  const [stats, setStats] = useState<MissionStats | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);
  const [detailMissionId, setDetailMissionId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMissionId, setEditMissionId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters, queryScope]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const params = new URLSearchParams({ scope: queryScope });
      const res = await fetch(`/api/missions/stats?${params}`);
      if (!res.ok) throw new Error();
      setStats(await res.json());
    } catch {
      toast.error("Impossible de charger les statistiques");
    } finally {
      setStatsLoading(false);
    }
  }, [queryScope]);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        scope: queryScope,
      });
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.type !== "all") params.set("type", filters.type);
      if (filters.region.trim()) params.set("region", filters.region.trim());
      if (filters.direction.trim()) params.set("direction", filters.direction.trim());
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);

      const res = await fetch(`/api/missions?${params}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      toast.error("Impossible de charger les missions");
    } finally {
      setLoading(false);
    }
  }, [page, queryScope, debouncedSearch, filters]);

  useEffect(() => {
    if (!roleReady) return;
    void fetchStats();
  }, [fetchStats, roleReady]);

  useEffect(() => {
    if (!roleReady) return;
    void fetchMissions();
  }, [fetchMissions, roleReady]);

  const openMissionDetail = (missionId: string) => {
    setDetailMissionId(missionId);
    setDetailOpen(true);
  };

  const handleMissionUpdated = () => {
    void fetchMissions();
    void fetchStats();
    setCalendarRefreshKey((prev) => prev + 1);
  };

  const handleFilterChange = (patch: Partial<MissionsFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleDelete = async (mission: SerializedMission) => {
    if (!confirm(`Supprimer la mission ${mission.numero} ?`)) return;
    setDeletingId(mission._id);
    try {
      const res = await fetch(`/api/missions/${mission._id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      toast.success("Mission supprimée");
      void fetchMissions();
      void fetchStats();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  };

  const canDeleteMissionRole = role ? canDeleteAnyMission(role) : false;

  const canDeleteMission = useCallback(
    (mission: SerializedMission) => {
      if (!canDeleteMissionRole || deletingId === mission._id) return false;
      return true;
    },
    [canDeleteMissionRole, deletingId],
  );

  const statCards = useMemo(
    () => [
      {
        label: "En cours",
        value: stats?.enCours ?? 0,
        hint: "Missions actives aujourd'hui",
        icon: <PlaneIcon className="size-5" />,
        iconClass: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
        gradientClass: "bg-linear-to-br from-emerald-500/5 to-transparent",
        borderClass: "border-emerald-500/15",
      },
      {
        label: "À venir",
        value: stats?.aVenir ?? 0,
        hint: "Missions validées planifiées",
        icon: <CalendarDaysIcon className="size-5" />,
        iconClass: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
        gradientClass: "bg-linear-to-br from-sky-500/5 to-transparent",
        borderClass: "border-sky-500/15",
      },
      {
        label: "En validation",
        value: stats?.enValidation ?? 0,
        hint: "En attente d'approbation",
        icon: <ClockIcon className="size-5" />,
        iconClass: "bg-orange-500/10 text-orange-700 ring-orange-500/20",
        gradientClass: "bg-linear-to-br from-orange-500/5 to-transparent",
        borderClass: "border-orange-500/15",
      },
      {
        label: "Terminées",
        value: stats?.terminees ?? 0,
        hint: `${stats?.rapportsManquants ?? 0} rapport(s) manquant(s)`,
        icon: <CheckCircle2Icon className="size-5" />,
        iconClass: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
        gradientClass: "bg-linear-to-br from-violet-500/5 to-transparent",
        borderClass: "border-violet-500/15",
      },
      {
        label: "Agents en déplacement",
        value: stats?.agentsEnDeplacement ?? 0,
        hint: "Sur missions en cours",
        icon: <MapPinnedIcon className="size-5" />,
        iconClass: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
        gradientClass: "bg-linear-to-br from-amber-500/5 to-transparent",
        borderClass: "border-amber-500/15",
      },
      {
        label: "Budget consommé",
        value: stats ? `${formatBudgetShort(stats.budgetConsomme)} FCFA` : "0 FCFA",
        hint: stats
          ? `${formatBudgetShort(stats.budgetRestant)} FCFA restants`
          : "Calcul en cours",
        icon: <WalletIcon className="size-5" />,
        iconClass: "bg-teal-500/10 text-teal-700 ring-teal-500/20",
        gradientClass: "bg-linear-to-br from-teal-500/5 to-transparent",
        borderClass: "border-teal-500/15",
      },
      {
        label: "International",
        value: stats?.internationales ?? 0,
        hint: `${stats?.nationales ?? 0} mission(s) nationale(s)`,
        icon: <GlobeIcon className="size-5" />,
        iconClass: "bg-indigo-500/10 text-indigo-700 ring-indigo-500/20",
        gradientClass: "bg-linear-to-br from-indigo-500/5 to-transparent",
        borderClass: "border-indigo-500/15",
      },
      {
        label: "Cette semaine",
        value: stats?.cetteSemaine ?? 0,
        hint: `${stats?.ceMois ?? 0} ce mois-ci`,
        icon: <CalendarIcon className="size-5" />,
        iconClass: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
        gradientClass: "bg-linear-to-br from-rose-500/5 to-transparent",
        borderClass: "border-rose-500/15",
      },
    ],
    [stats],
  );

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-6 overflow-x-hidden pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Missions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Planifiez, suivez et validez les ordres de mission des agents.
          </p>
        </div>
        {canCreate && (
          <Button
            className="gap-2 bg-[var(--inp-vert)] shadow-md hover:bg-[var(--inp-vert)]/90"
            onClick={() => setCreateOpen(true)}
          >
            <PlusIcon className="size-4" />
            Nouvelle mission
          </Button>
        )}
      </div>

      {statsLoading ? (
        <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed">
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card, index) => (
            <MissionStatCard key={card.label} {...card} delay={index * 0.05} />
          ))}
        </div>
      )}

      <MissionsCharts
        charts={stats?.charts ?? null}
        loading={statsLoading}
        showDirectionChart={showAllScope && queryScope === "all"}
      />

      <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="list" className="gap-2">
              <ListIcon className="size-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="size-4" />
              Calendrier
            </TabsTrigger>
          </TabsList>

          {showAllScope && (
            <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-1">
              {(
                [
                  { value: "mine", label: "Mes missions" },
                  { value: "all", label: "Toutes les missions" },
                ] as const
              ).map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "rounded-md px-3",
                    scope === item.value && "bg-background shadow-sm",
                  )}
                  onClick={() => setScope(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="list" className="mt-4 min-w-0">
          <MissionsTable
            items={data?.items ?? []}
            loading={loading}
            page={data?.page ?? page}
            total={data?.total ?? 0}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
            onView={(mission) => openMissionDetail(mission._id)}
            onDelete={handleDelete}
            canDelete={canDeleteMission}
            filters={
              <MissionsFilters
                filters={filters}
                onChange={handleFilterChange}
                showDirectionFilter={showAllScope}
              />
            }
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-4 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 bg-muted/20 p-4">
              <MissionsFilters
                filters={filters}
                onChange={handleFilterChange}
                showDirectionFilter={showAllScope}
                hideDateFilters
              />
            </div>
          </div>

          <MissionsCalendar
            key={calendarRefreshKey}
            scope={queryScope}
            filters={{ ...filters, search: debouncedSearch }}
            onMissionClick={(mission) => openMissionDetail(mission._id)}
          />
        </TabsContent>
      </Tabs>

      {canCreate && (
        <MissionFormDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSuccess={handleMissionUpdated}
        />
      )}

      <MissionFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditMissionId(null);
        }}
        missionId={editMissionId}
        onSuccess={handleMissionUpdated}
      />

      <MissionDetailDialog
        missionId={detailMissionId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdated={handleMissionUpdated}
        onEdit={(id) => {
          setEditMissionId(id);
          setEditOpen(true);
        }}
      />
    </div>
  );
}
