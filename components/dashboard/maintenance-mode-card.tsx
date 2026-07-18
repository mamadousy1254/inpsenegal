"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Loader2Icon,
  ConstructionIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { canManageMaintenance } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { cn } from "@/lib/utils";

export function MaintenanceModeCard() {
  const { data: session } = useSession();
  const role = session?.user?.role as UserRole | undefined;
  const canManage = role ? canManageMaintenance(role) : false;

  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!canManage) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/site-settings/maintenance");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEnabled(Boolean(data.maintenanceEnabled));
    } catch {
      toast.error("Impossible de charger le statut de maintenance");
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  if (!canManage) return null;

  const toggle = async () => {
    const next = !enabled;
    const confirmMessage = next
      ? "Mettre le site public en maintenance ? Les visiteurs ne verront plus que la page de maintenance."
      : "Réactiver le site public pour tous les visiteurs ?";

    if (!confirm(confirmMessage)) return;

    setSaving(true);
    try {
      const res = await fetch("/api/site-settings/maintenance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setEnabled(Boolean(data.maintenanceEnabled));
      toast.success(
        next
          ? "Site public placé en maintenance"
          : "Site public réactivé",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Impossible de modifier le mode",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={cn(
        "mx-4 overflow-hidden rounded-2xl border p-5 shadow-sm lg:mx-6",
        enabled
          ? "border-amber-500/30 bg-linear-to-br from-amber-500/10 to-transparent"
          : "border-border/60 bg-card",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
              enabled
                ? "bg-amber-500/15 text-amber-800 ring-amber-500/25"
                : "bg-[var(--inp-vert)]/10 text-[var(--inp-vert)] ring-[var(--inp-vert)]/20",
            )}
          >
            {enabled ? (
              <ConstructionIcon className="size-5" />
            ) : (
              <ShieldAlertIcon className="size-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">
              Mode maintenance du site public
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading
                ? "Chargement du statut…"
                : enabled
                  ? "Le site public affiche uniquement la page de maintenance. Le dashboard reste accessible."
                  : "Le site public est en ligne. Activez la maintenance pour bloquer l’accès aux visiteurs."}
            </p>
          </div>
        </div>

        <Button
          type="button"
          disabled={loading || saving}
          onClick={() => void toggle()}
          className={cn(
            "shrink-0 gap-2",
            enabled
              ? "bg-emerald-700 text-white hover:bg-emerald-700/90"
              : "bg-amber-700 text-white hover:bg-amber-700/90",
          )}
        >
          {saving || loading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : null}
          {enabled ? "Désactiver la maintenance" : "Mettre en maintenance"}
        </Button>
      </div>
    </div>
  );
}
