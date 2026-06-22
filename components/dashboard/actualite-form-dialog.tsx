"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { CmsImageUpload } from "@/components/dashboard/cms-image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  CMS_STATUSES,
  CMS_STATUS_LABELS,
  NEWS_CATEGORIES,
  NEWS_CATEGORY_LABELS,
} from "@/lib/constants/cms";
import type { SerializedActualite } from "@/lib/services/cms/serialize-actualite";

type ActualiteFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SerializedActualite | null;
  onSaved: () => void;
};

type FormState = {
  title: string;
  excerpt: string;
  contentHtml: string;
  category: (typeof NEWS_CATEGORIES)[number];
  author: string;
  tags: string;
  slug: string;
  status: (typeof CMS_STATUSES)[number];
  publishedAt: string;
  isFeatured: boolean;
  image?: { url: string; publicId?: string };
};

const emptyForm = (): FormState => ({
  title: "",
  excerpt: "",
  contentHtml: "",
  category: "evenements",
  author: "Direction de la Communication — INP",
  tags: "",
  slug: "",
  status: "brouillon",
  publishedAt: "",
  isFeatured: false,
});

export function ActualiteFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: ActualiteFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        title: item.title,
        excerpt: item.excerpt,
        contentHtml: item.contentHtml,
        category: item.category,
        author: item.author,
        tags: item.tags.join(", "),
        slug: item.slug,
        status: item.status,
        publishedAt: item.publishedAt
          ? new Date(item.publishedAt).toISOString().slice(0, 16)
          : "",
        isFeatured: item.isFeatured,
        image: item.imageUrl
          ? { url: item.imageUrl, publicId: item.imagePublicId }
          : undefined,
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, item]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.image?.url) {
      toast.error("L'image de couverture est requise");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        contentHtml: form.contentHtml,
        imageUrl: form.image.url,
        imagePublicId: form.image.publicId,
        category: form.category,
        author: form.author.trim(),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isFeatured: form.isFeatured,
        status: form.status,
        publishedAt: form.publishedAt || undefined,
        slug: form.slug.trim() || undefined,
      };

      const url = item ? `/api/cms/actualites/${item._id}` : "/api/cms/actualites";
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

      toast.success(item ? "Actualité mise à jour" : "Actualité créée");
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
            {item ? "Modifier l'actualité" : "Nouvelle actualité"}
          </DialogTitle>
          <DialogDescription>
            Rédigez le contenu avec l&apos;éditeur WYSIWYG. Les articles publiés
            apparaissent sur le site public, triés par date décroissante.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Résumé</Label>
            <Input
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              required
            />
          </div>

          <CmsImageUpload
            value={form.image}
            onChange={(image) => setForm((prev) => ({ ...prev, image }))}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    category: value as FormState["category"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {NEWS_CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contenu</Label>
            <RichTextEditor
              value={form.contentHtml}
              onChange={(contentHtml) =>
                setForm((prev) => ({ ...prev, contentHtml }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
              placeholder="pédologie, cartographie, FAO"
            />
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
              <Label htmlFor="publishedAt">Date de publication</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (optionnel)</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="genere-automatiquement"
            />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
            <Checkbox
              id="isFeatured"
              checked={form.isFeatured}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isFeatured: checked === true }))
              }
            />
            <div>
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Mettre à la une
              </Label>
              <p className="text-xs text-muted-foreground">
                Affichée en tête de la page actualités
              </p>
            </div>
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
