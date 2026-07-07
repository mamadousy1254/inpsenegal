"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarIcon,
  FolderKanbanIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { ResearchProjectFormDialog } from "@/components/dashboard/research-project-form-dialog";
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
import {
  CMS_STATUS_LABELS,
  RESEARCH_PROJECT_STATUS_LABELS,
} from "@/lib/constants/cms";
import type { SerializedResearchProject } from "@/lib/services/cms/serialize-research-project";
import { cn } from "@/lib/utils";

const PROJECT_STATUS_BADGE: Record<string, string> = {
  en_cours: "bg-amber-500/10 text-amber-700",
  termine: "bg-slate-500/10 text-slate-700",
  partenariat: "bg-sky-500/10 text-sky-700",
};

export function ResearchProjectsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedResearchProject[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SerializedResearchProject | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const qs = params.toString();
      const res = await fetch(`/api/cms/research-projects${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les projets");
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

  const handleDelete = async (item: SerializedResearchProject) => {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return;

    try {
      const res = await fetch(`/api/cms/research-projects/${item._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Projet supprimé");
      void fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <FolderKanbanIcon className="size-6 text-[var(--inp-vert)]" />
            Projets de recherche
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Projets affichés dans la section « Projets en cours » de la page
            Recherche.
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
            Nouveau projet
          </Button>
        </div>
      </div>

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
              ? "Aucun projet pour le moment."
              : "Aucun projet ne correspond aux filtres."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <Card key={item._id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">Ordre {item.order}</Badge>
                    <Badge
                      className={cn(
                        PROJECT_STATUS_BADGE[item.projectStatus] ??
                          "bg-slate-500/10 text-slate-700",
                      )}
                    >
                      {RESEARCH_PROJECT_STATUS_LABELS[item.projectStatus]}
                    </Badge>
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
                  <p className="font-medium">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <UserIcon className="size-3.5" />
                      {item.lead}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarIcon className="size-3.5" />
                      {item.year}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {item.description}
                  </p>
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
          ))}
        </div>
      )}

      <ResearchProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSaved={() => void fetchItems()}
      />
    </div>
  );
}
