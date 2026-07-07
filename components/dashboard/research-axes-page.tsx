"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  FlaskConicalIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { ResearchAxisFormDialog } from "@/components/dashboard/research-axis-form-dialog";
import {
  CmsListFilters,
  useCmsListFilters,
} from "@/components/dashboard/cms-list-filters";
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
import { CMS_STATUS_LABELS } from "@/lib/constants/cms";
import type { SerializedResearchAxis } from "@/lib/services/cms/serialize-research-axis";
import {
  getResearchAxisColor,
  getResearchAxisIcon,
} from "@/components/recherche/research-axis-ui";
import { cn } from "@/lib/utils";

export function ResearchAxesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedResearchAxis[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SerializedResearchAxis | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const qs = params.toString();
      const res = await fetch(`/api/cms/research-axes${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les axes de recherche");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const {
    search,
    setSearch,
    year,
    setYear,
    sort,
    setSort,
    years,
    filtered,
  } = useCmsListFilters(items, {
    getTitle: (item) => item.title,
    getDate: (item) => item.publishedAt ?? item.createdAt,
  });

  const handleDelete = async (item: SerializedResearchAxis) => {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return;

    try {
      const res = await fetch(`/api/cms/research-axes/${item._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Axe supprimé");
      void fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <FlaskConicalIcon className="size-7 text-[var(--inp-vert)]" />
            Contenu — Recherche &amp; innovation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Axes / thématiques de recherche affichés sur la page d&apos;accueil et
            la page Recherche.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="publie">Publié</SelectItem>
              <SelectItem value="brouillon">Brouillon</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setEditingItem(null);
              setDialogOpen(true);
            }}
          >
            <PlusIcon className="size-4" />
            Nouvel axe
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Pages publiques :{" "}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
        >
          accueil
        </a>{" "}
        et{" "}
        <a
          href="/recherche"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
        >
          /recherche
        </a>
      </p>

      <CmsListFilters
        search={search}
        onSearchChange={setSearch}
        year={year}
        onYearChange={setYear}
        years={years}
        sort={sort}
        onSortChange={setSort}
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {items.length === 0
              ? "Aucun axe de recherche pour le moment."
              : "Aucun axe ne correspond aux filtres."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => {
            const Icon = getResearchAxisIcon(item.icon);
            return (
              <Card key={item._id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="relative hidden aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.imageAlt || item.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : null}
                      <div
                        className={cn(
                          "absolute top-1.5 left-1.5 flex size-7 items-center justify-center rounded-md border bg-white/90 shadow-sm backdrop-blur-sm",
                          getResearchAxisColor(item.color),
                        )}
                        aria-hidden
                      >
                        <Icon className="size-3.5" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Ordre {item.order}</Badge>
                        <Badge
                          className={cn(
                            item.status === "publie"
                              ? "bg-emerald-500/10 text-emerald-700"
                              : "bg-slate-500/10 text-slate-700",
                          )}
                        >
                          {CMS_STATUS_LABELS[item.status]}
                        </Badge>
                        {item.stats && (
                          <Badge variant="secondary">{item.stats}</Badge>
                        )}
                      </div>
                      <p className="font-medium">{item.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItem(item);
                        setDialogOpen(true);
                      }}
                    >
                      <PencilIcon className="size-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleDelete(item)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ResearchAxisFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSaved={() => void fetchItems()}
      />
    </div>
  );
}
