"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building2Icon,
  Loader2Icon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";

import { InstitutDelegationFormDialog } from "@/components/dashboard/institut-delegation-form-dialog";
import { InstitutMembreFormDialog } from "@/components/dashboard/institut-membre-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CMS_STATUS_LABELS, CMS_STATUSES } from "@/lib/constants/cms";
import {
  INSTITUT_POLE_LABELS,
  INSTITUT_POLE_TYPES,
} from "@/lib/constants/institut";
import type { SerializedInstitutDelegation } from "@/lib/services/institut/serialize-institut-delegation";
import type { SerializedInstitutMembre } from "@/lib/services/institut/serialize-institut-membre";
import { cn } from "@/lib/utils";

export function InstitutPage() {
  const [activeTab, setActiveTab] = useState<"equipe" | "delegations">("equipe");
  const [statusFilter, setStatusFilter] = useState("all");
  const [poleFilter, setPoleFilter] = useState("all");
  const [loadingMembres, setLoadingMembres] = useState(true);
  const [loadingDelegations, setLoadingDelegations] = useState(true);
  const [membres, setMembres] = useState<SerializedInstitutMembre[]>([]);
  const [delegations, setDelegations] = useState<SerializedInstitutDelegation[]>([]);
  const [membreDialogOpen, setMembreDialogOpen] = useState(false);
  const [delegationDialogOpen, setDelegationDialogOpen] = useState(false);
  const [editingMembre, setEditingMembre] = useState<SerializedInstitutMembre | null>(null);
  const [editingDelegation, setEditingDelegation] =
    useState<SerializedInstitutDelegation | null>(null);

  const fetchMembres = useCallback(async () => {
    setLoadingMembres(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (poleFilter !== "all") params.set("pole", poleFilter);
      const res = await fetch(`/api/cms/institut/membres?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setMembres(data.items ?? []);
    } catch {
      toast.error("Impossible de charger l'équipe");
    } finally {
      setLoadingMembres(false);
    }
  }, [statusFilter, poleFilter]);

  const fetchDelegations = useCallback(async () => {
    setLoadingDelegations(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/cms/institut/delegations?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setDelegations(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les délégations");
    } finally {
      setLoadingDelegations(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (activeTab === "equipe") void fetchMembres();
    else void fetchDelegations();
  }, [activeTab, fetchMembres, fetchDelegations]);

  const handleDeleteMembre = async (item: SerializedInstitutMembre) => {
    if (!window.confirm(`Supprimer « ${item.nom} » ?`)) return;
    try {
      const res = await fetch(`/api/cms/institut/membres/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Membre supprimé");
      void fetchMembres();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleDeleteDelegation = async (item: SerializedInstitutDelegation) => {
    if (!window.confirm(`Supprimer « ${item.name} » ?`)) return;
    try {
      const res = await fetch(`/api/cms/institut/delegations/${item._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Délégation supprimée");
      void fetchDelegations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Building2Icon className="size-7 text-[var(--inp-vert)]" />
            Contenu — Institut
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez l&apos;équipe et les délégations pédoclimatiques affichées sur le site public.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {CMS_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {CMS_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeTab === "equipe" && (
            <Select value={poleFilter} onValueChange={(v) => v && setPoleFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pôles</SelectItem>
                {INSTITUT_POLE_TYPES.map((pole) => (
                  <SelectItem key={pole} value={pole}>
                    {INSTITUT_POLE_LABELS[pole]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={() => {
              if (activeTab === "equipe") {
                setEditingMembre(null);
                setMembreDialogOpen(true);
              } else {
                setEditingDelegation(null);
                setDelegationDialogOpen(true);
              }
            }}
          >
            <PlusIcon className="size-4" />
            {activeTab === "equipe" ? "Nouveau membre" : "Nouvelle délégation"}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "equipe" | "delegations")}
      >
        <TabsList>
          <TabsTrigger value="equipe" className="gap-1.5">
            <UsersIcon className="size-4" />
            Équipe
          </TabsTrigger>
          <TabsTrigger value="delegations" className="gap-1.5">
            <MapPinIcon className="size-4" />
            Délégations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipe" className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Page publique :{" "}
            <a
              href="/institut/equipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
            >
              /institut/equipe
            </a>
          </p>

          {loadingMembres ? (
            <div className="flex justify-center py-16">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : membres.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Aucun membre. Lancez <code className="text-xs">npm run seed:institut</code> ou
                ajoutez un membre.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {membres.map((item) => (
                <Card key={item._id}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{INSTITUT_POLE_LABELS[item.pole]}</Badge>
                        <Badge
                          className={cn(
                            item.status === "publie"
                              ? "bg-emerald-500/10 text-emerald-700"
                              : "bg-slate-500/10 text-slate-700",
                          )}
                        >
                          {CMS_STATUS_LABELS[item.status]}
                        </Badge>
                        {item.zone && <Badge variant="secondary">{item.zone}</Badge>}
                      </div>
                      <p className="font-medium">{item.nom}</p>
                      <p className="text-sm text-muted-foreground">{item.fonction}</p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingMembre(item);
                          setMembreDialogOpen(true);
                        }}
                      >
                        <PencilIcon className="size-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleDeleteMembre(item)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="delegations" className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Pages publiques :{" "}
            <a
              href="/institut/organigramme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
            >
              /institut/organigramme
            </a>
            {" · "}
            <a
              href="/institut/delegations/niayes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
            >
              /institut/delegations/[slug]
            </a>
          </p>

          {loadingDelegations ? (
            <div className="flex justify-center py-16">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : delegations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Aucune délégation. Lancez <code className="text-xs">npm run seed:institut</code> ou
                ajoutez une délégation.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {delegations.map((item) => (
                <Card key={item._id}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="inline-block size-3 rounded-full border"
                          style={{ backgroundColor: item.color }}
                          aria-hidden
                        />
                        <Badge variant="outline">{item.organigrammeLabel}</Badge>
                        <Badge
                          className={cn(
                            item.status === "publie"
                              ? "bg-emerald-500/10 text-emerald-700"
                              : "bg-slate-500/10 text-slate-700",
                          )}
                        >
                          {CMS_STATUS_LABELS[item.status]}
                        </Badge>
                      </div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.chefLieu} · /institut/delegations/{item.slug}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingDelegation(item);
                          setDelegationDialogOpen(true);
                        }}
                      >
                        <PencilIcon className="size-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleDeleteDelegation(item)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <InstitutMembreFormDialog
        open={membreDialogOpen}
        onOpenChange={setMembreDialogOpen}
        item={editingMembre}
        onSaved={() => void fetchMembres()}
      />

      <InstitutDelegationFormDialog
        open={delegationDialogOpen}
        onOpenChange={setDelegationDialogOpen}
        item={editingDelegation}
        onSaved={() => void fetchDelegations()}
      />
    </div>
  );
}
