"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { MediathequeFormDialog } from "@/components/dashboard/mediatheque-form-dialog";
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
import type { SerializedMediathequeItem } from "@/lib/services/cms/serialize-mediatheque";
import { cn } from "@/lib/utils";

export function MediathequePage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedMediathequeItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SerializedMediathequeItem | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        statusFilter !== "all" ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await fetch(`/api/cms/mediatheque${params}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger la médiathèque");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleDelete = async (item: SerializedMediathequeItem) => {
    if (!window.confirm(`Supprimer cette image ?`)) return;

    try {
      const res = await fetch(`/api/cms/mediatheque/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Image supprimée");
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
            <ImageIcon className="size-7 text-[var(--inp-vert)]" />
            Contenu — Médiathèque
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Galerie photo du site public : image, texte alternatif et légende.
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
            Nouvelle image
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Aucune image pour le moment.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
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
                <p className="text-sm font-medium line-clamp-2">{item.caption}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.alt}</p>
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
      )}

      <MediathequeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSaved={() => void fetchItems()}
      />
    </div>
  );
}
