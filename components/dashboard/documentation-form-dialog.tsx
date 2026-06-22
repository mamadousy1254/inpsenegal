"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { CmsPdfUpload } from "@/components/dashboard/cms-pdf-upload";
import { Button } from "@/components/ui/button";
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
import {
  CMS_STATUSES,
  CMS_STATUS_LABELS,
} from "@/lib/constants/cms";
import {
  DOCUMENTATION_DOC_TYPES,
  DOCUMENTATION_RUBRIQUE_LABELS,
  ARCHIVE_DOC_TYPES,
  GUIDE_CATEGORIES,
  OPEN_DATA_CATEGORIES,
  OPEN_DATA_FORMATS,
  TEXTES_LEGAL_CATEGORIES,
  TEXTES_LEGAL_CATEGORY_LABELS,
  TEXTES_LEGAL_TYPES,
  type DocumentationRubrique,
} from "@/lib/constants/documentation";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const SELECT_NONE = "__none__";

type FormState = {
  title: string;
  description: string;
  year: string;
  status: (typeof CMS_STATUSES)[number];
  category: string;
  issue: string;
  format: (typeof OPEN_DATA_FORMATS)[number] | "";
  docType: (typeof DOCUMENTATION_DOC_TYPES)[number] | "";
  legalType: (typeof TEXTES_LEGAL_TYPES)[number] | "";
  legalDate: string;
  reference: string;
  fileSize: string;
  author: string;
  downloadUrl: string;
  slug: string;
  publishedAt: string;
  pdf?: { url: string; publicId?: string; fileName?: string };
};

const emptyForm = (): FormState => ({
  title: "",
  description: "",
  year: String(new Date().getFullYear()),
  status: "brouillon",
  category: "",
  issue: "",
  format: "",
  docType: "",
  legalType: "",
  legalDate: "",
  reference: "",
  fileSize: "",
  author: "",
  downloadUrl: "",
  slug: "",
  publishedAt: "",
});

type DocumentationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rubrique: DocumentationRubrique;
  item?: SerializedDocumentationResource | null;
  onSaved: () => void;
};

export function DocumentationFormDialog({
  open,
  onOpenChange,
  rubrique,
  item,
  onSaved,
}: DocumentationFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        title: item.title,
        description: item.description,
        year: String(item.year),
        status: item.status,
        category: item.category ?? "",
        issue: item.issue ?? "",
        format: item.format ?? "",
        docType: item.docType ?? "",
        legalType: item.legalType ?? "",
        legalDate: item.legalDate ?? "",
        reference: item.reference ?? "",
        fileSize: item.fileSize ?? "",
        author: item.author ?? "",
        downloadUrl: item.downloadUrl ?? "",
        slug: item.slug,
        publishedAt: item.publishedAt?.slice(0, 10) ?? "",
        pdf: item.pdfUrl
          ? { url: item.pdfUrl, publicId: item.pdfPublicId, fileName: item.pdfFileName }
          : undefined,
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, item]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Titre et description requis");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        rubrique,
        title: form.title.trim(),
        description: form.description.trim(),
        year: Number(form.year),
        status: form.status,
        slug: form.slug.trim() || undefined,
        publishedAt: form.publishedAt || undefined,
        category: form.category || undefined,
        issue: form.issue || undefined,
        format: form.format || undefined,
        docType: form.docType || undefined,
        legalType: form.legalType || undefined,
        legalDate: form.legalDate || undefined,
        reference: form.reference || undefined,
        fileSize: form.fileSize || undefined,
        author: form.author || undefined,
        downloadUrl: form.downloadUrl || undefined,
        pdfUrl: form.pdf?.url,
        pdfPublicId: form.pdf?.publicId,
        pdfFileName: form.pdf?.fileName,
      };

      const res = await fetch(
        item ? `/api/cms/documentation/${item._id}` : "/api/cms/documentation",
        {
          method: item ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      toast.success(item ? "Ressource mise à jour" : "Ressource créée");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions =
    rubrique === "open-data" ? OPEN_DATA_CATEGORIES : GUIDE_CATEGORIES;

  const selectValue = (value: string) => (value === "" ? SELECT_NONE : value);
  const onSelectChange =
    (field: keyof Pick<FormState, "category" | "docType" | "legalType" | "format">) =>
    (value: string | null) => {
      if (!value) return;
      setForm((f) => ({
        ...f,
        [field]: value === SELECT_NONE ? "" : value,
      }));
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {item ? "Modifier" : "Nouvelle ressource"} —{" "}
            {DOCUMENTATION_RUBRIQUE_LABELS[rubrique]}
          </DialogTitle>
          <DialogDescription>
            Contenu affiché sur la page publique correspondante du site.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="doc-title">Titre *</Label>
            <Input
              id="doc-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="doc-description">Description *</Label>
            <textarea
              id="doc-description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={textareaClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="doc-year">Année *</Label>
              <Input
                id="doc-year"
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doc-status">Statut</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, status: v as FormState["status"] }))
                }
              >
                <SelectTrigger id="doc-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CMS_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {CMS_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(rubrique === "rapports-publications" || rubrique === "archives") && (
            <div className="grid gap-2">
              <Label htmlFor="doc-type">Type de document</Label>
              <Select
                value={selectValue(form.docType)}
                onValueChange={onSelectChange("docType")}
              >
                <SelectTrigger id="doc-type">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_NONE}>Non renseigné</SelectItem>
                  {(rubrique === "archives" ? ARCHIVE_DOC_TYPES : DOCUMENTATION_DOC_TYPES).map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {rubrique === "textes-reglementaires" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="doc-legal-category">Catégorie juridique</Label>
                <Select
                  value={selectValue(form.category)}
                  onValueChange={onSelectChange("category")}
                >
                  <SelectTrigger id="doc-legal-category">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_NONE}>Non renseigné</SelectItem>
                    {TEXTES_LEGAL_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {TEXTES_LEGAL_CATEGORY_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="doc-legal-type">Type de texte</Label>
                  <Select
                    value={selectValue(form.legalType)}
                    onValueChange={onSelectChange("legalType")}
                  >
                    <SelectTrigger id="doc-legal-type">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SELECT_NONE}>Non renseigné</SelectItem>
                      {TEXTES_LEGAL_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doc-legal-date">Date affichée</Label>
                  <Input
                    id="doc-legal-date"
                    value={form.legalDate}
                    onChange={(e) => setForm((f) => ({ ...f, legalDate: e.target.value }))}
                    placeholder="28 juin 2004"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="doc-reference">Référence</Label>
                  <Input
                    id="doc-reference"
                    value={form.reference}
                    onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                    placeholder="Journal Officiel du Sénégal"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doc-file-size">Taille du fichier</Label>
                  <Input
                    id="doc-file-size"
                    value={form.fileSize}
                    onChange={(e) => setForm((f) => ({ ...f, fileSize: e.target.value }))}
                    placeholder="0.86 MB"
                  />
                </div>
              </div>
            </>
          )}

          {(rubrique === "guides-techniques" || rubrique === "open-data") && (
            <div className="grid gap-2">
              <Label htmlFor="doc-category">Catégorie</Label>
              <Select
                value={selectValue(form.category)}
                onValueChange={onSelectChange("category")}
              >
                <SelectTrigger id="doc-category">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SELECT_NONE}>Non renseigné</SelectItem>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {rubrique === "bulletins-scientifiques" && (
            <div className="grid gap-2">
              <Label htmlFor="doc-issue">Numéro (ex. N°12)</Label>
              <Input
                id="doc-issue"
                value={form.issue}
                onChange={(e) => setForm((f) => ({ ...f, issue: e.target.value }))}
                placeholder="N°12"
              />
            </div>
          )}

          {rubrique === "open-data" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="doc-format">Format</Label>
                <Select
                  value={selectValue(form.format)}
                  onValueChange={onSelectChange("format")}
                >
                  <SelectTrigger id="doc-format">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_NONE}>Non renseigné</SelectItem>
                    {OPEN_DATA_FORMATS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doc-download">URL de téléchargement</Label>
                <Input
                  id="doc-download"
                  type="url"
                  value={form.downloadUrl}
                  onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          {rubrique === "rapports-publications" && (
            <div className="grid gap-2">
              <Label htmlFor="doc-author">Auteur / source</Label>
              <Input
                id="doc-author"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </div>
          )}

          {(rubrique === "rapports-publications" ||
            rubrique === "archives" ||
            rubrique === "textes-reglementaires") && (
            <div className="grid gap-2">
              <Label>Fichier PDF</Label>
              <CmsPdfUpload
                value={form.pdf}
                onChange={(pdf) => setForm((f) => ({ ...f, pdf }))}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="doc-slug">Slug (optionnel)</Label>
            <Input
              id="doc-slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="genere-automatiquement"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving && <Loader2Icon className="size-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
