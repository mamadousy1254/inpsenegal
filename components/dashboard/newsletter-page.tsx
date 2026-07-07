"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  MailIcon,
  SearchIcon,
  Trash2Icon,
  UserMinusIcon,
  UserPlusIcon,
} from "lucide-react";
import { toast } from "sonner";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  NEWSLETTER_SOURCE_LABELS,
  NEWSLETTER_STATUSES,
  NEWSLETTER_STATUS_LABELS,
  type NewsletterStatus,
} from "@/lib/constants/newsletter";
import type { SerializedNewsletterSubscriber } from "@/lib/services/newsletter/serialize-newsletter";
import type { PaginatedResponse } from "@/lib/types/audit";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<NewsletterStatus, string> = {
  actif: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  desinscrit: "bg-slate-500/10 text-slate-600 ring-slate-500/20",
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NewsletterPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<SerializedNewsletterSubscriber> | null>(
    null,
  );
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, yearFilter]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
      });
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (yearFilter !== "all") params.set("year", yearFilter);

      const res = await fetch(`/api/newsletter?${params}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      toast.error("Impossible de charger les abonnés");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, yearFilter]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const availableYears = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(current - i));
  }, []);

  const stats = useMemo(() => {
    const items = data?.items ?? [];
    return {
      actifs: items.filter((i) => i.status === "actif").length,
      desinscrits: items.filter((i) => i.status === "desinscrit").length,
    };
  }, [data?.items]);

  const handleStatusChange = async (item: SerializedNewsletterSubscriber, status: NewsletterStatus) => {
    setActionId(item._id);
    try {
      const res = await fetch(`/api/newsletter/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      toast.success(
        status === "actif" ? "Abonné réactivé" : "Abonné désinscrit",
      );
      void fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (item: SerializedNewsletterSubscriber) => {
    if (!confirm(`Supprimer définitivement ${item.email} ?`)) return;
    setActionId(item._id);
    try {
      const res = await fetch(`/api/newsletter/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      toast.success("Abonné supprimé");
      void fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Suppression impossible");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <MailIcon className="size-7 text-[var(--inp-vert)]" />
          Newsletter
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Abonnés inscrits via le formulaire en bas du site public.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total (filtre actuel)
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {(data?.total ?? 0).toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Actifs (page)
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">
            {stats.actifs}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Désinscrits (page)
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-600">
            {stats.desinscrits}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par e-mail…"
              className="h-10 rounded-xl bg-background pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="h-10 w-full rounded-xl lg:w-44">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {NEWSLETTER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {NEWSLETTER_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={(v) => setYearFilter(v ?? "all")}>
            <SelectTrigger className="h-10 w-full rounded-xl lg:w-40">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2Icon className="size-8 animate-spin text-[var(--inp-vert)]" />
            </div>
          ) : data && data.items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>E-mail</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead className="hidden lg:table-cell">Inscrit le</TableHead>
                  <TableHead className="hidden xl:table-cell">IP</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("border-0 ring-1 ring-inset", STATUS_STYLES[item.status])}
                      >
                        {NEWSLETTER_STATUS_LABELS[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {NEWSLETTER_SOURCE_LABELS[item.source] ?? item.source}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                      {item.ip ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {item.status === "actif" ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Désinscrire"
                            disabled={actionId === item._id}
                            onClick={() => handleStatusChange(item, "desinscrit")}
                          >
                            <UserMinusIcon className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Réactiver"
                            disabled={actionId === item._id}
                            onClick={() => handleStatusChange(item, "actif")}
                          >
                            <UserPlusIcon className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Supprimer"
                          className="text-destructive hover:text-destructive"
                          disabled={actionId === item._id}
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
              <MailIcon className="size-10 text-muted-foreground/50" />
              <p className="font-medium text-foreground">Aucun abonné trouvé</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Les inscriptions via le pied de page apparaîtront ici.
              </p>
            </div>
          )}
        </div>

        {data && data.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {data.total.toLocaleString("fr-FR")} abonné{data.total > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeftIcon className="size-4" />
                Précédent
              </Button>
              <span className="min-w-24 text-center text-xs font-medium text-muted-foreground">
                Page {data.page} / {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
