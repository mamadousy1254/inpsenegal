"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRightIcon,
  ArrowRightLeftIcon,
  CalendarClockIcon,
  InfoIcon,
  Loader2Icon,
  SearchIcon,
  Trash2Icon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { NotificationChannelPicker } from "@/components/dashboard/notification-channel-picker";
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
import { USER_ROLE_LABELS, type UserRole } from "@/lib/permissions/roles";
import type { NotifierChannel } from "@/lib/constants/notifications";
import type {
  DelegationCandidate,
  ValidatorDelegationEntry,
} from "@/lib/types/delegation";
import { cn } from "@/lib/utils";

type DelegationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
  currentUserId?: string;
};

const SELECT_IN_DIALOG_PROPS = {
  side: "bottom" as const,
  alignItemWithTrigger: false,
  className: "z-[200] max-h-64",
};

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatPeriod(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const fmt = (d: Date) =>
    d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${fmt(start)} → ${fmt(end)}`;
}

function roleLabel(role: string): string {
  return USER_ROLE_LABELS[role as UserRole] ?? role;
}

function formatCandidateOption(user: DelegationCandidate): string {
  return `${user.firstname} ${user.lastname} — ${user.occupation}`;
}

function formatCandidateTrigger(user: DelegationCandidate): string {
  return `${user.firstname} ${user.lastname}`;
}

function filterCandidates(
  users: DelegationCandidate[],
  query: string,
): DelegationCandidate[] {
  const q = query.trim().toLowerCase();
  if (!q) return users;

  return users.filter((user) => {
    const haystack = [
      user.firstname,
      user.lastname,
      user.email,
      user.occupation,
      roleLabel(user.role),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

function UserSelectField({
  id,
  label,
  hint,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  searchable,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: DelegationCandidate[];
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
}) {
  const [search, setSearch] = useState("");
  const selected = options.find((user) => user._id === value);
  const filtered = useMemo(
    () => filterCandidates(options, search),
    [options, search],
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value || null}
        onValueChange={(next) => {
          if (next !== null) onChange(next);
        }}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="h-10 w-full bg-background">
          <UserIcon className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder={placeholder}>
            {selected ? formatCandidateTrigger(selected) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent {...SELECT_IN_DIALOG_PROPS}>
          {searchable && options.length > 6 && (
            <div className="sticky top-0 z-10 border-b bg-popover p-2">
              <div className="relative">
                <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un agent…"
                  className="h-8 pl-8 text-xs"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">
              Aucun agent trouvé
            </p>
          ) : (
            filtered.map((user) => (
              <SelectItem key={user._id} value={user._id}>
                <div className="flex min-w-0 flex-col gap-0.5 py-0.5">
                  <span className="font-medium">
                    {formatCandidateOption(user)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {roleLabel(user.role)} · {user.email}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {selected && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-3 py-2">
          <Badge variant="outline" className="text-[10px]">
            {roleLabel(selected.role)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {selected.occupation}
          </span>
        </div>
      )}
      {hint && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

export function DelegationDialog({
  open,
  onOpenChange,
  onChanged,
  currentUserId,
}: DelegationDialogProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [given, setGiven] = useState<ValidatorDelegationEntry[]>([]);
  const [received, setReceived] = useState<ValidatorDelegationEntry[]>([]);
  const [candidates, setCandidates] = useState<DelegationCandidate[]>([]);
  const [titularCandidates, setTitularCandidates] = useState<
    DelegationCandidate[]
  >([]);
  const [canManageForOthers, setCanManageForOthers] = useState(false);

  const [delegatorUserId, setDelegatorUserId] = useState("");
  const [delegateUserId, setDelegateUserId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [reason, setReason] = useState("");
  const [notifyChannel, setNotifyChannel] = useState<NotifierChannel>("email");

  const effectiveDelegatorId =
    canManageForOthers && delegatorUserId
      ? delegatorUserId
      : currentUserId ?? "";

  const delegateOptions = useMemo(
    () => candidates.filter((user) => user._id !== effectiveDelegatorId),
    [candidates, effectiveDelegatorId],
  );

  const fetchDelegationsRef = useRef<() => Promise<void>>(() =>
    Promise.resolve(),
  );

  fetchDelegationsRef.current = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/delegations");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      setGiven(data.given ?? []);
      setReceived(data.received ?? []);
      setCandidates(data.candidates ?? []);
      setTitularCandidates(data.titularCandidates ?? []);
      setCanManageForOthers(Boolean(data.canManageForOthers));

      if (data.canManageForOthers && currentUserId) {
        setDelegatorUserId(currentUserId);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de charger les délégations",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const now = new Date();
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);
    setStartAt(toLocalInputValue(now));
    setEndAt(toLocalInputValue(weekLater));
    setDelegatorUserId("");
    setDelegateUserId("");
    setReason("");
    setNotifyChannel("email");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    void fetchDelegationsRef.current();
  }, [open, currentUserId]);

  useEffect(() => {
    if (delegateUserId && delegateUserId === effectiveDelegatorId) {
      setDelegateUserId("");
    }
  }, [delegateUserId, effectiveDelegatorId]);

  async function handleCreate() {
    if (!delegateUserId || !startAt || !endAt) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (canManageForOthers && !delegatorUserId) {
      toast.error("Veuillez sélectionner le titulaire");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, string> = {
        delegateUserId,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        reason,
        notifyChannel,
      };

      if (canManageForOthers && delegatorUserId) {
        payload.delegatorUserId = delegatorUserId;
      }

      const res = await fetch("/api/delegations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      toast.success("Délégation créée — le remplaçant a été notifié");
      setDelegateUserId("");
      setReason("");
      await fetchDelegationsRef.current();
      onChanged?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Révoquer cette délégation ?")) return;

    const res = await fetch(`/api/delegations/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Erreur");
      return;
    }

    toast.success("Délégation révoquée");
    await fetchDelegationsRef.current();
    onChanged?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="border-b bg-gradient-to-br from-[var(--inp-vert)]/10 via-background to-background px-6 py-5">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ArrowRightLeftIcon className="size-5 text-[var(--inp-vert)]" />
              Délégation de validation
            </DialogTitle>
            <DialogDescription className="pt-1 leading-relaxed">
              Transférez temporairement vos droits de validation des absences à
              un autre agent. La délégation prend fin automatiquement à la date
              indiquée.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div className="flex gap-3 rounded-xl border border-sky-200/70 bg-sky-50/50 px-4 py-3 text-sm text-sky-950">
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            <p className="leading-relaxed">
              Le remplaçant sera notifié par le canal choisi et pourra valider
              depuis l&apos;onglet <strong>À valider</strong>. Tout agent actif
              peut être choisi, y compris un employé.
            </p>
          </div>

          <section className="space-y-4 rounded-2xl border border-border/60 bg-muted/15 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
                <UserCheckIcon className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Nouvelle délégation</h3>
                <p className="text-xs text-muted-foreground">
                  Définissez le titulaire, le remplaçant et la période
                </p>
              </div>
            </div>

            <div
              className={cn(
                "grid gap-4",
                canManageForOthers && "sm:grid-cols-[1fr_auto_1fr] sm:items-end",
              )}
            >
              {canManageForOthers ? (
                <>
                  <UserSelectField
                    id="delegation-titular"
                    label="Titulaire"
                    hint="Agent dont les validations seront déléguées."
                    value={delegatorUserId}
                    onChange={setDelegatorUserId}
                    options={titularCandidates}
                    placeholder="Choisir le titulaire"
                    disabled={loading}
                    searchable
                  />
                  <div className="hidden justify-center pb-2 sm:flex">
                    <div className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm">
                      <ArrowRightIcon className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                  <UserSelectField
                    id="delegation-delegate"
                    label="Remplaçant"
                    hint="Agent qui validera à la place du titulaire."
                    value={delegateUserId}
                    onChange={setDelegateUserId}
                    options={delegateOptions}
                    placeholder="Choisir le remplaçant"
                    disabled={loading || !delegatorUserId}
                    searchable
                  />
                </>
              ) : (
                <UserSelectField
                  id="delegation-delegate"
                  label="Remplaçant"
                  hint="Choisissez l'agent qui vous remplacera pendant votre absence."
                  value={delegateUserId}
                  onChange={setDelegateUserId}
                  options={delegateOptions}
                  placeholder="Choisir le remplaçant"
                  disabled={loading}
                  searchable
                />
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="delegation-start"
                  className="flex items-center gap-1.5"
                >
                  <CalendarClockIcon className="size-3.5 text-muted-foreground" />
                  Début
                </Label>
                <Input
                  id="delegation-start"
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="delegation-end"
                  className="flex items-center gap-1.5"
                >
                  <CalendarClockIcon className="size-3.5 text-muted-foreground" />
                  Fin
                </Label>
                <Input
                  id="delegation-end"
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delegation-reason">Motif (optionnel)</Label>
              <Input
                id="delegation-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Congés, mission, formation…"
                className="bg-background"
              />
            </div>

            <NotificationChannelPicker
              id="delegation-notify-channel"
              value={notifyChannel}
              onChange={setNotifyChannel}
              label="Notifier le remplaçant"
              description="Canal utilisé pour informer le remplaçant de sa délégation. En cas d'échec, l'autre canal est tenté automatiquement."
              disabled={loading || submitting}
            />
          </section>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <DelegationList
                title="Délégations données"
                emptyLabel="Aucune délégation active"
                items={given}
                onRevoke={handleRevoke}
                variant="given"
              />
              <DelegationList
                title="Délégations reçues"
                emptyLabel="Aucune délégation reçue"
                items={received}
                variant="received"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t bg-muted/20 px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button
            onClick={handleCreate}
            disabled={submitting || loading}
            className="bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
          >
            {submitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Création…
              </>
            ) : (
              "Créer la délégation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DelegationList({
  title,
  emptyLabel,
  items,
  onRevoke,
  variant,
}: {
  title: string;
  emptyLabel: string;
  items: ValidatorDelegationEntry[];
  onRevoke?: (id: string) => void;
  variant: "given" | "received";
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item._id}
              className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10">
                      <UserCheckIcon className="size-4 text-[var(--inp-vert)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {variant === "given"
                          ? item.delegateFullname
                          : item.delegatorFullname}
                      </p>
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {variant === "given"
                          ? "Remplaçant"
                          : "Titulaire"}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarClockIcon className="size-3.5 shrink-0" />
                    {formatPeriod(item.startAt, item.endAt)}
                  </p>
                  {item.reason && (
                    <p className="mt-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                      {item.reason}
                    </p>
                  )}
                </div>
                {onRevoke && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => onRevoke(item._id)}
                    title="Révoquer"
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
