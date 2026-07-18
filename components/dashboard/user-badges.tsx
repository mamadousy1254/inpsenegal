import {
  CircleCheckIcon,
  MapPinIcon,
  UserXIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { USER_ROLE_LABELS, type UserRole } from "@/lib/permissions/roles";

export const ROLE_STYLES: Record<
  UserRole,
  { badge: string; dot: string }
> = {
  super_admin: {
    badge: "border-purple-200 bg-purple-50 text-purple-800",
    dot: "bg-purple-500",
  },
  admin: {
    badge: "border-indigo-200 bg-indigo-50 text-indigo-800",
    dot: "bg-indigo-500",
  },
  directeur: {
    badge: "border-violet-200 bg-violet-50 text-violet-900",
    dot: "bg-violet-600",
  },
  rh: {
    badge: "border-blue-200 bg-blue-50 text-blue-800",
    dot: "bg-blue-500",
  },
  manager: {
    badge: "border-amber-200 bg-amber-50 text-amber-900",
    dot: "bg-amber-500",
  },
  employe: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
  },
  chauffeur: {
    badge: "border-lime-200 bg-lime-50 text-lime-800",
    dot: "bg-lime-500",
  },
  pdcvr: {
    badge: "border-cyan-200 bg-cyan-50 text-cyan-800",
    dot: "bg-cyan-500",
  },
  aat: {
    badge: "border-sky-200 bg-sky-50 text-sky-800",
    dot: "bg-sky-500",
  },
  directeur_technique: {
    badge: "border-orange-200 bg-orange-50 text-orange-900",
    dot: "bg-orange-500",
  },
  chercheur: {
    badge: "border-teal-200 bg-teal-50 text-teal-800",
    dot: "bg-teal-500",
  },
  redacteur: {
    badge: "border-pink-200 bg-pink-50 text-pink-800",
    dot: "bg-pink-500",
  },
  partenaire: {
    badge: "border-slate-200 bg-slate-50 text-slate-700",
    dot: "bg-slate-400",
  },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const style = ROLE_STYLES[role];
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 px-2 py-0.5 font-medium", style.badge)}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {USER_ROLE_LABELS[role]}
    </Badge>
  );
}

export function StatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-emerald-200 bg-emerald-50 px-2 text-emerald-800"
      >
        <CircleCheckIcon className="size-3 fill-emerald-500 text-emerald-50" />
        Actif
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 border-rose-200 bg-rose-50 px-2 text-rose-800"
    >
      <UserXIcon className="size-3 text-rose-600" />
      Inactif
    </Badge>
  );
}

export function SectionBadge({ section }: { section: string }) {
  return (
    <Badge
      variant="outline"
      className="gap-1 border-orange-200 bg-orange-50 px-2 text-orange-900"
    >
      <MapPinIcon className="size-3 text-orange-600" />
      {section}
    </Badge>
  );
}
