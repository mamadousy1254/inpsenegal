"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightIcon,
  ArrowRightLeftIcon,
  InfoIcon,
  LayersIcon,
  Loader2Icon,
  PlusIcon,
  ShieldIcon,
  Trash2Icon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleBadge } from "@/components/dashboard/user-badges";
import type { DashboardUser } from "@/lib/types/dashboard-user";
import type {
  ValidatorAssignment,
  ValidatorFormRow,
} from "@/lib/types/validator-assignment";
import {
  USER_ROLE_LABELS,
  VALIDATOR_ROLE_LABELS,
  VALIDATOR_ROLES,
  type UserRole,
  type ValidatorRole,
} from "@/lib/permissions/roles";
import { cn } from "@/lib/utils";

type AssignValidatorsDialogProps = {
  user: DashboardUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

type CandidateUser = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  occupation: string;
  role: string;
  isActive: boolean;
};

function createRow(
  level: number,
  role: ValidatorRole = "superieur",
): ValidatorFormRow {
  return {
    key: crypto.randomUUID(),
    userId: "",
    level,
    role,
  };
}

function assignmentsToRows(validators: ValidatorAssignment[]): ValidatorFormRow[] {
  if (validators.length === 0) return [createRow(1)];

  return validators.map((validator) => ({
    key: crypto.randomUUID(),
    userId: validator.userId,
    level: validator.level,
    role: validator.role,
  }));
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] leading-snug text-muted-foreground">{children}</p>;
}

function formatDelegationPeriod(startAt: string, endAt: string): string {
  const fmt = (value: string) =>
    new Date(value).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${fmt(startAt)} → ${fmt(endAt)}`;
}

type ActiveDelegationInfo = NonNullable<
  ValidatorAssignment["activeDelegation"]
>;

function DelegationNotice({
  delegation,
  compact = false,
}: {
  delegation: ActiveDelegationInfo;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-sky-200/80 bg-sky-50/70 text-sky-950",
        compact ? "px-3 py-2" : "px-4 py-3",
      )}
    >
      <div className="flex items-start gap-2">
        <ArrowRightLeftIcon className="mt-0.5 size-4 shrink-0 text-sky-700" />
        <div className="min-w-0 space-y-1">
          <p className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
            Délégation active — validations assurées par{" "}
            <strong>{delegation.delegateFullname}</strong>
          </p>
          <p className="text-[11px] leading-relaxed text-sky-900/80">
            Titulaire : {delegation.delegatorFullname} ·{" "}
            {formatDelegationPeriod(delegation.startAt, delegation.endAt)}
          </p>
          {delegation.reason && (
            <p className="text-[11px] text-sky-900/70">
              Motif : {delegation.reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ValidatorRoleBadge({ role }: { role: ValidatorRole }) {
  const isRh = role === "rh";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 text-[10px] font-medium",
        isRh
          ? "border-blue-200 bg-blue-50 text-blue-800"
          : "border-violet-200 bg-violet-50 text-violet-800",
      )}
    >
      {isRh ? <ShieldIcon className="size-3" /> : <UserIcon className="size-3" />}
      {VALIDATOR_ROLE_LABELS[role]}
    </Badge>
  );
}

export function AssignValidatorsDialog({
  user,
  open,
  onOpenChange,
  onSaved,
}: AssignValidatorsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<ValidatorFormRow[]>([createRow(1)]);
  const [candidates, setCandidates] = useState<CandidateUser[]>([]);
  const [activeDelegations, setActiveDelegations] = useState<
    Record<string, ActiveDelegationInfo>
  >({});

  const fullname = user ? `${user.firstname} ${user.lastname}`.trim() : "";

  const availableCandidates = useMemo(
    () =>
      candidates.filter(
        (candidate) => candidate.isActive && candidate._id !== user?._id,
      ),
    [candidates, user?._id],
  );

  const candidateMap = useMemo(
    () => new Map(availableCandidates.map((c) => [c._id, c])),
    [availableCandidates],
  );

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => a.level - b.level),
    [rows],
  );

  const chainPreview = useMemo(() => {
    return sortedRows
      .filter((row) => row.userId)
      .map((row) => {
        const candidate = candidateMap.get(row.userId);
        const delegation = activeDelegations[row.userId];
        return {
          level: row.level,
          role: row.role,
          userId: row.userId,
          name: candidate
            ? `${candidate.firstname} ${candidate.lastname}`
            : "Utilisateur inconnu",
          delegation,
        };
      });
  }, [sortedRows, candidateMap, activeDelegations]);

  const refreshActiveDelegations = async (validatorUserIds: string[]) => {
    const ids = [...new Set(validatorUserIds.filter(Boolean))];
    if (ids.length === 0) {
      setActiveDelegations({});
      return;
    }

    try {
      const res = await fetch(
        `/api/delegations/active?delegatorIds=${ids.join(",")}`,
      );
      const data = await res.json();
      if (res.ok) {
        setActiveDelegations(data.delegations ?? {});
      }
    } catch {
      // Silencieux : l'aperçu reste sans délégation
    }
  };

  useEffect(() => {
    if (!open || !user) {
      setRows([createRow(1)]);
      setActiveDelegations({});
      return;
    }

    const userId = user._id;
    let cancelled = false;

    async function loadData() {
      setLoading(true);

      try {
        const [validatorsRes, usersRes] = await Promise.all([
          fetch(`/api/users/${userId}/validators`),
          fetch("/api/users"),
        ]);

        const validatorsData = await validatorsRes.json();
        const usersData = await usersRes.json();

        if (!validatorsRes.ok) {
          throw new Error(
            validatorsData.error ?? "Impossible de charger les validateurs",
          );
        }

        if (!usersRes.ok) {
          throw new Error(
            usersData.error ?? "Impossible de charger la liste des utilisateurs",
          );
        }

        if (!cancelled) {
          setCandidates(usersData.users ?? []);
          setRows(assignmentsToRows(validatorsData.validators ?? []));
          setActiveDelegations(validatorsData.activeDelegations ?? {});
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Erreur de chargement",
          );
          onOpenChange(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [open, user, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const validatorIds = rows.map((row) => row.userId).filter(Boolean);
    const timeout = window.setTimeout(() => {
      void refreshActiveDelegations(validatorIds);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [open, rows]);

  const updateRow = (key: string, patch: Partial<ValidatorFormRow>) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  };

  const addRow = () => {
    const nextLevel =
      rows.length > 0 ? Math.max(...rows.map((row) => row.level)) + 1 : 1;
    setRows((current) => [...current, createRow(nextLevel)]);
  };

  const removeRow = (key: string) => {
    setRows((current) => {
      const next = current.filter((row) => row.key !== key);
      return next.length > 0 ? next : [createRow(1)];
    });
  };

  const handleSave = async () => {
    if (!user) return;

    const payload = rows
      .filter((row) => row.userId)
      .map(({ userId, level, role }) => ({ userId, level, role }));

    const levels = payload.map((item) => item.level);
    if (new Set(levels).size !== levels.length) {
      toast.error("Chaque niveau de validation doit être unique");
      return;
    }

    const userIds = payload.map((item) => item.userId);
    if (new Set(userIds).size !== userIds.length) {
      toast.error("Un validateur ne peut être sélectionné qu'une seule fois");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/users/${user._id}/validators`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validators: payload }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "Impossible d'enregistrer les validateurs");
        return;
      }

      toast.success("Validateurs enregistrés", { description: fullname });
      onOpenChange(false);
      onSaved?.();
    } catch {
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b bg-linear-to-br from-indigo-50/80 to-white px-6 py-5 dark:from-indigo-950/20 dark:to-popover">
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            <UserCheckIcon className="size-5" />
          </div>
          <DialogTitle>Chaîne de validateurs</DialogTitle>
          <DialogDescription>
            Configurez qui doit approuver les demandes (absences, congés, etc.)
            de <strong>{fullname}</strong>, dans l&apos;ordre.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {user && (
                <div className="rounded-xl border border-indigo-200/50 bg-indigo-50/40 px-4 py-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                  <p className="text-xs font-medium tracking-wide text-indigo-800 uppercase dark:text-indigo-300">
                    Collaborateur concerné
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{fullname}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{user.email}</span>
                    <span>·</span>
                    <span>{user.occupation}</span>
                    <RoleBadge role={user.role} />
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-3">
                <div className="flex gap-2">
                  <InfoIcon className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Comment fonctionne la validation ?
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed">
                      <li>
                        <strong className="text-foreground">Niveau</strong> :
                        ordre de passage (1 = premier à valider, 2 = ensuite,
                        etc.).
                      </li>
                      <li>
                        <strong className="text-foreground">Rôle validateur</strong>{" "}
                        : nature du validateur — supérieur hiérarchique ou RH.
                      </li>
                      <li>
                        <strong className="text-foreground">Utilisateur</strong>{" "}
                        : la personne précise qui validera à ce niveau.
                      </li>
                      <li>
                        <strong className="text-foreground">Délégation</strong>{" "}
                        : si le validateur a délégué ses droits, c&apos;est le
                        remplaçant qui validera pendant la période indiquée.
                      </li>
                    </ul>
                    <p className="text-xs">
                      Exemple courant : niveau 1 = manager direct, niveau 2 =
                      agent RH.
                    </p>
                  </div>
                </div>
              </div>

              {chainPreview.some((step) => step.delegation) && (
                <div className="space-y-2">
                  {chainPreview
                    .filter((step) => step.delegation)
                    .map((step) => (
                      <DelegationNotice
                        key={`delegation-${step.userId}`}
                        delegation={step.delegation!}
                        compact
                      />
                    ))}
                </div>
              )}

              {chainPreview.length > 0 && (
                <div className="rounded-xl border bg-background px-4 py-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    <LayersIcon className="size-3.5" />
                    Aperçu de la chaîne
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-muted/50">
                      {fullname}
                    </Badge>
                    {chainPreview.map((step) => (
                      <div
                        key={`${step.level}-${step.userId}`}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <ArrowRightIcon className="size-3.5 text-muted-foreground" />
                        <div className="flex flex-col gap-1 rounded-lg border bg-muted/20 px-2 py-1">
                          <div className="flex items-center gap-1.5">
                            <span className="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                              {step.level}
                            </span>
                            <span className="text-xs font-medium">{step.name}</span>
                            <ValidatorRoleBadge role={step.role} />
                          </div>
                          {step.delegation && (
                            <p className="flex items-center gap-1 text-[10px] text-sky-800">
                              <ArrowRightLeftIcon className="size-3 shrink-0" />
                              Délégué à {step.delegation.delegateFullname}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Validateurs configurés
                </p>

                {sortedRows.map((row) => {
                  const selected = candidateMap.get(row.userId);
                  const delegation = row.userId
                    ? activeDelegations[row.userId]
                    : undefined;

                  return (
                    <div
                      key={row.key}
                      className="relative overflow-hidden rounded-xl border bg-card shadow-sm"
                    >
                      <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500" />

                      <div className="flex items-start justify-between gap-3 border-b bg-muted/20 px-4 py-3 pl-5">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                            {row.level}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Étape {row.level}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {row.level === 1
                                ? "Première validation"
                                : row.level === 2
                                  ? "Deuxième validation"
                                  : `Validation n°${row.level}`}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => removeRow(row.key)}
                          aria-label="Supprimer ce validateur"
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>

                      <div className="grid gap-4 px-4 py-4 pl-5 sm:grid-cols-3">
                        <div className="space-y-1.5">
                          <Label htmlFor={`level-${row.key}`}>Niveau</Label>
                          <input
                            id={`level-${row.key}`}
                            type="number"
                            min={1}
                            value={row.level}
                            onChange={(event) =>
                              updateRow(row.key, {
                                level: Math.max(
                                  1,
                                  Number(event.target.value) || 1,
                                ),
                              })
                            }
                            className="flex h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-500/20 dark:bg-input/30"
                          />
                          <FieldHint>
                            Position dans la chaîne. Le niveau 1 est toujours
                            traité en premier.
                          </FieldHint>
                        </div>

                        <div className="space-y-1.5">
                          <Label>Rôle validateur</Label>
                          <Select
                            value={row.role}
                            onValueChange={(value) =>
                              updateRow(row.key, { role: value as ValidatorRole })
                            }
                            items={VALIDATOR_ROLES.map((role) => ({
                              label: VALIDATOR_ROLE_LABELS[role],
                              value: role,
                            }))}
                          >
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder="Choisir un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {VALIDATOR_ROLES.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {VALIDATOR_ROLE_LABELS[role]}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FieldHint>
                            Supérieur = manager / responsable. RH = validation
                            administrative.
                          </FieldHint>
                        </div>

                        <div className="space-y-1.5">
                          <Label>Utilisateur</Label>
                          <Select
                            value={row.userId || ""}
                            onValueChange={(value) =>
                              updateRow(row.key, { userId: value })
                            }
                            items={[
                              { label: "Sélectionner…", value: "" },
                              ...availableCandidates.map((candidate) => ({
                                label: `${candidate.firstname} ${candidate.lastname}`,
                                value: candidate._id,
                              })),
                            ]}
                          >
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder="Choisir un validateur" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="">Sélectionner…</SelectItem>
                                {availableCandidates.map((candidate) => (
                                  <SelectItem
                                    key={candidate._id}
                                    value={candidate._id}
                                  >
                                    {candidate.firstname} {candidate.lastname} —{" "}
                                    {candidate.occupation}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FieldHint>
                            Personne qui recevra la demande à ce niveau.
                          </FieldHint>
                          {selected && (
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <ValidatorRoleBadge role={row.role} />
                              <span className="text-[11px] text-muted-foreground">
                                {USER_ROLE_LABELS[selected.role as UserRole] ??
                                  selected.role}
                              </span>
                            </div>
                          )}
                          {delegation && (
                            <div className="mt-2">
                              <DelegationNotice delegation={delegation} compact />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-10 w-full gap-2 border-dashed"
                onClick={addRow}
              >
                <PlusIcon className="size-4" />
                Ajouter une étape de validation
              </Button>

              <p className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                Les lignes sans utilisateur sélectionné seront ignorées. Chaque
                niveau et chaque personne ne peuvent apparaître qu&apos;une seule
                fois.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t bg-muted/20 px-6 py-4 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            disabled={loading || saving}
            className="bg-indigo-600 text-white hover:bg-indigo-600/90"
            onClick={handleSave}
          >
            {saving ? (
              <>
                <Loader2Icon className="animate-spin" />
                Enregistrement…
              </>
            ) : (
              <>
                <UserCheckIcon />
                Enregistrer la chaîne
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
