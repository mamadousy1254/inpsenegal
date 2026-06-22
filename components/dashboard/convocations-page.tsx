"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArchiveIcon,
  CalendarClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";

import { ConvocationDetailDialog } from "@/components/dashboard/convocation-detail-dialog";
import { CreateConvocationDialog } from "@/components/dashboard/create-convocation-dialog";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CONVOCATION_RESPONSE_LABELS,
  CONVOCATION_STATUS_LABELS,
  CONVOCATION_STATUSES,
  type ConvocationStatus,
} from "@/lib/constants/convocation";
import {
  canManageConvocations,
  canViewAllConvocations,
} from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type { ConvocationEntry } from "@/lib/types/convocation";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ConvocationStatus, string> = {
  brouillon: "bg-slate-500/10 text-slate-700 ring-slate-500/20",
  envoyee: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  terminee: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  archivee: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
  annulee: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
};

function formatMeeting(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConvocationsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const role = session?.user?.role as UserRole | undefined;
  const canManage = role ? canManageConvocations(role) : false;
  const showAll = role ? canViewAllConvocations(role) : false;

  const [scope, setScope] = useState<"mine" | "all" | "archived">("mine");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ConvocationEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchConvocations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        scope,
      });
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/convocations?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, scope, search, statusFilter]);

  useEffect(() => {
    fetchConvocations();
  }, [fetchConvocations]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setDetailId(id);
      setDetailOpen(true);
    }
  }, [searchParams]);

  const openDetail = (id: string) => {
    setDetailId(id);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <CalendarClockIcon className="size-7 text-[var(--inp-vert)]" />
            Convocations à réunions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Création, envoi, réponses, émargement et archivage des convocations.
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" />
            Nouvelle convocation
          </Button>
        )}
      </motion.div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {showAll ? (
          <Tabs
            value={scope}
            onValueChange={(v) => {
              setScope(v as typeof scope);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="mine">Mes convocations</TabsTrigger>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="archived">
                <ArchiveIcon className="size-3.5" />
                Archives
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <Tabs
            value={scope === "archived" ? "archived" : "mine"}
            onValueChange={(v) => {
              setScope(v as "mine" | "archived");
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="mine">Mes convocations</TabsTrigger>
              <TabsTrigger value="archived">Archives</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher…"
              className="pl-9"
            />
          </div>
          {scope !== "archived" && (
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v ?? "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {CONVOCATION_STATUSES.filter((s) => s !== "archivee").map((s) => (
                  <SelectItem key={s} value={s}>
                    {CONVOCATION_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <CalendarClockIcon className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Aucune convocation trouvée</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => {
              const myInvitee = item.invitees.find(
                (invitee) => invitee.userId === session?.user?.id,
              );
              const responded = item.invitees.filter(
                (i) => i.responseStatus !== "pending",
              ).length;
              return (
                <div
                  key={item._id}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium truncate">{item.title}</p>
                      <Badge
                        className={cn("ring-1 ring-inset shrink-0", STATUS_STYLES[item.status])}
                      >
                        {CONVOCATION_STATUS_LABELS[item.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatMeeting(item.meetingAt)}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {showAll ? (
                        <>
                          <span className="flex items-center gap-1">
                            <UsersIcon className="size-3.5" />
                            {item.invitees.length} convoqué(s)
                          </span>
                          {item.status !== "brouillon" && (
                            <span>{responded} réponse(s)</span>
                          )}
                        </>
                      ) : myInvitee ? (
                        <span>
                          Ma réponse :{" "}
                          {CONVOCATION_RESPONSE_LABELS[myInvitee.responseStatus]}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openDetail(item._id)}>
                    <EyeIcon className="size-4" />
                    Voir
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} convocation{total > 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <span className="px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <CreateConvocationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchConvocations}
      />

      <ConvocationDetailDialog
        convocationId={detailId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdated={fetchConvocations}
      />
    </div>
  );
}
