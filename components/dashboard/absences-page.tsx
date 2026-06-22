"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  ClipboardCheckIcon,
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  Loader2Icon,
  SearchIcon,
  Trash2Icon,
  UserIcon,
  XCircleIcon,
  ArrowRightLeftIcon,
} from "lucide-react";
import { toast } from "sonner";

import { CreateAbsenceDialog } from "@/components/dashboard/create-absence-dialog";
import { DelegationDialog } from "@/components/dashboard/delegation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ABSENCE_TYPE_LABELS,
  VALIDATION_STATUSES,
  VALIDATION_STATUS_LABELS,
  type ValidationStatus,
} from "@/lib/constants/leave";
import { canViewAllAbsences } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type { AbsenceRequestEntry, LeaveBalanceSummary } from "@/lib/types/absence";
import {
  canValidatorAct,
  countApproved,
  findActingValidation,
} from "@/lib/services/absence/validation-workflow";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ValidationStatus, string> = {
  en_attente: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  en_cours: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  approuvee: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  rejetee: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
};

function formatDay(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AbsenceRowActions({
  canValidate,
  canDelete,
  onView,
  onValidate,
  onDelete,
}: {
  canValidate: boolean;
  canDelete: boolean;
  onView: () => void;
  onValidate: () => void;
  onDelete: () => void;
}) {
  const actions = [
    {
      label: "Voir la demande",
      icon: EyeIcon,
      onClick: onView,
      className:
        "text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-950/40",
    },
    ...(canValidate
      ? [
          {
            label: "Valider la demande",
            icon: ClipboardCheckIcon,
            onClick: onValidate,
            className:
              "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40",
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            label: "Supprimer la demande",
            icon: Trash2Icon,
            onClick: onDelete,
            className:
              "text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40",
          },
        ]
      : []),
  ];

  return (
    <div className="flex items-center justify-end gap-0.5">
      {actions.map(({ label, icon: Icon, onClick, className }) => (
        <Tooltip key={label}>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn("size-8 rounded-lg", className)}
                onClick={onClick}
              />
            }
          >
            <Icon className="size-4" />
            <span className="sr-only">{label}</span>
          </TooltipTrigger>
          <TooltipContent side="top">{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function ValidationStepIcon({
  validated,
  rejected,
}: {
  validated: boolean;
  rejected: boolean;
}) {
  if (validated) {
    return <CheckCircle2Icon className="size-4 shrink-0 text-emerald-600" />;
  }
  if (rejected) {
    return <XCircleIcon className="size-4 shrink-0 text-rose-600" />;
  }
  return <ClockIcon className="size-4 shrink-0 text-amber-500" />;
}

export function AbsencesPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const role = session?.user?.role as UserRole | undefined;
  const showAll = role ? canViewAllAbsences(role) : false;

  const initialScope = searchParams.get("scope");
  const [scope, setScope] = useState<"mine" | "all" | "to-validate">(
    initialScope === "to-validate" ? "to-validate" : "mine",
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AbsenceRequestEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<LeaveBalanceSummary | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [delegationOpen, setDelegationOpen] = useState(false);
  const [viewItem, setViewItem] = useState<AbsenceRequestEntry | null>(null);
  const [validateItem, setValidateItem] = useState<AbsenceRequestEntry | null>(null);
  const [actingForDelegatorIds, setActingForDelegatorIds] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const [validateAction, setValidateAction] = useState<"approve" | "reject">("approve");
  const [validateComment, setValidateComment] = useState("");

  const [justificatifLink, setJustificatifLink] = useState<{
    url: string;
    previewUrl?: string;
    thumbnailUrl?: string;
    filename?: string;
  } | null>(null);
  const [justificatifLoading, setJustificatifLoading] = useState(false);

  async function openJustificatif(absenceId: string) {
    try {
      const res = await fetch(`/api/absences/${absenceId}/justificatif`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      const urlToOpen = data.previewUrl || data.url;
      window.open(urlToOpen, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible d'ouvrir le justificatif",
      );
    }
  }

  useEffect(() => {
    if (!viewItem?.justificatif) {
      setJustificatifLink(null);
      setJustificatifLoading(false);
      return;
    }

    let cancelled = false;
    setJustificatifLoading(true);

    fetch(`/api/absences/${viewItem._id}/justificatif`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (cancelled) return;
        if (!ok) {
          setJustificatifLink(null);
          return;
        }
        setJustificatifLink({
          url: String(j.url ?? ""),
          previewUrl: j.previewUrl ? String(j.previewUrl) : undefined,
          thumbnailUrl: j.thumbnailUrl ? String(j.thumbnailUrl) : undefined,
          filename: j.filename ? String(j.filename) : undefined,
        });
      })
      .catch(() => {
        if (!cancelled) setJustificatifLink(null);
      })
      .finally(() => {
        if (!cancelled) setJustificatifLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [viewItem?._id, viewItem?.justificatif]);

  const fetchBalance = useCallback(async () => {
    const res = await fetch("/api/leave-balance/me");
    if (res.ok) {
      const data = await res.json();
      setBalance(data.balance);
    }
  }, []);

  const fetchAbsences = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        scope,
      });
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/absences?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setActingForDelegatorIds(data.actingForDelegatorIds ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [page, scope, search, statusFilter]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, scope]);

  useEffect(() => {
    if (validateItem) {
      setValidateAction("approve");
      setValidateComment("");
    }
  }, [validateItem]);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette demande ?")) return;
    const res = await fetch(`/api/absences/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Erreur");
      return;
    }
    toast.success("Demande supprimée");
    fetchAbsences();
  }

  async function handleValidate() {
    if (!validateItem) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/absences/${validateItem._id}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: validateAction,
          comment: validateComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast.success(
        validateAction === "approve" ? "Demande approuvée" : "Demande refusée",
      );
      setValidateItem(null);
      setValidateComment("");
      fetchAbsences();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  const userId = session?.user?.id;

  const canViewFullItem = (item: AbsenceRequestEntry) =>
    showAll || item.requesterId === userId;

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Absences & congés</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Déposez et suivez vos demandes d&apos;absence ou de congé payé.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setDelegationOpen(true)}
            className="gap-2"
          >
            <ArrowRightLeftIcon className="size-4" />
            Déléguer mes validations
          </Button>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 bg-[var(--inp-vert)] shadow-md hover:bg-[var(--inp-vert)]/90"
          >
            <CalendarIcon className="size-4" />
            Demande d&apos;absence
          </Button>
        </div>
      </div>

      {balance && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Jours acquis",
              value: balance.accrued,
              className: "from-sky-50/90 via-card to-card border-sky-100/80",
            },
            {
              label: "Jours pris",
              value: balance.consumed,
              className: "from-amber-50/90 via-card to-card border-amber-100/80",
            },
            {
              label: "Solde disponible",
              value: balance.available,
              className: "from-emerald-50/90 via-card to-card border-emerald-100/80",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={cn(
                "rounded-2xl border bg-gradient-to-br p-5 shadow-sm",
                card.className,
              )}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{card.value}</p>
              {balance.contractYear && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Contrat {balance.contractYear}
                  {balance.contractType ? ` · ${balance.contractType.toUpperCase()}` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-4">
          {showAll ? (
            <Tabs
              value={scope}
              onValueChange={(v) => setScope(v as typeof scope)}
            >
              <TabsList>
                <TabsTrigger value="mine">Mes demandes</TabsTrigger>
                <TabsTrigger value="to-validate">À valider</TabsTrigger>
                <TabsTrigger value="all">Toutes</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : (
            <Tabs
              value={scope === "to-validate" ? "to-validate" : "mine"}
              onValueChange={(v) =>
                setScope(v === "to-validate" ? "to-validate" : "mine")
              }
            >
              <TabsList>
                <TabsTrigger value="mine">Mes demandes</TabsTrigger>
                <TabsTrigger value="to-validate">À valider</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une demande…"
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {VALIDATION_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {VALIDATION_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <Loader2Icon className="size-8 animate-spin text-[var(--inp-vert)]" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-8 text-center">
              <CalendarIcon className="size-10 text-muted-foreground/40" />
              <p className="font-medium">Aucune demande</p>
            </div>
          ) : (
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">Employé</th>
                  <th className="px-5 py-3">Période</th>
                  <th className="px-5 py-3">Motif</th>
                  <th className="px-5 py-3">Durée</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const canValidate =
                    userId &&
                    canValidatorAct(
                      item.validations,
                      userId,
                      actingForDelegatorIds,
                    ) &&
                    ["en_attente", "en_cours"].includes(item.statutValidation);

                  return (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border/40 hover:bg-muted/20"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {item.firstname} {item.lastname}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.occupation}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p>{formatDay(item.dateDepart)} → {formatDay(item.dateFin)}</p>
                        <p className="text-xs text-muted-foreground">
                          Soumise le {formatDay(item.dateSoumission)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{item.raison}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.absenceType.replace("_", " ")}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-[var(--inp-vert)]">
                          {item.duree}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          jour{item.duree > 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "border-0 ring-1 ring-inset",
                            STATUS_STYLES[item.statutValidation],
                          )}
                        >
                          {VALIDATION_STATUS_LABELS[item.statutValidation]}
                        </Badge>
                        {canViewFullItem(item) && item.requiredValidatorsCount > 0 && (
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {countApproved(item.validations)}/
                            {item.requiredValidatorsCount} validations
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <AbsenceRowActions
                          canValidate={Boolean(canValidate)}
                          canDelete={Boolean(
                            (item.requesterId === userId || showAll) &&
                              ["en_attente", "en_cours"].includes(
                                item.statutValidation,
                              ),
                          )}
                          onView={() => setViewItem(item)}
                          onValidate={() => setValidateItem(item)}
                          onDelete={() => handleDelete(item._id)}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {total > 0 && (
          <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {total} demande{total > 1 ? "s" : ""}
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
              <span className="text-xs text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateAbsenceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => {
          fetchAbsences();
          fetchBalance();
        }}
      />

      <DelegationDialog
        open={delegationOpen}
        onOpenChange={setDelegationOpen}
        onChanged={fetchAbsences}
        currentUserId={userId}
      />

      {/* Voir */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          {viewItem && (() => {
            const showFullDetails = canViewFullItem(viewItem);
            return (
            <>
              <div className="border-b bg-gradient-to-br from-[var(--inp-vert)]/10 via-background to-background px-6 py-5">
                <DialogHeader className="text-left">
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <CalendarDaysIcon className="size-5 text-[var(--inp-vert)]" />
                    {showFullDetails
                      ? "Demande d'absence"
                      : "Demande à valider"}
                  </DialogTitle>
                  <DialogDescription className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-medium text-foreground">
                      {viewItem.firstname} {viewItem.lastname}
                    </span>
                    <span>·</span>
                    <span>{viewItem.occupation}</span>
                  </DialogDescription>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-3 w-fit border-0 ring-1 ring-inset",
                      STATUS_STYLES[viewItem.statutValidation],
                    )}
                  >
                    {VALIDATION_STATUS_LABELS[viewItem.statutValidation]}
                  </Badge>
                </DialogHeader>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Période
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatDay(viewItem.dateDepart)}
                    </p>
                    <p className="text-sm font-semibold">
                      → {formatDay(viewItem.dateFin)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Durée
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--inp-vert)]">
                      {viewItem.duree}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      jour{viewItem.duree > 1 ? "s" : ""} ouvré
                      {viewItem.duree > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Type
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {ABSENCE_TYPE_LABELS[viewItem.absenceType]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Soumise le {formatDay(viewItem.dateSoumission)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Motif
                  </p>
                  <p className="mt-1 font-medium">{viewItem.raison}</p>
                </div>

                {viewItem.justificatif && (
                  <div className="mt-4 rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Justificatif
                    </p>
                    <button
                      type="button"
                      onClick={() => openJustificatif(viewItem._id)}
                      className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/10 p-3 text-left transition-colors hover:bg-muted/20"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {justificatifLink?.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={justificatifLink.thumbnailUrl}
                            alt="Aperçu justificatif"
                            className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-border/60"
                          />
                        ) : (
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border/60">
                            <FileTextIcon className="size-5 text-[var(--inp-vert)]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {viewItem.justificatif.filename}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {Math.max(1, Math.round(viewItem.justificatif.bytes / 1024))} Ko
                            {justificatifLoading
                              ? " · chargement de l’aperçu…"
                              : justificatifLink?.thumbnailUrl
                                ? " · aperçu disponible"
                                : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[var(--inp-vert)]">
                        Ouvrir
                      </span>
                    </button>
                  </div>
                )}

                <section className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold">
                    {showFullDetails
                      ? `Chaîne de validation (${viewItem.validations.length})`
                      : "Validation"}
                  </h3>
                  {viewItem.validations.length === 0 ? (
                    <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                      Aucun validateur assigné
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {viewItem.validations
                        .filter(
                          (v) =>
                            showFullDetails ||
                            v.validatorUserId === userId ||
                            actingForDelegatorIds.includes(v.validatorUserId) ||
                            v.isValidated ||
                            v.isRejected,
                        )
                        .map((v) => (
                        <li
                          key={`${v.level}-${v.validatorUserId}`}
                          className={cn(
                            "flex gap-3 rounded-xl border px-4 py-3",
                            v.isValidated &&
                              "border-emerald-200/80 bg-emerald-50/40",
                            v.isRejected &&
                              "border-rose-200/80 bg-rose-50/40",
                            !v.isValidated &&
                              !v.isRejected &&
                              "border-border/60 bg-card",
                          )}
                        >
                          <ValidationStepIcon
                            validated={v.isValidated}
                            rejected={v.isRejected}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium">{v.fullname}</p>
                              <Badge variant="outline" className="text-[10px]">
                                Niveau {v.level}
                              </Badge>
                              {v.validatorUserId === userId && (
                                <Badge
                                  variant="outline"
                                  className="border-sky-200 text-[10px] text-sky-700"
                                >
                                  Vous
                                </Badge>
                              )}
                              {actingForDelegatorIds.includes(v.validatorUserId) &&
                                v.validatorUserId !== userId && (
                                <Badge
                                  variant="outline"
                                  className="border-violet-200 text-[10px] text-violet-700"
                                >
                                  Délégation
                                </Badge>
                              )}
                              {v.isValidated && (
                                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                                  Approuvé
                                </Badge>
                              )}
                              {v.isRejected && (
                                <Badge variant="destructive">Refusé</Badge>
                              )}
                              {!v.isValidated && !v.isRejected && (
                                <Badge
                                  variant="outline"
                                  className="border-amber-200 bg-amber-50 text-amber-800"
                                >
                                  En attente
                                </Badge>
                              )}
                            </div>
                            {v.email ? (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {v.email}
                              </p>
                            ) : null}
                            {v.activeDelegation &&
                              !v.isValidated &&
                              !v.isRejected && (
                                <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-violet-800">
                                  <ArrowRightLeftIcon className="size-3.5 shrink-0" />
                                  <span>
                                    Validations déléguées à{" "}
                                    <strong>
                                      {v.activeDelegation.delegateFullname}
                                    </strong>
                                  </span>
                                  <span className="text-muted-foreground">
                                    (jusqu&apos;au{" "}
                                    {formatDay(v.activeDelegation.endAt)})
                                  </span>
                                </p>
                              )}
                            {v.comment && (
                              <p className="mt-2 rounded-lg bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                                « {v.comment} »
                              </p>
                            )}
                            {v.actedByFullname && (
                              <p className="mt-1 text-xs text-violet-700">
                                Validé par {v.actedByFullname} (délégation)
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Valider */}
      <Dialog open={!!validateItem} onOpenChange={() => setValidateItem(null)}>
        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <div
            className={cn(
              "border-b px-6 py-5",
              validateAction === "approve"
                ? "bg-gradient-to-br from-emerald-500/10 via-background to-background"
                : "bg-gradient-to-br from-rose-500/10 via-background to-background",
            )}
          >
            <DialogHeader className="text-left">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <ClipboardCheckIcon
                  className={cn(
                    "size-5",
                    validateAction === "approve"
                      ? "text-emerald-600"
                      : "text-rose-600",
                  )}
                />
                Valider la demande
              </DialogTitle>
              <DialogDescription>
                Approuvez ou refusez cette demande d&apos;absence.
              </DialogDescription>
            </DialogHeader>
          </div>

          {validateItem && (() => {
            const actingValidation =
              userId &&
              findActingValidation(
                validateItem.validations,
                userId,
                actingForDelegatorIds,
              );
            const isDelegated =
              actingValidation &&
              userId &&
              String(actingValidation.validatorUserId) !== userId;

            return (
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {isDelegated && (
                <div className="rounded-xl border border-sky-200/80 bg-sky-50/60 px-4 py-3 text-sm text-sky-900">
                  Vous validez en délégation de{" "}
                  <span className="font-semibold">
                    {actingValidation.fullname}
                  </span>
                  .
                </div>
              )}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--inp-vert)]/10">
                    <UserIcon className="size-5 text-[var(--inp-vert)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {validateItem.firstname} {validateItem.lastname}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {validateItem.raison} · {validateItem.duree} jour
                      {validateItem.duree > 1 ? "s" : ""} ouvré
                      {validateItem.duree > 1 ? "s" : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDay(validateItem.dateDepart)} →{" "}
                      {formatDay(validateItem.dateFin)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Votre décision</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValidateAction("approve")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                      validateAction === "approve"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/30"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    <CheckCircle2Icon className="size-4" />
                    Approuver
                  </button>
                  <button
                    type="button"
                    onClick={() => setValidateAction("reject")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                      validateAction === "reject"
                        ? "border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500/30"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    <CircleXIcon className="size-4" />
                    Refuser
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validate-comment">
                  Commentaire
                  {validateAction === "reject" ? " *" : " (optionnel)"}
                </Label>
                <textarea
                  id="validate-comment"
                  value={validateComment}
                  onChange={(e) => setValidateComment(e.target.value)}
                  placeholder="Votre avis ou justification…"
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>
            </div>
            );
          })()}

          <DialogFooter className="border-t bg-muted/20 px-6 py-4">
            <Button variant="outline" onClick={() => setValidateItem(null)}>
              Annuler
            </Button>
            <Button
              onClick={handleValidate}
              disabled={submitting}
              className={cn(
                "text-white",
                validateAction === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700",
              )}
            >
              {submitting && <Loader2Icon className="size-4 animate-spin" />}
              {validateAction === "approve" ? "Approuver" : "Refuser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
