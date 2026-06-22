"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRightLeftIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ClipboardCheckIcon,
  ClockIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { DelegationDialog } from "@/components/dashboard/delegation-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  VALIDATION_STATUS_LABELS,
  type ValidationStatus,
} from "@/lib/constants/leave";
import { CONTRACT_LABELS } from "@/lib/constants/user-labels";
import {
  USER_ROLE_LABELS,
  VALIDATOR_ROLE_LABELS,
} from "@/lib/permissions/roles";
import type { AbsenceRequestEntry } from "@/lib/types/absence";
import type { MySpaceData } from "@/lib/types/my-space";
import type { ValidatorDelegationEntry } from "@/lib/types/delegation";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ValidationStatus, string> = {
  en_attente: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  en_cours: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  approuvee: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  rejetee: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPeriod(startAt: string, endAt: string) {
  return `${formatDateTime(startAt)} → ${formatDateTime(endAt)}`;
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/80 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div
        className={cn(
          "pointer-events-none absolute -top-6 -right-6 size-24 rounded-full opacity-20 blur-2xl",
          accent,
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

function AbsencePreviewRow({ absence }: { absence: AbsenceRequestEntry }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/80 px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium">
          {absence.firstname} {absence.lastname}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(absence.dateDepart)} → {formatDate(absence.dateFin)} ·{" "}
          {absence.duree} j · {absence.raison}
        </p>
      </div>
      <Badge
        variant="outline"
        className={cn("shrink-0", STATUS_STYLES[absence.statutValidation])}
      >
        {VALIDATION_STATUS_LABELS[absence.statutValidation]}
      </Badge>
    </div>
  );
}

function DelegationCard({
  item,
  variant,
}: {
  item: ValidatorDelegationEntry;
  variant: "given" | "received";
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/80 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10">
          <UserCheckIcon className="size-4 text-[var(--inp-vert)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            {variant === "given" ? item.delegateFullname : item.delegatorFullname}
          </p>
          <Badge variant="outline" className="mt-1 text-[10px]">
            {variant === "given" ? "Remplaçant" : "Titulaire"}
          </Badge>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="size-3.5 shrink-0" />
            {formatPeriod(item.startAt, item.endAt)}
          </p>
          {item.reason && (
            <p className="mt-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              {item.reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function MySpacePage() {
  const [data, setData] = useState<MySpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [delegationOpen, setDelegationOpen] = useState(false);

  const loadSpace = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me/space");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setData(json);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de charger votre espace",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpace();
  }, [loadSpace]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-12 text-center text-muted-foreground">
        Impossible de charger votre espace.
      </div>
    );
  }

  const { profile, leaveBalance, validators, delegations, counts } = data;
  const initials = `${profile.firstname[0] ?? ""}${profile.lastname[0] ?? ""}`.toUpperCase();
  const contractLabel =
    profile.contractType &&
    CONTRACT_LABELS[profile.contractType as keyof typeof CONTRACT_LABELS];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-[var(--inp-vert)]/10 via-background to-background shadow-sm">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="size-20 rounded-2xl ring-2 ring-[var(--inp-vert)]/20">
            <AvatarImage src={profile.avatar} alt={`${profile.firstname} ${profile.lastname}`} />
            <AvatarFallback className="rounded-2xl bg-[var(--inp-beige)] text-xl font-bold text-[var(--inp-vert)]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {profile.firstname} {profile.lastname}
              </h2>
              <Badge className="bg-[var(--inp-vert)] text-white hover:bg-[var(--inp-vert)]">
                {USER_ROLE_LABELS[profile.role]}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">{profile.occupation}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MailIcon className="size-4" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <PhoneIcon className="size-4" />
                  {profile.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="size-4" />
                {profile.section}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => setDelegationOpen(true)}
          >
            <ArrowRightLeftIcon className="size-4" />
            Déléguer mes validations
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Solde congés"
          value={leaveBalance.available}
          hint={`${leaveBalance.accrued} acquis · ${leaveBalance.consumed} consommés`}
          icon={CalendarDaysIcon}
          accent="bg-emerald-400"
        />
        <StatCard
          title="À valider"
          value={counts.toValidate}
          hint="Demandes en attente de votre action"
          icon={ClipboardCheckIcon}
          accent="bg-sky-400"
        />
        <StatCard
          title="Mes demandes en cours"
          value={counts.myPendingAbsences}
          hint="Absences soumises, non finalisées"
          icon={ClockIcon}
          accent="bg-amber-400"
        />
        <StatCard
          title="Délégations actives"
          value={counts.activeDelegationsGiven + counts.activeDelegationsReceived}
          hint={`${counts.activeDelegationsGiven} données · ${counts.activeDelegationsReceived} reçues`}
          icon={ArrowRightLeftIcon}
          accent="bg-violet-400"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border/60 bg-muted/15 p-5">
          <div className="flex items-center gap-2">
            <UserIcon className="size-5 text-[var(--inp-vert)]" />
            <h3 className="text-lg font-semibold">Informations</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem icon={BriefcaseIcon} label="Poste" value={profile.occupation} />
            <InfoItem icon={BriefcaseIcon} label="Service" value={profile.service} />
            <InfoItem icon={BriefcaseIcon} label="Direction" value={profile.direction} />
            <InfoItem icon={MapPinIcon} label="Section / région" value={profile.section} />
            <InfoItem icon={UserIcon} label="Matricule" value={profile.matricule} />
            <InfoItem icon={BriefcaseIcon} label="Grade" value={profile.grade} />
            <InfoItem
              icon={CalendarDaysIcon}
              label="Contrat"
              value={
                contractLabel
                  ? `${contractLabel}${profile.contractYear ? ` (${profile.contractYear})` : ""}`
                  : undefined
              }
            />
            <InfoItem
              icon={CalendarDaysIcon}
              label="Date d'embauche"
              value={profile.hireDate ? formatDate(profile.hireDate) : undefined}
            />
            <InfoItem icon={MapPinIcon} label="Ville" value={profile.city} />
            <InfoItem
              icon={ClockIcon}
              label="Dernière connexion"
              value={
                profile.lastLoginAt
                  ? formatDateTime(profile.lastLoginAt)
                  : undefined
              }
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/60 bg-muted/15 p-5">
          <div className="flex items-center gap-2">
            <UserCheckIcon className="size-5 text-[var(--inp-vert)]" />
            <h3 className="text-lg font-semibold">Mes validateurs</h3>
          </div>
          {validators.length === 0 ? (
            <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              Aucun validateur assigné à votre profil.
            </p>
          ) : (
            <ul className="space-y-2">
              {validators.map((validator) => (
                <li
                  key={`${validator.userId}-${validator.level}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/80 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {validator.user
                        ? `${validator.user.firstname} ${validator.user.lastname}`
                        : "Validateur"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {validator.user?.occupation}
                      {validator.user?.email ? ` · ${validator.user.email}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge variant="outline">Niveau {validator.level}</Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {VALIDATOR_ROLE_LABELS[validator.role]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="space-y-4 rounded-2xl border border-border/60 bg-muted/15 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeftIcon className="size-5 text-[var(--inp-vert)]" />
            <h3 className="text-lg font-semibold">Délégations</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => setDelegationOpen(true)}>
            Gérer
          </Button>
        </div>

        {delegations.received.length > 0 && (
          <div className="rounded-xl border border-sky-200/70 bg-sky-50/50 px-4 py-3 text-sm text-sky-950">
            Vous validez actuellement en délégation pour{" "}
            <strong>
              {delegations.received.map((d) => d.delegatorFullname).join(", ")}
            </strong>
            .
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Délégations données
            </h4>
            {delegations.given.length === 0 ? (
              <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                Aucune délégation active
              </p>
            ) : (
              delegations.given.map((item) => (
                <DelegationCard key={item._id} item={item} variant="given" />
              ))
            )}
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Délégations reçues
            </h4>
            {delegations.received.length === 0 ? (
              <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                Aucune délégation reçue
              </p>
            ) : (
              delegations.received.map((item) => (
                <DelegationCard key={item._id} item={item} variant="received" />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border/60 bg-muted/15 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardCheckIcon className="size-5 text-[var(--inp-vert)]" />
            <h3 className="text-lg font-semibold">Demandes à valider</h3>
          </div>
          <Link
            href="/dashboard/absences?scope=to-validate"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Voir tout
          </Link>
        </div>
        {data.toValidate.length === 0 ? (
          <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Aucune demande en attente de validation.
          </p>
        ) : (
          <div className="space-y-2">
            {data.toValidate.map((absence) => (
              <AbsencePreviewRow key={absence._id} absence={absence} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-border/60 bg-muted/15 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="size-5 text-[var(--inp-vert)]" />
            <h3 className="text-lg font-semibold">Mes dernières absences</h3>
          </div>
          <Link
            href="/dashboard/absences"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Voir tout
          </Link>
        </div>
        {data.recentAbsences.length === 0 ? (
          <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Aucune demande d&apos;absence enregistrée.
          </p>
        ) : (
          <div className="space-y-2">
            {data.recentAbsences.map((absence) => (
              <AbsencePreviewRow key={absence._id} absence={absence} />
            ))}
          </div>
        )}
      </section>

      <DelegationDialog
        open={delegationOpen}
        onOpenChange={setDelegationOpen}
        onChanged={loadSpace}
        currentUserId={profile._id}
      />
    </div>
  );
}
