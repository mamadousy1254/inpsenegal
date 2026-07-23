"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckIcon, Loader2Icon, SearchIcon, UserIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type MissionAgentOption = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  occupation?: string;
  service?: string;
};

type MissionAgentPickerProps = {
  selectedIds: string[];
  chefMissionId: string;
  onSelectedChange: (ids: string[]) => void;
  onChefChange: (id: string) => void;
  currentUser: MissionAgentOption | null;
  /** Agents déjà connus (ex. occupants des voitures) pour afficher noms/fonctions. */
  knownAgents?: MissionAgentOption[];
  disabled?: boolean;
};

function agentLabel(agent: MissionAgentOption) {
  return `${agent.firstname} ${agent.lastname}`.trim();
}

export function MissionAgentPicker({
  selectedIds,
  chefMissionId,
  onSelectedChange,
  onChefChange,
  currentUser,
  knownAgents = [],
  disabled = false,
}: MissionAgentPickerProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [remoteUsers, setRemoteUsers] = useState<MissionAgentOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

    fetch(`/api/ged/recipients?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) {
          setRemoteUsers(Array.isArray(data?.users) ? data.users : []);
        }
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
  }, [debouncedSearch]);

  const agentDirectory = useMemo(() => {
    const map = new Map<string, MissionAgentOption>();
    if (currentUser) map.set(currentUser._id, currentUser);
    for (const user of knownAgents) map.set(user._id, user);
    for (const user of remoteUsers) map.set(user._id, user);
    return map;
  }, [currentUser, knownAgents, remoteUsers]);

  const selectedAgents = useMemo(() => {
    return selectedIds
      .map((id) => {
        const known = agentDirectory.get(id);
        if (known) return known;
        // Fallback si l'agent n'est pas encore résolu
        return {
          _id: id,
          firstname: "Agent",
          lastname: "",
          email: "",
        } satisfies MissionAgentOption;
      });
  }, [agentDirectory, selectedIds]);

  const browseUsers = useMemo(() => {
    const map = new Map<string, MissionAgentOption>();
    if (currentUser && !selectedIds.includes(currentUser._id)) {
      map.set(currentUser._id, currentUser);
    }
    for (const user of remoteUsers) {
      if (!selectedIds.includes(user._id)) map.set(user._id, user);
    }
    return [...map.values()];
  }, [currentUser, remoteUsers, selectedIds]);

  function toggleAgent(user: MissionAgentOption) {
    if (disabled) return;
    if (selectedIds.includes(user._id)) {
      onSelectedChange(selectedIds.filter((id) => id !== user._id));
      return;
    }
    onSelectedChange([...selectedIds, user._id]);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Missionnaires sélectionnés</Label>
        {selectedAgents.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
            Sélectionnez au moins un agent pour la mission.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedAgents.map((agent) => (
              <Badge
                key={agent._id}
                variant="outline"
                className="gap-1 rounded-lg px-2.5 py-1 text-xs"
              >
                {agentLabel(agent)}
                {!disabled && (
                  <button
                    type="button"
                    className="rounded-sm hover:text-rose-600"
                    onClick={() => toggleAgent(agent)}
                    aria-label={`Retirer ${agentLabel(agent)}`}
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mission-agent-search">Ajouter des agents</Label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="mission-agent-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, e-mail, fonction…"
            className="pl-9"
            disabled={disabled}
          />
        </div>
        <div className="rounded-xl border border-border bg-muted/20">
          <ScrollArea className="h-44">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
                Recherche…
              </div>
            ) : browseUsers.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                Aucun agent supplémentaire trouvé.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {browseUsers.map((user) => (
                  <li key={user._id}>
                    <button
                      type="button"
                      disabled={disabled}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-background/80 disabled:opacity-60"
                      onClick={() => toggleAgent(user)}
                    >
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                        <UserIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{agentLabel(user)}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.occupation ?? "Agent"} · {user.email}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Chef de mission</Label>
        {selectedAgents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ajoutez d&apos;abord les missionnaires, puis désignez le chef parmi eux.
          </p>
        ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {selectedAgents.map((agent) => {
            const isChef = chefMissionId === agent._id;
            return (
              <button
                key={agent._id}
                type="button"
                disabled={disabled}
                onClick={() => onChefChange(agent._id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                  isChef
                    ? "border-[var(--inp-vert)] bg-[var(--inp-vert)]/5"
                    : "border-border hover:bg-muted/30",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border",
                    isChef
                      ? "border-[var(--inp-vert)] bg-[var(--inp-vert)] text-white"
                      : "border-border",
                  )}
                >
                  {isChef ? <CheckIcon className="size-3" /> : null}
                </span>
                <span className="font-medium">{agentLabel(agent)}</span>
              </button>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
