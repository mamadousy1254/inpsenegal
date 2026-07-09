"use client";

import type { ReactNode } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  Loader2Icon,
  MapPinIcon,
  Trash2Icon,
} from "lucide-react";

import { MissionStatusBadge } from "@/components/dashboard/missions/mission-status-badge";
import { MissionTypeBadge } from "@/components/dashboard/missions/mission-type-badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SerializedMission } from "@/lib/services/mission/serialize-mission";
import { cn } from "@/lib/utils";

function formatDay(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function resolveChefName(mission: SerializedMission): string {
  const chef = mission.missionnaires.find((m) => m.userId === mission.chefMissionId);
  return chef?.fullname ?? "—";
}

function formatBudget(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

type MissionsTableProps = {
  items: SerializedMission[];
  loading: boolean;
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView?: (mission: SerializedMission) => void;
  onDelete?: (mission: SerializedMission) => void;
  canDelete?: (mission: SerializedMission) => boolean;
  filters?: ReactNode;
};

export function MissionsTable({
  items,
  loading,
  page,
  total,
  totalPages,
  onPageChange,
  onView,
  onDelete,
  canDelete,
  filters,
}: MissionsTableProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {filters && (
        <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-4">
          {filters}
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2Icon className="size-5 animate-spin" />
            Chargement des missions…
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            Aucune mission trouvée pour ces critères.
          </div>
        ) : (
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">N° mission</th>
                <th className="px-5 py-3 font-medium">Objet</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Destination</th>
                <th className="px-5 py-3 font-medium">Période</th>
                <th className="px-5 py-3 font-medium">Chef</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 text-right font-medium">Budget</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((mission) => (
                <tr key={mission._id} className="group transition-colors hover:bg-muted/20">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-[var(--inp-vert)]">
                    {mission.numero}
                  </td>
                  <td className="px-5 py-4">
                    <p className="line-clamp-2 max-w-[280px] font-medium">{mission.objet}</p>
                    {mission.direction && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {mission.direction}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <MissionTypeBadge type={mission.type} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex max-w-[220px] items-start gap-1.5">
                      <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2">{mission.destinationLabel}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div>{formatDay(mission.dateDepart)}</div>
                    <div className="text-xs text-muted-foreground">
                      → {formatDay(mission.dateRetour)}
                      {mission.dureeCalculee > 0 && (
                        <span className="ml-1">({mission.dureeCalculee} j)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">{resolveChefName(mission)}</td>
                  <td className="px-5 py-4">
                    <MissionStatusBadge status={mission.status} />
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">
                    <div>{formatBudget(mission.budget.budgetPrevu)}</div>
                    {mission.budget.budgetConsomme > 0 && (
                      <div className="text-xs text-muted-foreground">
                        consommé {formatBudget(mission.budget.budgetConsomme)}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-0.5">
                      {onView && (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="size-8 rounded-lg text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-950/40"
                                onClick={() => onView(mission)}
                              />
                            }
                          >
                            <EyeIcon className="size-4" />
                            <span className="sr-only">Voir la mission</span>
                          </TooltipTrigger>
                          <TooltipContent side="top">Voir la mission</TooltipContent>
                        </Tooltip>
                      )}
                      {onDelete && canDelete?.(mission) && (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className={cn(
                                  "size-8 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40",
                                )}
                                onClick={() => onDelete(mission)}
                              />
                            }
                          >
                            <Trash2Icon className="size-4" />
                            <span className="sr-only">Supprimer</span>
                          </TooltipTrigger>
                          <TooltipContent side="top">Supprimer</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {total.toLocaleString("fr-FR")} résultat{total > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeftIcon className="size-4" />
            Précédent
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
          >
            Suivant
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
