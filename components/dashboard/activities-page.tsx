"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ActivityIcon,
  AtSignIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EyeIcon,
  GlobeIcon,
  HistoryIcon,
  KeyRoundIcon,
  Loader2Icon,
  LogInIcon,
  MapPinIcon,
  MonitorIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Trash2Icon,
  UserCheckIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";

import { ActivitiesCharts } from "@/components/dashboard/activities-charts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ACTION_LABELS,
  ACTION_TYPE_LABELS,
  ACTION_TYPES,
  ACTIONS,
  type ActionType,
} from "@/lib/constants/action-types";
import { getLoginFailureLabel } from "@/lib/constants/login-failure-reasons";
import {
  getResourceLabel,
  toReadableMetadata,
  type ReadableMetadataItem,
} from "@/lib/constants/audit-metadata-labels";
import type {
  ActivityHistoryEntry,
  AuditCharts,
  AuditStats,
  LoginHistoryEntry,
  PaginatedResponse,
} from "@/lib/types/audit";
import { formatDateTime, formatRelativeTime } from "@/lib/utils/format-datetime";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ACTION_TYPE_ICONS: Record<ActionType, React.ReactNode> = {
  create: <PlusIcon className="size-4" />,
  update: <PencilIcon className="size-4" />,
  delete: <Trash2Icon className="size-4" />,
  read: <EyeIcon className="size-4" />,
  login: <LogInIcon className="size-4" />,
  logout: <LogInIcon className="size-4" />,
  export: <ActivityIcon className="size-4" />,
  validate: <ShieldCheckIcon className="size-4" />,
  reject: <XCircleIcon className="size-4" />,
  share: <ActivityIcon className="size-4" />,
  other: <ActivityIcon className="size-4" />,
};

const ACTION_TYPE_STYLES: Record<ActionType, string> = {
  create: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25",
  update: "bg-sky-500/15 text-sky-700 ring-sky-500/25",
  delete: "bg-rose-500/15 text-rose-700 ring-rose-500/25",
  read: "bg-slate-500/15 text-slate-700 ring-slate-500/25",
  login: "bg-teal-500/15 text-teal-700 ring-teal-500/25",
  logout: "bg-amber-500/15 text-amber-700 ring-amber-500/25",
  export: "bg-violet-500/15 text-violet-700 ring-violet-500/25",
  validate: "bg-green-500/15 text-green-700 ring-green-500/25",
  reject: "bg-orange-500/15 text-orange-700 ring-orange-500/25",
  share: "bg-indigo-500/15 text-indigo-700 ring-indigo-500/25",
  other: "bg-neutral-500/15 text-neutral-700 ring-neutral-500/25",
};

const TIMELINE_DOT: Record<ActionType, string> = {
  create: "bg-emerald-500 shadow-emerald-500/40",
  update: "bg-sky-500 shadow-sky-500/40",
  delete: "bg-rose-500 shadow-rose-500/40",
  read: "bg-slate-400 shadow-slate-400/40",
  login: "bg-teal-500 shadow-teal-500/40",
  logout: "bg-amber-500 shadow-amber-500/40",
  export: "bg-violet-500 shadow-violet-500/40",
  validate: "bg-green-500 shadow-green-500/40",
  reject: "bg-orange-500 shadow-orange-500/40",
  share: "bg-indigo-500 shadow-indigo-500/40",
  other: "bg-neutral-400 shadow-neutral-400/40",
};

const METADATA_ICONS: Record<string, React.ReactNode> = {
  targetEmail: <AtSignIcon className="size-3.5" />,
  targetFullname: <UserIcon className="size-3.5" />,
  targetRole: <ShieldCheckIcon className="size-3.5" />,
  targetSection: <MapPinIcon className="size-3.5" />,
  passwordUpdated: <KeyRoundIcon className="size-3.5" />,
  validatorsUpdated: <UserCheckIcon className="size-3.5" />,
  validatorsCount: <UsersIcon className="size-3.5" />,
  requesterFullname: <UserIcon className="size-3.5" />,
  requesterEmail: <AtSignIcon className="size-3.5" />,
  onBehalfOf: <UserCheckIcon className="size-3.5" />,
  dateDepart: <CalendarIcon className="size-3.5" />,
  dateFin: <CalendarIcon className="size-3.5" />,
  duree: <ClockIcon className="size-3.5" />,
  raison: <ActivityIcon className="size-3.5" />,
  absenceType: <CalendarIcon className="size-3.5" />,
  adminBypass: <ShieldCheckIcon className="size-3.5" />,
  debtDays: <ActivityIcon className="size-3.5" />,
  statutValidation: <ShieldCheckIcon className="size-3.5" />,
  comment: <PencilIcon className="size-3.5" />,
};

const METADATA_STYLES: Record<string, string> = {
  targetEmail: "bg-blue-500/10 text-blue-700 ring-blue-500/20",
  targetFullname: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
  targetRole: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  targetSection: "bg-teal-500/10 text-teal-700 ring-teal-500/20",
  passwordUpdated: "bg-orange-500/10 text-orange-700 ring-orange-500/20",
  validatorsUpdated: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  validatorsCount: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  requesterFullname: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
  requesterEmail: "bg-blue-500/10 text-blue-700 ring-blue-500/20",
  onBehalfOf: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  dateDepart: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  dateFin: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  duree: "bg-indigo-500/10 text-indigo-700 ring-indigo-500/20",
  raison: "bg-neutral-500/10 text-neutral-700 ring-neutral-500/20",
  absenceType: "bg-teal-500/10 text-teal-700 ring-teal-500/20",
  adminBypass: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  debtDays: "bg-orange-500/10 text-orange-700 ring-orange-500/20",
  statutValidation: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  comment: "bg-slate-500/10 text-slate-700 ring-slate-500/20",
};

function getVisibleMetadata(metadata?: Record<string, unknown>): ReadableMetadataItem[] {
  return toReadableMetadata(metadata).filter((item) => {
    if (item.key === "passwordUpdated" && item.value === "Non") return false;
    if (item.key === "validatorsUpdated" && item.value === "Non") return false;
    if (item.key === "adminBypass" && item.value === "Non") return false;
    return true;
  });
}

function getInitials(firstname: string, lastname: string): string {
  return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
}

function parseUserAgent(ua?: string): string {
  if (!ua) return "Appareil inconnu";
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua)) return "Tablette";
  if (/windows/i.test(ua)) return "Windows";
  if (/mac/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Navigateur web";
}

function StatCard({
  label,
  value,
  hint,
  icon,
  iconClass,
  gradientClass,
  borderClass,
  delay,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  iconClass: string;
  gradientClass: string;
  borderClass: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md",
        gradientClass,
        borderClass,
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {value.toLocaleString("fr-FR")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl ring-1 ring-inset",
            iconClass,
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function PaginationBar({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        {total.toLocaleString("fr-FR")} résultat{total > 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon className="size-4" />
          Précédent
        </Button>
        <span className="min-w-24 text-center text-xs font-medium text-muted-foreground">
          Page {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Suivant
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ActivityMetadata({ metadata }: { metadata?: Record<string, unknown> }) {
  const items = getVisibleMetadata(metadata);
  if (items.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.key}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ring-1 ring-inset",
            METADATA_STYLES[item.key] ?? "bg-muted/70 text-muted-foreground ring-border/60",
          )}
        >
          {METADATA_ICONS[item.key] ?? <ActivityIcon className="size-3.5" />}
          <span className="font-medium">{item.label}</span>
          <span className="opacity-80">· {item.value}</span>
        </span>
      ))}
    </div>
  );
}

function ActivityTimelineItem({
  entry,
  index,
}: {
  entry: ActivityHistoryEntry;
  index: number;
}) {
  const actorName = `${entry.actorFirstname} ${entry.actorLastname}`;
  const actionLabel =
    ACTION_LABELS[entry.action as keyof typeof ACTION_LABELS] ??
    entry.description ??
    entry.action;

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="relative pl-10"
    >
      <span
        className={cn(
          "absolute left-3 top-5 size-3 rounded-full shadow-lg ring-4 ring-background",
          TIMELINE_DOT[entry.actionType],
        )}
      />
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-[var(--inp-vert)]/20 hover:shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-sm font-bold text-[var(--inp-vert)] ring-1 ring-[var(--inp-vert)]/15">
              {getInitials(entry.actorFirstname, entry.actorLastname)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{actionLabel}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Effectué par{" "}
                <span className="font-medium text-foreground/80">{actorName}</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1.5 border-0 ring-1 ring-inset",
                    ACTION_TYPE_STYLES[entry.actionType],
                  )}
                >
                  {ACTION_TYPE_ICONS[entry.actionType]}
                  {ACTION_TYPE_LABELS[entry.actionType]}
                </Badge>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <UsersIcon className="size-3" />
                  {getResourceLabel(entry.resource)}
                </Badge>
              </div>
              <ActivityMetadata metadata={entry.metadata} />
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs font-medium text-foreground">
              {formatRelativeTime(entry.createdAt)}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {formatDateTime(entry.createdAt)}
            </p>
            {entry.ip && (
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <GlobeIcon className="size-3" />
                Adresse IP : {entry.ip}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

function LoginRow({ entry, index }: { entry: LoginHistoryEntry; index: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="border-b border-border/40 transition-colors hover:bg-muted/30"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl ring-1 ring-inset",
              entry.success
                ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20"
                : "bg-rose-500/10 text-rose-700 ring-rose-500/20",
            )}
          >
            {entry.success ? (
              <ShieldCheckIcon className="size-4" />
            ) : (
              <XCircleIcon className="size-4" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{entry.email}</p>
            <p className="text-xs text-muted-foreground">
              {entry.success
                ? "Connexion réussie"
                : getLoginFailureLabel(entry.failureReason)}
            </p>
          </div>
        </div>
      </td>
      <td className="hidden px-5 py-4 md:table-cell">
        <Badge
          variant="outline"
          className={cn(
            "border-0 ring-1 ring-inset",
            entry.success
              ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20"
              : "bg-rose-500/10 text-rose-700 ring-rose-500/20",
          )}
        >
          {entry.success ? "Succès" : "Refusée"}
        </Badge>
      </td>
      <td className="hidden px-5 py-4 lg:table-cell">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MonitorIcon className="size-3.5" />
          {parseUserAgent(entry.userAgent)}
        </div>
      </td>
      <td className="hidden px-5 py-4 sm:table-cell">
        <span className="text-xs text-muted-foreground">{entry.ip ?? "—"}</span>
      </td>
      <td className="px-5 py-4 text-right">
        <p className="text-xs font-medium text-foreground">
          {formatRelativeTime(entry.createdAt)}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {formatDateTime(entry.createdAt)}
        </p>
      </td>
    </motion.tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export function ActivitiesPage() {
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [charts, setCharts] = useState<AuditCharts | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"actions" | "logins">("actions");

  const [activitySearch, setActivitySearch] = useState("");
  const [activityActionType, setActivityActionType] = useState<string>("all");
  const [activityAction, setActivityAction] = useState<string>("all");
  const [activityPage, setActivityPage] = useState(1);
  const [activities, setActivities] =
    useState<PaginatedResponse<ActivityHistoryEntry> | null>(null);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const [loginSearch, setLoginSearch] = useState("");
  const [loginSuccess, setLoginSuccess] = useState<string>("all");
  const [loginPage, setLoginPage] = useState(1);
  const [logins, setLogins] =
    useState<PaginatedResponse<LoginHistoryEntry> | null>(null);
  const [loginsLoading, setLoginsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/audit/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setCharts(data.charts);
      }
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    setActivitiesLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(activityPage),
        limit: "15",
      });
      if (activitySearch.trim()) params.set("search", activitySearch.trim());
      if (activityActionType !== "all") params.set("actionType", activityActionType);
      if (activityAction !== "all") params.set("action", activityAction);

      const res = await fetch(`/api/activity-history?${params}`);
      if (res.ok) {
        setActivities(await res.json());
      }
    } finally {
      setActivitiesLoading(false);
    }
  }, [activityPage, activitySearch, activityActionType, activityAction]);

  const fetchLogins = useCallback(async () => {
    setLoginsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(loginPage),
        limit: "15",
      });
      if (loginSearch.trim()) params.set("search", loginSearch.trim());
      if (loginSuccess !== "all") params.set("success", loginSuccess);

      const res = await fetch(`/api/login-history?${params}`);
      if (res.ok) {
        setLogins(await res.json());
      }
    } finally {
      setLoginsLoading(false);
    }
  }, [loginPage, loginSearch, loginSuccess]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    fetchLogins();
  }, [fetchLogins]);

  useEffect(() => {
    setActivityPage(1);
  }, [activitySearch, activityActionType, activityAction]);

  useEffect(() => {
    setLoginPage(1);
  }, [loginSearch, loginSuccess]);

  const actionOptions = useMemo(
    () => Object.values(ACTIONS),
    [],
  );

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* En-tête + graphiques + stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <SparklesIcon className="size-3.5 text-[var(--inp-vert)]" />
              Suivi de l&apos;activité INP
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Activités & connexions
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-[var(--inp-vert)]">
              <HistoryIcon className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Période affichée</p>
              <p className="text-sm font-semibold text-foreground">7 derniers jours</p>
            </div>
          </div>
        </div>

        <ActivitiesCharts charts={charts} loading={statsLoading} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-muted/60"
              />
            ))
          ) : stats ? (
            <>
              <StatCard
                label="Événements enregistrés"
                value={stats.totalActivities}
                hint={`${stats.activitiesToday} aujourd'hui`}
                icon={<ActivityIcon className="size-5" />}
                iconClass="bg-emerald-500/10 text-emerald-700 ring-emerald-500/20"
                gradientClass="bg-gradient-to-br from-emerald-50/90 via-card to-card"
                borderClass="border-emerald-100/80"
                delay={0.1}
              />
              <StatCard
                label="Tentatives de connexion"
                value={stats.totalLogins}
                hint={`${stats.successfulLogins} réussies · ${stats.failedLogins} refusées`}
                icon={<LogInIcon className="size-5" />}
                iconClass="bg-sky-500/10 text-sky-700 ring-sky-500/20"
                gradientClass="bg-gradient-to-br from-sky-50/90 via-card to-card"
                borderClass="border-sky-100/80"
                delay={0.15}
              />
              <StatCard
                label="Connexions réussies"
                value={stats.successfulLoginsToday}
                hint="Aujourd'hui"
                icon={<ShieldCheckIcon className="size-5" />}
                iconClass="bg-teal-500/10 text-teal-700 ring-teal-500/20"
                gradientClass="bg-gradient-to-br from-teal-50/90 via-card to-card"
                borderClass="border-teal-100/80"
                delay={0.2}
              />
              <StatCard
                label="Connexions refusées"
                value={stats.failedLoginsToday}
                hint="Aujourd'hui"
                icon={<XCircleIcon className="size-5" />}
                iconClass="bg-rose-500/10 text-rose-700 ring-rose-500/20"
                gradientClass="bg-gradient-to-br from-rose-50/90 via-card to-card"
                borderClass="border-rose-100/80"
                delay={0.25}
              />
            </>
          ) : null}
        </div>
      </motion.div>

      {/* Tabs content */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "actions" | "logins")}
        className="gap-0"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-11 rounded-xl bg-muted/60 p-1">
            <TabsTrigger
              value="actions"
              className="gap-2 rounded-lg px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ActivityIcon className="size-4" />
              Ce qui s&apos;est passé
            </TabsTrigger>
            <TabsTrigger
              value="logins"
              className="gap-2 rounded-lg px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <LogInIcon className="size-4" />
              Qui s&apos;est connecté
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Actions tab */}
        <TabsContent value="actions" className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  placeholder="Rechercher une personne ou un événement…"
                  className="h-10 rounded-xl bg-background pl-9"
                />
              </div>
              <Select
                value={activityActionType}
                onValueChange={(v) => setActivityActionType(v ?? "all")}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-44">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {ACTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {ACTION_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={activityAction}
                onValueChange={(v) => setActivityAction(v ?? "all")}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-52">
                  <SelectValue placeholder="Événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les événements</SelectItem>
                  {actionOptions.map((code) => (
                    <SelectItem key={code} value={code}>
                      {ACTION_LABELS[code]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-5 sm:p-6">
              {activitiesLoading ? (
                <div className="flex min-h-64 items-center justify-center">
                  <Loader2Icon className="size-8 animate-spin text-[var(--inp-vert)]" />
                </div>
              ) : activities && activities.items.length > 0 ? (
                <ul className="relative space-y-6 before:absolute before:bottom-2 before:left-[17px] before:top-2 before:w-px before:bg-border/80">
                  <AnimatePresence mode="popLayout">
                    {activities.items.map((entry, index) => (
                      <ActivityTimelineItem
                        key={entry._id}
                        entry={entry}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                    <HistoryIcon className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">
                    Aucun événement pour le moment
                  </p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Les ajouts, modifications et suppressions de comptes
                    apparaîtront ici automatiquement.
                  </p>
                </div>
              )}
            </div>

            {activities && activities.total > 0 && (
              <PaginationBar
                page={activities.page}
                totalPages={activities.totalPages}
                total={activities.total}
                onPageChange={setActivityPage}
              />
            )}
          </div>
        </TabsContent>

        {/* Logins tab */}
        <TabsContent value="logins" className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={loginSearch}
                  onChange={(e) => setLoginSearch(e.target.value)}
                  placeholder="Rechercher par e-mail…"
                  className="h-10 rounded-xl bg-background pl-9"
                />
              </div>
              <Select
                value={loginSuccess}
                onValueChange={(v) => setLoginSuccess(v ?? "all")}
              >
                <SelectTrigger className="h-10 w-full rounded-xl sm:w-44">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="true">Connexions réussies</SelectItem>
                  <SelectItem value="false">Connexions refusées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              {loginsLoading ? (
                <div className="flex min-h-64 items-center justify-center">
                  <Loader2Icon className="size-8 animate-spin text-[var(--inp-vert)]" />
                </div>
              ) : logins && logins.items.length > 0 ? (
                <table className="w-full min-w-[640px] text-left">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Compte
                      </th>
                      <th className="hidden px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
                        Résultat
                      </th>
                      <th className="hidden px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">
                        Appareil utilisé
                      </th>
                      <th className="hidden px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">
                        Adresse IP
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Quand
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logins.items.map((entry, index) => (
                      <LoginRow key={entry._id} entry={entry} index={index} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                    <UserIcon className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">
                    Aucune connexion enregistrée
                  </p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Chaque tentative de connexion (réussie ou échouée) est
                    automatiquement tracée ici.
                  </p>
                </div>
              )}
            </div>

            {logins && logins.total > 0 && (
              <PaginationBar
                page={logins.page}
                totalPages={logins.totalPages}
                total={logins.total}
                onPageChange={setLoginPage}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
