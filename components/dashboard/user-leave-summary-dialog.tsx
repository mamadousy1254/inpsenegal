"use client";

import { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  Loader2Icon,
  StethoscopeIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ABSENCE_TYPE_LABELS,
  VALIDATION_STATUS_LABELS,
} from "@/lib/constants/leave";
import type { DashboardUser } from "@/lib/types/dashboard-user";
import type { UserLeaveSummary } from "@/lib/types/absence";
import { cn } from "@/lib/utils";

type UserLeaveSummaryDialogProps = {
  user: DashboardUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ApiResponse = {
  user: {
    firstname: string;
    lastname: string;
    email: string;
    occupation: string;
    contractType?: string;
    contractYear?: number;
    hireDate?: string;
  };
  summary: UserLeaveSummary;
  setup: { ok: true } | { ok: false; missingFields: string[] };
};

const STATUS_STYLES = {
  en_attente: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  en_cours: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  approuvee: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  rejetee: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
} as const;

function formatDay(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function UserLeaveSummaryDialog({
  user,
  open,
  onOpenChange,
}: UserLeaveSummaryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/users/${user._id}/leave-summary`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erreur");
        if (!cancelled) setData(json as ApiResponse);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur");
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const fullname = user ? `${user.firstname} ${user.lastname}` : "";
  const summary = data?.summary;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="border-b bg-gradient-to-br from-[var(--inp-vert)]/8 via-background to-background px-6 py-5">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarDaysIcon className="size-5 text-[var(--inp-vert)]" />
              Congés & absences
            </DialogTitle>
            <DialogDescription>
              {fullname}
              {user?.email ? ` · ${user.email}` : ""}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 py-5">
            {loading && (
              <div className="flex min-h-48 items-center justify-center">
                <Loader2Icon className="size-8 animate-spin text-[var(--inp-vert)]" />
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            {summary && !loading && (
              <>
                {!data.setup.ok && (
                  <div className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
                    <p className="font-medium">Solde non calculable</p>
                    <p className="mt-1 text-amber-900/90">
                      Complétez la fiche employé :{" "}
                      {data.setup.missingFields.join(", ")}. Sans ces
                      informations, les jours acquis restent à 0.
                    </p>
                  </div>
                )}

                {data.setup.ok &&
                  summary.balance.accrued === 0 &&
                  summary.stats.totalRequests === 0 && (
                    <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                      Solde initialisé — aucune absence enregistrée pour le moment.
                      {data.user.hireDate && (
                        <span className="mt-1 block">
                          Embauche :{" "}
                          {new Date(data.user.hireDate).toLocaleDateString(
                            "fr-FR",
                          )}
                        </span>
                      )}
                    </div>
                  )}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      label: "Jours acquis",
                      value: summary.balance.accrued,
                      className: "border-sky-100 bg-sky-50/50",
                    },
                    {
                      label: "Jours pris (solde)",
                      value: summary.balance.consumed,
                      className: "border-amber-100 bg-amber-50/50",
                    },
                    {
                      label: "Solde disponible",
                      value: summary.balance.available,
                      className: "border-emerald-100 bg-emerald-50/50",
                      highlight: summary.balance.available < 0,
                    },
                    {
                      label: "Dette",
                      value: summary.balance.debtDays ?? 0,
                      className: "border-rose-100 bg-rose-50/50",
                      highlight: (summary.balance.debtDays ?? 0) > 0,
                    },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className={cn(
                        "rounded-xl border p-4",
                        card.className,
                        card.highlight && "ring-1 ring-rose-300/60",
                      )}
                    >
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold tabular-nums">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>

                {(summary.balance.contractYear || summary.balance.contractType) && (
                  <p className="text-xs text-muted-foreground">
                    Contrat{" "}
                    {summary.balance.contractYear ?? data?.user.contractYear ?? "—"}
                    {summary.balance.contractType || data?.user.contractType
                      ? ` · ${(summary.balance.contractType ?? data?.user.contractType)?.toUpperCase()}`
                      : ""}
                  </p>
                )}

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">Synthèse des demandes</h3>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <StatPill
                      icon={CalendarDaysIcon}
                      label="Demandes totales"
                      value={summary.stats.totalRequests}
                    />
                    <StatPill
                      icon={ClockIcon}
                      label="En attente"
                      value={summary.stats.pending}
                    />
                    <StatPill
                      icon={CalendarDaysIcon}
                      label="Jours déduits du solde"
                      value={summary.stats.daysDeductedFromBalance}
                    />
                    <StatPill
                      icon={StethoscopeIcon}
                      label="Jours maladie (non déduits)"
                      value={summary.stats.daysMedicalOrExempt}
                    />
                    <StatPill
                      icon={CalendarIcon}
                      label="Approuvées"
                      value={summary.stats.approved}
                    />
                    <StatPill
                      icon={CalendarIcon}
                      label="Refusées"
                      value={summary.stats.rejected}
                    />
                  </div>
                </section>

                {summary.monthlyBreakdown.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold">Détail mensuel</h3>
                    <div className="overflow-hidden rounded-xl border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                          <tr>
                            <th className="px-4 py-2.5 font-medium">Mois</th>
                            <th className="px-4 py-2.5 font-medium">Acquis</th>
                            <th className="px-4 py-2.5 font-medium">Pris</th>
                            <th className="px-4 py-2.5 font-medium">Reste</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary.monthlyBreakdown.map((row) => (
                            <tr
                              key={`${row.year}-${row.month}`}
                              className="border-t border-border/60"
                            >
                              <td className="px-4 py-2.5 capitalize">{row.label}</td>
                              <td className="px-4 py-2.5 tabular-nums">{row.accrued}</td>
                              <td className="px-4 py-2.5 tabular-nums">{row.consumed}</td>
                              <td
                                className={cn(
                                  "px-4 py-2.5 tabular-nums font-medium",
                                  row.available < 0 && "text-rose-600",
                                )}
                              >
                                {row.available}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold">
                    Historique des absences ({summary.absences.length})
                  </h3>
                  {summary.absences.length === 0 ? (
                    <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                      Aucune demande enregistrée
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {summary.absences.map((item) => (
                        <div
                          key={item._id}
                          className="rounded-xl border border-border/60 bg-card p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">{item.raison}</p>
                              <p className="text-xs text-muted-foreground">
                                {ABSENCE_TYPE_LABELS[item.absenceType]} · {item.duree}{" "}
                                jour{item.duree > 1 ? "s" : ""} ouvré
                                {item.duree > 1 ? "s" : ""}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "shrink-0 ring-1 ring-inset",
                                STATUS_STYLES[item.statutValidation],
                              )}
                            >
                              {VALIDATION_STATUS_LABELS[item.statutValidation]}
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {formatDay(item.dateDepart)} → {formatDay(item.dateFin)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background">
        <Icon className="size-4 text-[var(--inp-vert)]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-lg font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}
