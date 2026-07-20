"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  MapIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { CartothequeFormDialog } from "@/components/dashboard/cartotheque-form-dialog";
import { CartothequePreviewDialog } from "@/components/dashboard/cartotheque-preview-dialog";
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
import type { SerializedCartothequeItem } from "@/lib/services/cms/serialize-cartotheque";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

function CartothequePagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        {total.toLocaleString("fr-FR")} carte{total > 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon className="size-4" />
          Précédent
        </Button>
        <span className="min-w-24 text-center text-xs font-medium text-muted-foreground">
          Page {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Suivant
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function CartothequePage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedCartothequeItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SerializedCartothequeItem | null>(null);
  const [previewItem, setPreviewItem] = useState<SerializedCartothequeItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [page, setPage] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        statusFilter !== "all" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await fetch(`/api/cms/cartotheque${params}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger la cartothèque");
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
    getTitle: (item) => `${item.title ?? ""} ${item.legende ?? ""}`,
    getDate: (item) => item.publishedAt ?? item.createdAt,
  });

  useEffect(() => {
    setPage(1);
  }, [search, year, sort, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const openPreview = (item: SerializedCartothequeItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const handleDelete = async (item: SerializedCartothequeItem) => {
    if (!window.confirm(`Supprimer la carte « ${item.title} » ?`)) return;

    try {
      const res = await fetch(`/api/cms/cartotheque/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Carte supprimée");
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
            <MapIcon className="size-7 text-[var(--inp-vert)]" />
            Contenu — Cartothèque
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cartes publiées sur l&apos;accueil (4 dernières) et sur la page{" "}
            <span className="font-medium">/cartotheque</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => value != null && setStatusFilter(value)}
          >
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
            Nouvelle carte
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
        searchPlaceholder="Rechercher par titre ou légende…"
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {items.length === 0
              ? "Aucune carte pour le moment."
              : "Aucune carte ne correspond aux filtres."}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <button
                  type="button"
                  className="relative block aspect-[4/3] w-full bg-muted text-left transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  onClick={() => openPreview(item)}
                  aria-label={`Voir la carte : ${item.title}`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-contain p-2 pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </button>
                <CardContent className="space-y-3 p-4">
                  <Badge
                    className={cn(
                      item.status === "publie"
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-slate-500/10 text-slate-700",
                    )}
                  >
                    {CMS_STATUS_LABELS[item.status]}
                  </Badge>
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => openPreview(item)}
                  >
                    <p className="text-sm font-medium line-clamp-1 hover:text-[var(--inp-vert)]">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.legende}</p>
                  </button>
                  <div className="flex gap-2">
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

          <CartothequePagination
            page={currentPage}
            totalPages={totalPages}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}

      <CartothequePreviewDialog
        item={previewItem}
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setPreviewItem(null);
        }}
      />

      <CartothequeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSaved={() => void fetchItems()}
      />
    </div>
  );
}
