"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseIcon,
  DownloadIcon,
  ExternalLinkIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { RecrutementFormDialog } from "@/components/dashboard/recrutement-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CANDIDATURE_STATUSES,
  CANDIDATURE_STATUS_LABELS,
  type CandidatureStatus,
} from "@/lib/constants/candidature";
import {
  RECRUTEMENT_CMS_STATUS_LABELS,
  RECRUTEMENT_OFFER_STATUS_LABELS,
  RECRUTEMENT_TYPE_LABELS,
} from "@/lib/constants/recrutement";
import type { SerializedCandidature } from "@/lib/services/candidature/serialize-candidature";
import type { SerializedRecrutement } from "@/lib/services/recrutement/serialize-recrutement";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<CandidatureStatus, string> = {
  nouvelle: "bg-sky-500/10 text-sky-700",
  en_cours: "bg-amber-500/10 text-amber-800",
  retenue: "bg-emerald-500/10 text-emerald-700",
  refusee: "bg-red-500/10 text-red-700",
  archivee: "bg-slate-500/10 text-slate-600",
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CandidatureSpontaneePage() {
  const [tab, setTab] = useState("offres");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [offres, setOffres] = useState<SerializedRecrutement[]>([]);
  const [candidatures, setCandidatures] = useState<SerializedCandidature[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const [offreDialogOpen, setOffreDialogOpen] = useState(false);
  const [editingOffre, setEditingOffre] = useState<SerializedRecrutement | null>(null);

  const [selectedCandidature, setSelectedCandidature] =
    useState<SerializedCandidature | null>(null);
  const [editStatus, setEditStatus] = useState<CandidatureStatus>("nouvelle");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOffres = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/recrutements");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOffres(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les offres");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCandidatures = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/candidatures");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCandidatures(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les candidatures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "offres") void fetchOffres();
    else void fetchCandidatures();
  }, [tab, fetchOffres, fetchCandidatures]);

  const filteredCandidatures = useMemo(() => {
    let result = candidatures;
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) return result;
    return result.filter((c) =>
      [c.reference, c.nom, c.prenom, c.email, c.offreTitle, c.domaineExpertise]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [candidatures, search, statusFilter]);

  const handleDeleteOffre = async (item: SerializedRecrutement) => {
    if (!confirm(`Supprimer l'offre « ${item.title} » ?`)) return;
    try {
      const res = await fetch(`/api/cms/recrutements/${item._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Offre supprimée");
      void fetchOffres();
    } catch {
      toast.error("Suppression impossible");
    }
  };

  const openCandidature = (item: SerializedCandidature) => {
    setSelectedCandidature(item);
    setEditStatus(item.status);
    setAdminNotes(item.adminNotes ?? "");
  };

  const saveCandidature = async () => {
    if (!selectedCandidature) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/candidatures/${selectedCandidature._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, adminNotes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      const data = await res.json();
      toast.success("Candidature mise à jour");
      setSelectedCandidature(data);
      void fetchCandidatures();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const deleteCandidature = async (item: SerializedCandidature) => {
    if (
      !confirm(
        `Supprimer la candidature ${item.reference} (${item.prenom} ${item.nom}) ?`,
      )
    ) {
      return;
    }

    setDeletingId(item._id);
    try {
      const res = await fetch(`/api/candidatures/${item._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Candidature supprimée");
      if (selectedCandidature?._id === item._id) {
        setSelectedCandidature(null);
      }
      void fetchCandidatures();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Suppression impossible");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <BriefcaseIcon className="size-7 text-[var(--inp-vert)]" />
            Recrutement & candidatures
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les offres publiées sur{" "}
            <Link href="/candidature-spontanee" className="text-[var(--inp-vert)] underline">
              /candidature-spontanee
            </Link>{" "}
            et suivez les candidatures reçues.
          </p>
        </div>
        {tab === "candidatures" && (
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="pl-9"
            />
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="offres">Offres de recrutement</TabsTrigger>
          <TabsTrigger value="candidatures">
            Candidatures reçues
            {candidatures.filter((c) => c.status === "nouvelle").length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {candidatures.filter((c) => c.status === "nouvelle").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offres" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingOffre(null);
                setOffreDialogOpen(true);
              }}
            >
              <PlusIcon className="mr-2 size-4" />
              Nouvelle offre
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : offres.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              Aucune offre. Créez-en une pour l&apos;afficher sur le site public.
            </div>
          ) : (
            <div className="divide-y overflow-hidden rounded-xl border bg-card">
              {offres.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{item.title}</span>
                      <Badge variant="outline">{RECRUTEMENT_TYPE_LABELS[item.type]}</Badge>
                      <Badge variant={item.status === "publie" ? "default" : "secondary"}>
                        {RECRUTEMENT_CMS_STATUS_LABELS[item.status]}
                      </Badge>
                      <Badge variant="outline">
                        {RECRUTEMENT_OFFER_STATUS_LABELS[item.offerStatus]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{item.references}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.shortDescription}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/candidature-spontanee/postuler/${item.slug}`}
                      target="_blank"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      <ExternalLinkIcon className="mr-1 size-3.5" />
                      Voir
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingOffre(item);
                        setOffreDialogOpen(true);
                      }}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => void handleDeleteOffre(item)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="candidatures" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Toutes ({candidatures.length})
            </Button>
            {CANDIDATURE_STATUSES.map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(s)}
              >
                {CANDIDATURE_STATUS_LABELS[s]} (
                {candidatures.filter((c) => c.status === s).length})
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCandidatures.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              Aucune candidature pour le moment.
            </div>
          ) : (
            <div className="divide-y overflow-hidden rounded-xl border bg-card">
              {filteredCandidatures.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-2 p-4 transition-colors hover:bg-muted/30"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between"
                    onClick={() => openCandidature(item)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10">
                        <UserIcon className="size-5 text-[var(--inp-vert)]" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{item.reference}</span>
                          <Badge className={cn("border-0", STATUS_STYLES[item.status])}>
                            {CANDIDATURE_STATUS_LABELS[item.status]}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">
                          {item.prenom} {item.nom}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.offreTitle ?? item.offreSlug} · {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    disabled={deletingId === item._id}
                    aria-label={`Supprimer la candidature ${item.reference}`}
                    onClick={() => void deleteCandidature(item)}
                  >
                    {deletingId === item._id ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <Trash2Icon className="size-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RecrutementFormDialog
        open={offreDialogOpen}
        onOpenChange={setOffreDialogOpen}
        item={editingOffre}
        onSaved={() => void fetchOffres()}
      />

      <Dialog
        open={!!selectedCandidature}
        onOpenChange={(open) => !open && setSelectedCandidature(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {selectedCandidature && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono">{selectedCandidature.reference}</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <p>
                  <strong>
                    {selectedCandidature.prenom} {selectedCandidature.nom}
                  </strong>{" "}
                  — {selectedCandidature.email}
                </p>
                <p className="text-muted-foreground">{selectedCandidature.telephone}</p>
                <p>
                  Offre : {selectedCandidature.offreTitle ?? "Candidature spontanée"}
                </p>
                <p>
                  {selectedCandidature.domaineExpertise} · {selectedCandidature.niveauEtude} ·{" "}
                  {selectedCandidature.anneesExperience}
                </p>
                {selectedCandidature.message && (
                  <p className="rounded-lg bg-muted/40 p-3">{selectedCandidature.message}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {selectedCandidature.cvUrl && (
                    <a
                      href={`/api/candidatures/${selectedCandidature._id}/download?file=cv`}
                      download
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      <DownloadIcon className="mr-1 size-3.5" />
                      CV
                    </a>
                  )}
                  {selectedCandidature.lettreMotivationUrl && (
                    <a
                      href={`/api/candidatures/${selectedCandidature._id}/download?file=lettre`}
                      download
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      <DownloadIcon className="mr-1 size-3.5" />
                      Lettre
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(v) => setEditStatus(v as CandidatureStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CANDIDATURE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {CANDIDATURE_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes internes</Label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => selectedCandidature && void deleteCandidature(selectedCandidature)}
                  disabled={saving || deletingId === selectedCandidature._id}
                >
                  {deletingId === selectedCandidature._id && (
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                  )}
                  Supprimer
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedCandidature(null)}>
                    Fermer
                  </Button>
                  <Button
                    onClick={() => void saveCandidature()}
                    disabled={saving || deletingId === selectedCandidature._id}
                  >
                    {saving && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                    Enregistrer
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
