"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookOpenIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileTextIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  ArchiveIcon,
  ScaleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { DocumentationFormDialog } from "@/components/dashboard/documentation-form-dialog";
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
import {
  CMS_STATUS_LABELS,
  CMS_STATUSES,
} from "@/lib/constants/cms";
import {
  DOCUMENTATION_RUBRIQUES,
  DOCUMENTATION_RUBRIQUE_LABELS,
  DOCUMENTATION_RUBRIQUE_PATHS,
  type DocumentationRubrique,
} from "@/lib/constants/documentation";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";
import { cn } from "@/lib/utils";

const RUBRIQUE_ICONS: Record<DocumentationRubrique, React.ReactNode> = {
  "rapports-publications": <FileTextIcon className="size-4" />,
  "guides-techniques": <BookOpenIcon className="size-4" />,
  "bulletins-scientifiques": <ClipboardListIcon className="size-4" />,
  "open-data": <DatabaseIcon className="size-4" />,
  archives: <ArchiveIcon className="size-4" />,
  "textes-reglementaires": <ScaleIcon className="size-4" />,
};

function metaLabel(item: SerializedDocumentationResource) {
  if (item.rubrique === "bulletins-scientifiques" && item.issue) return item.issue;
  if (item.rubrique === "open-data" && item.format) return item.format;
  if (item.rubrique === "rapports-publications" && item.docType) return item.docType;
  if (item.rubrique === "archives" && item.docType) return item.docType;
  if (item.rubrique === "textes-reglementaires" && item.legalType) return item.legalType;
  if (item.category) return item.category;
  return String(item.year);
}

export function DocumentationPage() {
  const [activeRubrique, setActiveRubrique] =
    useState<DocumentationRubrique>("rapports-publications");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SerializedDocumentationResource[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SerializedDocumentationResource | null>(
    null,
  );

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ rubrique: activeRubrique });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/cms/documentation?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger la documentation");
    } finally {
      setLoading(false);
    }
  }, [activeRubrique, statusFilter]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleDelete = async (item: SerializedDocumentationResource) => {
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return;
    try {
      const res = await fetch(`/api/cms/documentation/${item._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast.success("Ressource supprimée");
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
            <FileTextIcon className="size-7 text-[var(--inp-vert)]" />
            Contenu — Documentation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les ressources affichées dans la section Ressources du footer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => v && setStatusFilter(v)}
          >
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

          <Button
            onClick={() => {
              setEditingItem(null);
              setDialogOpen(true);
            }}
          >
            <PlusIcon className="size-4" />
            Nouvelle ressource
          </Button>
        </div>
      </div>

      <Tabs
        value={activeRubrique}
        onValueChange={(v) => setActiveRubrique(v as DocumentationRubrique)}
      >
        <TabsList className="flex h-auto flex-wrap gap-1">
          {DOCUMENTATION_RUBRIQUES.map((rubrique) => (
            <TabsTrigger key={rubrique} value={rubrique} className="gap-1.5">
              {RUBRIQUE_ICONS[rubrique]}
              {DOCUMENTATION_RUBRIQUE_LABELS[rubrique]}
            </TabsTrigger>
          ))}
        </TabsList>

        {DOCUMENTATION_RUBRIQUES.map((rubrique) => (
          <TabsContent key={rubrique} value={rubrique} className="mt-4 space-y-4">
            <p className="text-xs text-muted-foreground">
              Page publique :{" "}
              <a
                href={DOCUMENTATION_RUBRIQUE_PATHS[rubrique]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
              >
                {DOCUMENTATION_RUBRIQUE_PATHS[rubrique]}
              </a>
            </p>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  Aucune ressource dans cette rubrique.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {items.map((item) => (
                  <Card key={item._id}>
                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{metaLabel(item)}</Badge>
                          <Badge
                            className={cn(
                              item.status === "publie"
                                ? "bg-emerald-500/10 text-emerald-700"
                                : "bg-slate-500/10 text-slate-700",
                            )}
                          >
                            {CMS_STATUS_LABELS[item.status]}
                          </Badge>
                          {item.pdfUrl && <Badge variant="secondary">PDF</Badge>}
                          {item.downloadUrl && <Badge variant="secondary">Fichier</Badge>}
                        </div>
                        <p className="font-medium">{item.title}</p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {item.description}
                        </p>
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
          </TabsContent>
        ))}
      </Tabs>

      <DocumentationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rubrique={activeRubrique}
        item={editingItem}
        onSaved={() => void fetchItems()}
      />
    </div>
  );
}
