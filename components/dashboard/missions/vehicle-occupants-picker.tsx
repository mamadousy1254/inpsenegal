"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckIcon, Loader2Icon, SearchIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type VehicleOccupantOption = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  occupation?: string;
  service?: string;
};

export type VehicleOccupantSnapshot = {
  userId: string;
  fullname: string;
  occupation?: string;
  service?: string;
};

type VehicleOccupantsPickerProps = {
  vehicleIndex: number;
  selected: VehicleOccupantSnapshot[];
  onChange: (next: VehicleOccupantSnapshot[]) => void;
  /** IDs déjà placés dans d'autres voitures (exclus de la liste). */
  excludeIds?: string[];
  disabled?: boolean;
};

function toSnapshot(agent: VehicleOccupantOption): VehicleOccupantSnapshot {
  return {
    userId: agent._id,
    fullname: `${agent.firstname} ${agent.lastname}`.trim(),
    occupation: agent.occupation,
    service: agent.service,
  };
}

export function VehicleOccupantsPicker({
  vehicleIndex,
  selected,
  onChange,
  excludeIds = [],
  disabled = false,
}: VehicleOccupantsPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [occupationFilter, setOccupationFilter] = useState<string>("all");
  const [remoteUsers, setRemoteUsers] = useState<VehicleOccupantOption[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [occupations, setOccupations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (serviceFilter !== "all") params.set("service", serviceFilter);
    if (occupationFilter !== "all") params.set("occupation", occupationFilter);

    fetch(`/api/missions/agents?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        setRemoteUsers(Array.isArray(data?.users) ? data.users : []);
        if (Array.isArray(data?.services)) setServices(data.services);
        if (Array.isArray(data?.occupations)) setOccupations(data.occupations);
      })
      .catch(() => {
        if (!cancelled) setRemoteUsers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, debouncedSearch, serviceFilter, occupationFilter]);

  const selectedIds = useMemo(
    () => new Set(selected.map((o) => o.userId)),
    [selected],
  );
  const excluded = useMemo(() => new Set(excludeIds), [excludeIds]);

  const browseUsers = useMemo(() => {
    return remoteUsers.filter(
      (user) => !selectedIds.has(user._id) && !excluded.has(user._id),
    );
  }, [remoteUsers, selectedIds, excluded]);

  function toggleAgent(agent: VehicleOccupantOption) {
    if (disabled) return;
    if (selectedIds.has(agent._id)) {
      onChange(selected.filter((o) => o.userId !== agent._id));
      return;
    }
    onChange([...selected, toSnapshot(agent)]);
  }

  function removeOccupant(userId: string) {
    if (disabled) return;
    onChange(selected.filter((o) => o.userId !== userId));
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label>
          Personnes dans la voiture{" "}
          <span className="font-normal text-muted-foreground">(optionnel)</span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Masquer la sélection" : "Sélectionner des personnes"}
        </Button>
      </div>

      {selected.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Aucune personne assignée à la voiture {vehicleIndex + 1}.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((occupant) => (
            <Badge
              key={occupant.userId}
              variant="outline"
              className="gap-1 rounded-lg px-2 py-1 text-xs"
            >
              <span className="max-w-[160px] truncate">{occupant.fullname}</span>
              {!disabled && (
                <button
                  type="button"
                  className="rounded-full p-0.5 hover:bg-muted"
                  onClick={() => removeOccupant(occupant.userId)}
                  aria-label={`Retirer ${occupant.fullname}`}
                >
                  <XIcon className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {open && (
        <div className="space-y-3 rounded-lg border border-border/60 bg-background p-3">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email…"
              className="h-8 pl-8 text-xs"
              disabled={disabled}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-[11px]">Service</Label>
              <Select
                value={serviceFilter}
                onValueChange={(v) => setServiceFilter(v ?? "all")}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue placeholder="Tous les services" />
                </SelectTrigger>
                <SelectContent className="z-[220] max-h-56">
                  <SelectItem value="all">Tous les services</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Fonction</Label>
              <Select
                value={occupationFilter}
                onValueChange={(v) => setOccupationFilter(v ?? "all")}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue placeholder="Toutes les fonctions" />
                </SelectTrigger>
                <SelectContent className="z-[220] max-h-56">
                  <SelectItem value="all">Toutes les fonctions</SelectItem>
                  {occupations.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="h-44 rounded-md border">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : browseUsers.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                Aucun agent trouvé.
              </p>
            ) : (
              <ul className="p-1">
                {browseUsers.map((agent) => {
                  const isSelected = selectedIds.has(agent._id);
                  return (
                    <li key={agent._id}>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => toggleAgent(agent)}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted",
                          isSelected && "bg-[var(--inp-vert)]/10",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                            isSelected
                              ? "border-[var(--inp-vert)] bg-[var(--inp-vert)] text-white"
                              : "border-border",
                          )}
                        >
                          {isSelected && <CheckIcon className="size-3" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium">
                            {agent.firstname} {agent.lastname}
                          </span>
                          <span className="block text-[11px] text-muted-foreground">
                            {[agent.occupation, agent.service]
                              .filter(Boolean)
                              .join(" · ") || agent.email}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
