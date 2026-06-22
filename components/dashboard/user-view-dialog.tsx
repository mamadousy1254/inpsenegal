"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  AwardIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  CreditCardIcon,
  FlagIcon,
  HashIcon,
  HeartIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
  PhoneIcon,
  ShieldIcon,
  StickyNoteIcon,
  UserIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  RoleBadge,
  SectionBadge,
  StatusBadge,
} from "@/components/dashboard/user-badges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CONTRACT_LABELS,
  GENDER_LABELS,
  MARITAL_LABELS,
} from "@/lib/constants/user-labels";
import type { DashboardUser } from "@/lib/types/dashboard-user";
import type { UserDetail } from "@/lib/types/user-detail";
import { cn } from "@/lib/utils";

type UserViewDialogProps = {
  userId: string | null;
  preview?: DashboardUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatDate(value?: string, withTime = false) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function getInitials(firstname: string, lastname: string) {
  return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
}

function DetailItem({
  icon: Icon,
  label,
  value,
  iconClassName,
}: {
  icon: LucideIcon;
  label: string;
  value?: string | number | null;
  iconClassName?: string;
}) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="flex gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          iconClassName ?? "text-muted-foreground",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm wrap-break-word text-foreground">{value}</p>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const visibleChildren = React.Children.toArray(children).filter(Boolean);

  if (visibleChildren.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">{visibleChildren}</div>
    </section>
  );
}

function UserViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
      <Separator />
      <div className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function UserProfileContent({ user }: { user: UserDetail }) {
  const fullName = `${user.firstname} ${user.lastname}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Avatar size="lg" className="size-14">
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={fullName} />
          ) : null}
          <AvatarFallback className="bg-[var(--inp-vert)]/10 text-base font-semibold text-[var(--inp-vert)]">
            {getInitials(user.firstname, user.lastname)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{fullName}</h2>
            <p className="text-sm text-muted-foreground">{user.occupation}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
            <StatusBadge isActive={user.isActive} />
            <SectionBadge section={user.section} />
          </div>
        </div>
      </div>

      <Separator />

      <DetailSection title="Identité">
        <DetailItem icon={MailIcon} label="E-mail" value={user.email} iconClassName="text-sky-600" />
        <DetailItem icon={UserIcon} label="Identifiant" value={user.username} iconClassName="text-[var(--inp-vert)]" />
        <DetailItem
          icon={UsersIcon}
          label="Genre"
          value={user.gender ? GENDER_LABELS[user.gender] : null}
          iconClassName="text-pink-600"
        />
        <DetailItem
          icon={CalendarIcon}
          label="Date de naissance"
          value={formatDate(user.dateOfBirth)}
          iconClassName="text-violet-600"
        />
        <DetailItem icon={FlagIcon} label="Nationalité" value={user.nationality} iconClassName="text-blue-600" />
        <DetailItem icon={CreditCardIcon} label="CNI / Passeport" value={user.nationalId} iconClassName="text-indigo-600" />
        <DetailItem
          icon={HeartIcon}
          label="Situation matrimoniale"
          value={
            user.maritalStatus ? MARITAL_LABELS[user.maritalStatus] : null
          }
          iconClassName="text-rose-500"
        />
        <DetailItem
          icon={UsersIcon}
          label="Nombre d'enfants"
          value={
            user.numberOfChildren !== undefined
              ? String(user.numberOfChildren)
              : null
          }
          iconClassName="text-orange-600"
        />
      </DetailSection>

      <DetailSection title="Coordonnées">
        <DetailItem icon={PhoneIcon} label="Téléphone principal" value={user.phone} iconClassName="text-emerald-600" />
        <DetailItem icon={PhoneCallIcon} label="Téléphone secondaire" value={user.phoneSecondary} iconClassName="text-teal-600" />
        <DetailItem icon={MapPinIcon} label="Adresse" value={user.address} iconClassName="text-orange-600" />
        <DetailItem icon={Building2Icon} label="Ville" value={user.city} iconClassName="text-blue-600" />
      </DetailSection>

      <DetailSection title="Parcours professionnel">
        <DetailItem icon={BriefcaseIcon} label="Fonction" value={user.occupation} iconClassName="text-violet-600" />
        <DetailItem icon={Building2Icon} label="Service" value={user.service} iconClassName="text-blue-600" />
        <DetailItem icon={Building2Icon} label="Direction" value={user.direction} iconClassName="text-indigo-600" />
        <DetailItem icon={HashIcon} label="Matricule" value={user.matricule} iconClassName="text-slate-600" />
        <DetailItem icon={AwardIcon} label="Grade" value={user.grade} iconClassName="text-yellow-600" />
        <DetailItem
          icon={BriefcaseIcon}
          label="Type de contrat"
          value={
            user.contractType ? CONTRACT_LABELS[user.contractType] : null
          }
          iconClassName="text-violet-600"
        />
        <DetailItem icon={CalendarIcon} label="Date d'embauche" value={formatDate(user.hireDate)} iconClassName="text-green-600" />
        {user.contractYear ? (
          <DetailItem
            icon={CalendarIcon}
            label="Année de contrat"
            value={String(user.contractYear)}
            iconClassName="text-emerald-600"
          />
        ) : null}
        <DetailItem icon={CalendarIcon} label="Date de fin" value={formatDate(user.endDate)} iconClassName="text-rose-600" />
      </DetailSection>

      <DetailSection title="Compte & sécurité">
        <DetailItem
          icon={ShieldIcon}
          label="E-mail vérifié"
          value={user.emailVerified ? "Oui" : "Non"}
          iconClassName="text-sky-600"
        />
        <DetailItem
          icon={CalendarIcon}
          label="Dernière connexion"
          value={formatDate(user.lastLoginAt, true)}
          iconClassName="text-muted-foreground"
        />
        <DetailItem
          icon={CalendarIcon}
          label="Compte créé le"
          value={formatDate(user.createdAt, true)}
          iconClassName="text-muted-foreground"
        />
        <DetailItem
          icon={CalendarIcon}
          label="Dernière modification"
          value={formatDate(user.updatedAt, true)}
          iconClassName="text-muted-foreground"
        />
      </DetailSection>

      {user.notes ? (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Notes RH
          </h3>
          <div className="flex gap-3 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <StickyNoteIcon className="mt-0.5 size-4 shrink-0 text-amber-700" />
            <p className="text-sm whitespace-pre-wrap text-foreground">
              {user.notes}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function UserViewDialog({
  userId,
  preview,
  open,
  onOpenChange,
}: UserViewDialogProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) {
      setUser(null);
      return;
    }

    let cancelled = false;

    async function fetchUser() {
      setLoading(true);

      try {
        const response = await fetch(`/api/users/${userId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Impossible de charger le profil");
        }

        if (!cancelled) {
          setUser(result.user);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Erreur lors du chargement du profil",
          );
          onOpenChange(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [open, userId, onOpenChange]);

  const previewName = preview
    ? `${preview.firstname} ${preview.lastname}`
    : "Profil utilisateur";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Fiche utilisateur</DialogTitle>
          <DialogDescription>
            {loading && !user
              ? `Chargement de ${previewName}…`
              : `Informations détaillées de ${user ? `${user.firstname} ${user.lastname}` : previewName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-5">
          {loading && !user ? (
            <UserViewSkeleton />
          ) : user ? (
            <UserProfileContent user={user} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
