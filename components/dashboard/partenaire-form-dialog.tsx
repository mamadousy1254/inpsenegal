"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { CmsImageUpload } from "@/components/dashboard/cms-image-upload";
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
import { CMS_STATUSES, CMS_STATUS_LABELS } from "@/lib/constants/cms";
import {
  PARTENAIRE_CATEGORIES,
  PARTENAIRE_CATEGORY_LABELS,
  type PartenaireCategory,
} from "@/lib/constants/partenaires";
import type { SerializedPartenaire } from "@/lib/services/partenaires/serialize-partenaire";

const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

type FormState = {
  nom: string;
  acronyme: string;
  description: string;
  category: PartenaireCategory;
  siteWeb: string;
  pays: string;
  sortOrder: string;
  status: (typeof CMS_STATUSES)[number];
  slug: string;
  logo?: { url: string; publicId?: string };
};

const emptyForm = (): FormState => ({
  nom: "",
  acronyme: "",
  description: "",
  category: "gouvernement",
  siteWeb: "",
  pays: "Sénégal",
  sortOrder: "0",
  status: "brouillon",
  slug: "",
});

type PartenaireFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SerializedPartenaire | null;
  onSaved: () => void;
};

export function PartenaireFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: PartenaireFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        nom: item.nom,
        acronyme: item.acronyme,
        description: item.description,
        category: item.category,
        siteWeb: item.siteWeb ?? "",
        pays: item.pays ?? "",
        sortOrder: String(item.sortOrder),
        status: item.status,
        slug: item.slug,
        logo: item.logo
          ? { url: item.logo, publicId: item.logoPublicId }
          : undefined,
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, item]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.logo?.url) {
      toast.error("Le logo est requis");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nom: form.nom.trim(),
        acronyme: form.acronyme.trim(),
        description: form.description.trim(),
        category: form.category,
        logo: form.logo.url,
        logoPublicId: form.logo.publicId,
        siteWeb: form.siteWeb.trim() || undefined,
        pays: form.pays.trim() || undefined,
        sortOrder: Number(form.sortOrder) || 0,
        status: form.status,
        slug: form.slug.trim() || undefined,
      };

      const url = item ? `/api/cms/partenaires/${item._id}` : "/api/cms/partenaires";
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

      toast.success(item ? "Partenaire mis à jour" : "Partenaire ajouté");
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier le partenaire" : "Nouveau partenaire"}</DialogTitle>
          <DialogDescription>
            Organisation affichée sur la page Partenaires du site public.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CmsImageUpload
            value={form.logo}
            onChange={(logo) => setForm((prev) => ({ ...prev, logo }))}
            folder="partenaires"
            label="Logo"
            className="[&_.aspect-video]:aspect-[16/10]"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="part-acronyme">Acronyme</Label>
              <Input
                id="part-acronyme"
                value={form.acronyme}
                onChange={(e) => setForm((prev) => ({ ...prev, acronyme: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  v && setForm((prev) => ({ ...prev, category: v as PartenaireCategory }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PARTENAIRE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {PARTENAIRE_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="part-nom">Nom complet</Label>
            <Input
              id="part-nom"
              value={form.nom}
              onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="part-desc">Description</Label>
            <textarea
              id="part-desc"
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="part-pays">Pays</Label>
              <Input
                id="part-pays"
                value={form.pays}
                onChange={(e) => setForm((prev) => ({ ...prev, pays: e.target.value }))}
                placeholder="Sénégal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="part-site">Site web (optionnel)</Label>
              <Input
                id="part-site"
                type="url"
                value={form.siteWeb}
                onChange={(e) => setForm((prev) => ({ ...prev, siteWeb: e.target.value }))}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  v && setForm((prev) => ({ ...prev, status: v as FormState["status"] }))
                }
              >
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="part-sort">Ordre d&apos;affichage</Label>
              <Input
                id="part-sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="part-slug">Slug (interne)</Label>
            <Input
              id="part-slug"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="Généré automatiquement si vide"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2Icon className="size-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
