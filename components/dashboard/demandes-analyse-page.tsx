"use client";

import { useCallback, useEffect, useMemo, useState, type ElementType } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ChevronRightIcon,
  FlaskConicalIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  SearchIcon,
  SproutIcon,
  TestTubesIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  ANALYSIS_REQUEST_STATUSES,
  ANALYSIS_REQUEST_STATUS_LABELS,
  ANALYSIS_SEND_MODES,
  type AnalysisRequestStatus,
} from "@/lib/constants/demande-analyse";
import type { SerializedDemandeAnalyse } from "@/lib/services/demande-analyse/serialize-demande-analyse";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AnalysisRequestStatus, string> = {
  nouvelle: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  en_cours: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  traitee: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  archivee: "bg-slate-500/10 text-slate-600 ring-slate-500/20",
};

const STATUS_ACCENT: Record<AnalysisRequestStatus, string> = {
  nouvelle: "bg-sky-500",
  en_cours: "bg-amber-500",
  traitee: "bg-emerald-500",
  archivee: "bg-slate-400",
};

function sendModeLabel(value?: string) {
  if (!value) return "—";
  return ANALYSIS_SEND_MODES.find((mode) => mode.value === value)?.label ?? value;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function InfoCard({
  icon: Icon,
  iconClassName,
  title,
  children,
  className,
}: {
  icon: ElementType;
  iconClassName: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border bg-muted/20 p-4", className)}>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
          iconClassName,
        )}
      >
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <div className="mt-1.5 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value?: string | null }) {
  if (!value?.trim()) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="shrink-0 text-xs font-medium text-muted-foreground sm:w-36">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

function StatPill({
  label,
  count,
  active,
  onClick,
  accentClass,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  accentClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-[120px] flex-1 flex-col items-start rounded-xl border px-4 py-3 text-left transition-all",
        active
          ? "border-[var(--inp-vert)]/30 bg-[var(--inp-vert)]/5 shadow-sm ring-1 ring-[var(--inp-vert)]/20"
          : "border-border bg-card hover:border-[var(--inp-vert)]/20 hover:bg-muted/30",
      )}
    >
      <span className={cn("mb-2 h-1 w-8 rounded-full", accentClass)} />
      <span className="text-2xl font-semibold tabular-nums tracking-tight">{count}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  );
}

export function DemandesAnalysePage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedDemandeAnalyse[]>([]);
  const [selected, setSelected] = useState<SerializedDemandeAnalyse | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/demandes-analyse");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les demandes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) return result;
    return result.filter((item) => {
      const haystack = [
        item.reference,
        item.firstName,
        item.lastName,
        item.email,
        item.commune,
        item.department,
        item.region,
        item.requesterType,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const status of ANALYSIS_REQUEST_STATUSES) {
      counts[status] = items.filter((item) => item.status === status).length;
    }
    return counts;
  }, [items]);

  const openDetail = (item: SerializedDemandeAnalyse) => {
    setSelected(item);
    setEditStatus(item.status);
    setAdminNotes(item.adminNotes ?? "");
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/demandes-analyse/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, adminNotes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      const data = await res.json();
      toast.success("Demande mise à jour");
      setSelected(data.item);
      void fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <FlaskConicalIcon className="size-7 text-[var(--inp-vert)]" />
            Demandes d&apos;analyse de sol
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivi des demandes soumises depuis le formulaire public.
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une demande…"
            className="pl-9"
          />
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        <StatPill
          label="Toutes"
          count={statusCounts.all ?? 0}
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
          accentClass="bg-[var(--inp-vert)]"
        />
        {ANALYSIS_REQUEST_STATUSES.map((status) => (
          <StatPill
            key={status}
            label={ANALYSIS_REQUEST_STATUS_LABELS[status]}
            count={statusCounts[status] ?? 0}
            active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
            accentClass={STATUS_ACCENT[status]}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--inp-vert)]/10">
              <FlaskConicalIcon className="size-7 text-[var(--inp-vert)]" />
            </div>
            <p className="text-sm font-medium">Aucune demande trouvée</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              {search.trim()
                ? "Essayez un autre terme de recherche ou modifiez le filtre de statut."
                : "Les nouvelles soumissions depuis /demande-analyse apparaîtront ici."}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.25 }}
                className="group relative flex cursor-pointer flex-col gap-4 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                onClick={() => openDetail(item)}
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 w-1 rounded-r-full opacity-80",
                    STATUS_ACCENT[item.status],
                  )}
                />

                <div className="flex min-w-0 flex-1 items-start gap-4 pl-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--inp-vert)] to-[#1f5c3f] text-sm font-semibold text-white shadow-sm">
                    {getInitials(item.firstName, item.lastName)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold tracking-tight">
                        {item.reference}
                      </span>
                      <Badge
                        className={cn("shrink-0 ring-1 ring-inset", STATUS_STYLES[item.status])}
                      >
                        {ANALYSIS_REQUEST_STATUS_LABELS[item.status]}
                      </Badge>
                      <Badge variant="outline" className="shrink-0 font-normal">
                        {item.requesterType}
                      </Badge>
                    </div>

                    <p className="font-medium leading-snug">
                      {item.firstName} {item.lastName}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPinIcon className="size-3.5 shrink-0" />
                        {item.commune}, {item.region}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon className="size-3.5 shrink-0" />
                        {formatShortDate(item.createdAt)}
                      </span>
                    </div>

                    {item.analysisTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {item.analysisTypes.slice(0, 2).map((type) => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className="max-w-[200px] truncate font-normal"
                          >
                            {type}
                          </Badge>
                        ))}
                        {item.analysisTypes.length > 2 && (
                          <Badge variant="secondary" className="font-normal">
                            +{item.analysisTypes.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 self-end sm:self-center sm:opacity-0 sm:transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(item);
                  }}
                >
                  Voir le détail
                  <ChevronRightIcon className="size-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
          {selected && (
            <>
              <div className="shrink-0 relative border-b bg-gradient-to-br from-[var(--inp-vert)]/10 via-background to-[var(--inp-beige)]/10 px-6 py-5">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <DialogHeader className="relative space-y-3 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn("ring-1 ring-inset", STATUS_STYLES[selected.status])}
                    >
                      {ANALYSIS_REQUEST_STATUS_LABELS[selected.status]}
                    </Badge>
                    <Badge variant="outline">{selected.requesterType}</Badge>
                  </div>
                  <DialogTitle className="font-mono text-xl tracking-tight">
                    {selected.reference}
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Demande de{" "}
                    <span className="font-medium text-foreground">
                      {selected.firstName} {selected.lastName}
                    </span>{" "}
                    · reçue le {formatDate(selected.createdAt)}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoCard
                    icon={UserIcon}
                    iconClassName="bg-sky-500/10 text-sky-700"
                    title="Demandeur"
                  >
                    <p className="font-medium text-foreground">
                      {selected.firstName} {selected.lastName}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${selected.email}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <MailIcon className="size-3.5" />
                        {selected.email}
                      </a>
                      <a
                        href={`tel:${selected.phone}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <PhoneIcon className="size-3.5" />
                        {selected.phone}
                      </a>
                    </div>
                  </InfoCard>

                  <InfoCard
                    icon={MapPinIcon}
                    iconClassName="bg-emerald-500/10 text-emerald-700"
                    title="Localisation"
                  >
                    <p>
                      {selected.commune}, {selected.department}
                      <br />
                      {selected.region}
                    </p>
                    {(selected.surface || (selected.latitude && selected.longitude)) && (
                      <p className="mt-2 text-xs">
                        {selected.surface && <span>{selected.surface} ha</span>}
                        {selected.surface && selected.latitude && selected.longitude && " · "}
                        {selected.latitude && selected.longitude && (
                          <span>
                            GPS {selected.latitude}, {selected.longitude}
                          </span>
                        )}
                      </p>
                    )}
                  </InfoCard>
                </div>

                <InfoCard
                  icon={SproutIcon}
                  iconClassName="bg-lime-500/10 text-lime-700"
                  title="Parcelle"
                >
                  <dl className="space-y-2">
                    <DetailField label="Culture prévue" value={selected.culturePlanned} />
                    <DetailField label="Culture actuelle" value={selected.cultureCurrent} />
                    <DetailField
                      label="Fertilisation"
                      value={selected.fertilisationHistory}
                    />
                    <DetailField label="Irrigation" value={selected.irrigation} />
                  </dl>
                  {selected.problem && (
                    <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-sm text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                        Problème signalé
                      </p>
                      <p className="mt-1 leading-relaxed">{selected.problem}</p>
                    </div>
                  )}
                </InfoCard>

                <InfoCard
                  icon={TestTubesIcon}
                  iconClassName="bg-violet-500/10 text-violet-700"
                  title="Analyses demandées"
                >
                  <div className="flex flex-wrap gap-2">
                    {selected.analysisTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="font-normal">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </InfoCard>

                <InfoCard
                  icon={PackageIcon}
                  iconClassName="bg-orange-500/10 text-orange-700"
                  title="Logistique"
                >
                  <dl className="space-y-2">
                    <DetailField label="Échantillons" value={selected.samplesNumber} />
                    <DetailField
                      label="Mode d'envoi"
                      value={sendModeLabel(selected.sendMode)}
                    />
                    <DetailField label="Date prévue" value={selected.depositDate} />
                  </dl>
                </InfoCard>

                <div className="rounded-xl border border-dashed bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Suivi interne
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Statut</Label>
                      <Select
                        value={editStatus}
                        onValueChange={(value) => value && setEditStatus(value)}
                      >
                        <SelectTrigger id="status" className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ANALYSIS_REQUEST_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {ANALYSIS_REQUEST_STATUS_LABELS[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <Label htmlFor="adminNotes">Notes internes</Label>
                      <textarea
                        id="adminNotes"
                        rows={4}
                        value={adminNotes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setAdminNotes(e.target.value)
                        }
                        placeholder="Observations, actions entreprises, contact téléphonique…"
                        className="flex min-h-[96px] w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)]/30 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="shrink-0 border-t bg-muted/20 px-6 py-4">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Fermer
                </Button>
                <Button
                  className="bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
                  onClick={() => void handleSave()}
                  disabled={saving}
                >
                  {saving && <Loader2Icon className="size-4 animate-spin" />}
                  Enregistrer le suivi
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
