"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { CmsPdfUpload } from "@/components/dashboard/cms-pdf-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { cn } from "@/lib/utils";
import {
  CMS_STATUSES,
  CMS_STATUS_LABELS,
  PUBLICATION_TYPES,
  PUBLICATION_TYPE_LABELS,
  RESEARCH_AXES,
} from "@/lib/constants/cms";
import type { SerializedPublication } from "@/lib/services/cms/serialize-publication";

const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

type PublicationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SerializedPublication | null;
  onSaved: () => void;
  /** Contexte de création : page Recherche ou catalogue général */
  scope?: "all" | "scientific";
};

type FormState = {
  title: string;
  authors: string;
  year: string;
  type: (typeof PUBLICATION_TYPES)[number];
  abstract: string;
  tags: string;
  researchAxis: (typeof RESEARCH_AXES)[number];
  methodology: string;
  results: string;
  doi: string;
  slug: string;
  status: (typeof CMS_STATUSES)[number];
  publishedAt: string;
  isFeatured: boolean;
  showOnScientificPage: boolean;
  pdf?: { url: string; publicId?: string; fileName?: string };
};

const emptyForm = (scope: "all" | "scientific" = "all"): FormState => ({
  title: "",
  authors: "",
  year: String(new Date().getFullYear()),
  type: scope === "scientific" ? "article-scientifique" : "rapport-technique",
  abstract: "",
  tags: "",
  researchAxis: RESEARCH_AXES[0],
  methodology: "",
  results: "",
  doi: "",
  slug: "",
  status: "brouillon",
  publishedAt: "",
  isFeatured: false,
  showOnScientificPage: scope === "scientific",
});

export function PublicationFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
  scope = "all",
}: PublicationFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        title: item.title,
        authors: item.authors.join(", "),
        year: String(item.year),
        type: item.type,
        abstract: item.abstract,
        tags: item.tags.join(", "),
        researchAxis: item.researchAxis,
        methodology: item.methodology ?? "",
        results: item.results ?? "",
        doi: item.doi ?? "",
        slug: item.slug,
        status: item.status,
        publishedAt: item.publishedAt
          ? new Date(item.publishedAt).toISOString().slice(0, 16)
          : "",
        isFeatured: item.isFeatured,
        showOnScientificPage: item.showOnScientificPage ?? true,
        pdf: item.pdfUrl
          ? { url: item.pdfUrl, publicId: item.pdfPublicId, fileName: item.pdfFileName }
          : undefined,
      });
    } else {
      setForm(emptyForm(scope));
    }
  }, [open, item, scope]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const authors = form.authors
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);

    if (!authors.length) {
      toast.error("Au moins un auteur est requis");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        authors,
        year: Number(form.year),
        type: form.type,
        abstract: form.abstract.trim(),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        researchAxis: form.researchAxis,
        methodology: form.methodology.trim() || undefined,
        results: form.results.trim() || undefined,
        doi: form.doi.trim() || undefined,
        pdfUrl: form.pdf?.url,
        pdfPublicId: form.pdf?.publicId,
        pdfFileName: form.pdf?.fileName,
        isFeatured: form.isFeatured,
        showOnScientificPage: form.showOnScientificPage,
        status: form.status,
        publishedAt: form.publishedAt || undefined,
        slug: form.slug.trim() || undefined,
      };

      const url = item ? `/api/cms/publications/${item._id}` : "/api/cms/publications";
      const method = item ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      toast.success(item ? "Publication mise à jour" : "Publication créée");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item ? "Modifier la publication" : "Nouvelle publication"}
          </DialogTitle>
          <DialogDescription>
            {scope === "scientific"
              ? "Publications affichées sur la page Recherche — Publications scientifiques. PDF via Cloudinary, téléchargement proxy."
              : "Rapports, articles, études et fiches techniques. Le PDF est hébergé sur Cloudinary."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pub-title">Titre</Label>
            <Input
              id="pub-title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-authors">Auteurs (séparés par des virgules)</Label>
            <Input
              id="pub-authors"
              value={form.authors}
              onChange={(e) => setForm((prev) => ({ ...prev, authors: e.target.value }))}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pub-year">Année</Label>
              <Input
                id="pub-year"
                type="number"
                min={1900}
                max={2100}
                value={form.year}
                onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    type: value as FormState["type"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PUBLICATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {PUBLICATION_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-abstract">Résumé</Label>
            <textarea
              id="pub-abstract"
              className={cn(textareaClass, "min-h-[100px]")}
              value={form.abstract}
              onChange={(e) => setForm((prev) => ({ ...prev, abstract: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Axe de recherche</Label>
            <Select
              value={form.researchAxis}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  researchAxis: value as FormState["researchAxis"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESEARCH_AXES.map((axis) => (
                  <SelectItem key={axis} value={axis}>
                    {axis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-methodology">Méthodologie (optionnel)</Label>
            <textarea
              id="pub-methodology"
              className={textareaClass}
              value={form.methodology}
              onChange={(e) => setForm((prev) => ({ ...prev, methodology: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-results">Résultats clés (optionnel)</Label>
            <textarea
              id="pub-results"
              className={textareaClass}
              value={form.results}
              onChange={(e) => setForm((prev) => ({ ...prev, results: e.target.value }))}
            />
          </div>

          <CmsPdfUpload
            value={form.pdf}
            onChange={(pdf) => setForm((prev) => ({ ...prev, pdf }))}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pub-doi">DOI (optionnel)</Label>
              <Input
                id="pub-doi"
                value={form.doi}
                onChange={(e) => setForm((prev) => ({ ...prev, doi: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-tags">Tags (virgules)</Label>
              <Input
                id="pub-tags"
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    status: value as FormState["status"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CMS_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {CMS_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-published-at">Date de publication</Label>
              <Input
                id="pub-published-at"
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pub-slug">Slug (optionnel)</Label>
            <Input
              id="pub-slug"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
            <Checkbox
              id="pub-scientific"
              checked={form.showOnScientificPage}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, showOnScientificPage: checked === true }))
              }
            />
            <Label htmlFor="pub-scientific" className="cursor-pointer">
              Afficher sur Publications scientifiques (Recherche)
            </Label>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
            <Checkbox
              id="pub-featured"
              checked={form.isFeatured}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isFeatured: checked === true }))
              }
            />
            <Label htmlFor="pub-featured" className="cursor-pointer">
              Mettre en avant
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2Icon className="size-4 animate-spin" />}
              {item ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
