"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DownloadIcon,
  FileTextIcon,
  FlaskConicalIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { PublicationFormDialog } from "@/components/dashboard/publication-form-dialog";
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
  PUBLICATION_TYPE_LABELS,
} from "@/lib/constants/cms";
import type { SerializedPublication } from "@/lib/services/cms/serialize-publication";
import { hasCmsFile, resolveCmsPdfFileName } from "@/lib/services/cms/cms-file-download";
import { cn } from "@/lib/utils";

type PublicationsPageProps = {
  scope?: "all" | "scientific";
};

export function PublicationsPage({ scope = "all" }: PublicationsPageProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedPublication[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SerializedPublication | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (scope === "scientific") params.set("scientific", "1");
      const qs = params.toString();
      const res = await fetch(`/api/cms/publications${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les publications");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, scope]);

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
    getDate: (item) =>
      item.publishedAt ?? (item.year ? `${item.year}-01-01` : undefined),
  });

  const handleDelete = async (item: SerializedPublication) => {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return;

    try {
      const res = await fetch(`/api/cms/publications/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Publication supprimée");
      void fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const isScientific = scope === "scientific";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            {isScientific ? (
              <FlaskConicalIcon className="size-7 text-[var(--inp-vert)]" />
            ) : (
              <FileTextIcon className="size-7 text-[var(--inp-vert)]" />
            )}
            {isScientific ? "Contenu — Publications scientifiques" : "Contenu — Publications"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isScientific
              ? "Publications de la page Recherche — téléchargement PDF via le proxy /api/publications/[slug]/download."
              : "Rapports, articles scientifiques, études et fiches techniques avec PDF Cloudinary."}
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
            Nouvelle publication
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Page publique :{" "}
        <a
          href={isScientific ? "/recherche/publications-scientifiques" : "/publications"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
        >
          {isScientific ? "/recherche/publications-scientifiques" : "/publications"}
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
              ? "Aucune publication pour le moment."
              : "Aucune publication ne correspond aux filtres."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <Card key={item._id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{PUBLICATION_TYPE_LABELS[item.type]}</Badge>
                    <Badge
                      className={cn(
                        item.status === "publie"
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-slate-500/10 text-slate-700",
                      )}
                    >
                      {CMS_STATUS_LABELS[item.status]}
                    </Badge>
                    {item.isFeatured && (
                      <Badge className="bg-amber-500/10 text-amber-700">En avant</Badge>
                    )}
                    {item.pdfUrl && (
                      <Badge variant="secondary">PDF</Badge>
                    )}
                  </div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.authors.join(", ")} · {item.year} · /publications/{item.slug}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {hasCmsFile(item.pdfUrl) && (
                    <a
                      href={`/api/publications/${item.slug}/download`}
                      download={resolveCmsPdfFileName({
                        title: item.title,
                        pdfFileName: item.pdfFileName,
                      })}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <DownloadIcon className="size-4" />
                      PDF
                    </a>
                  )}
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

      <PublicationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSaved={() => void fetchItems()}
        scope={scope}
      />
    </div>
  );
}
