"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  HandshakeIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { PartenaireFormDialog } from "@/components/dashboard/partenaire-form-dialog";
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
import { CMS_STATUS_LABELS, CMS_STATUSES } from "@/lib/constants/cms";
import {
  PARTENAIRE_CATEGORIES,
  PARTENAIRE_CATEGORY_LABELS,
  type PartenaireCategory,
} from "@/lib/constants/partenaires";
import type { SerializedPartenaire } from "@/lib/services/partenaires/serialize-partenaire";
import { cn } from "@/lib/utils";

export function PartenairesDashboardPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<PartenaireCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedPartenaire[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SerializedPartenaire | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      const res = await fetch(`/api/cms/partenaires?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les partenaires");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleDelete = async (item: SerializedPartenaire) => {
    if (!window.confirm(`Supprimer « ${item.acronyme} » ?`)) return;
    try {
      const res = await fetch(`/api/cms/partenaires/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Partenaire supprimé");
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
            <HandshakeIcon className="size-7 text-[var(--inp-vert)]" />
            Contenu — Partenaires
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les organisations affichées sur la page Partenaires du site.
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

          <Select
            value={categoryFilter}
            onValueChange={(v) => v && setCategoryFilter(v as PartenaireCategory | "all")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {PARTENAIRE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {PARTENAIRE_CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setEditingItem(null);
              setDialogOpen(true);
            }}
          >
            <PlusIcon className="size-4" />
            Nouveau partenaire
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Page publique :{" "}
        <a
          href="/partenaires"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
        >
          /partenaires
        </a>
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Aucun partenaire. Lancez <code className="text-xs">npm run seed:partenaires</code> ou
            ajoutez un partenaire.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item._id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border bg-white p-1">
                    <Image
                      src={item.logo}
                      alt={item.acronyme}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{PARTENAIRE_CATEGORY_LABELS[item.category]}</Badge>
                      <Badge
                        className={cn(
                          item.status === "publie"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-slate-500/10 text-slate-700",
                        )}
                      >
                        {CMS_STATUS_LABELS[item.status]}
                      </Badge>
                      {item.pays && <Badge variant="secondary">{item.pays}</Badge>}
                    </div>
                    <p className="font-medium">{item.acronyme}</p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">{item.nom}</p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
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
                  <Button variant="outline" size="sm" onClick={() => void handleDelete(item)}>
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PartenaireFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSaved={() => void fetchItems()}
      />
    </div>
  );
}
