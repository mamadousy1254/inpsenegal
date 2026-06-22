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
  INSTITUT_POLE_LABELS,
  INSTITUT_POLE_TYPES,
} from "@/lib/constants/institut";
import type { SerializedInstitutMembre } from "@/lib/services/institut/serialize-institut-membre";

type FormState = {
  nom: string;
  fonction: string;
  pole: (typeof INSTITUT_POLE_TYPES)[number];
  zone: string;
  sortOrder: string;
  status: (typeof CMS_STATUSES)[number];
  slug: string;
  publishedAt: string;
  photo?: { url: string; publicId?: string };
};

const emptyForm = (): FormState => ({
  nom: "",
  fonction: "",
  pole: "technique",
  zone: "",
  sortOrder: "0",
  status: "brouillon",
  slug: "",
  publishedAt: "",
});

type InstitutMembreFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SerializedInstitutMembre | null;
  onSaved: () => void;
};

export function InstitutMembreFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: InstitutMembreFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        nom: item.nom,
        fonction: item.fonction,
        pole: item.pole,
        zone: item.zone ?? "",
        sortOrder: String(item.sortOrder),
        status: item.status,
        slug: item.slug,
        publishedAt: item.publishedAt
          ? new Date(item.publishedAt).toISOString().slice(0, 16)
          : "",
        photo: item.photo
          ? { url: item.photo, publicId: item.photoPublicId }
          : undefined,
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, item]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.nom.trim() || !form.fonction.trim()) {
      toast.error("Nom et fonction sont requis");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nom: form.nom.trim(),
        fonction: form.fonction.trim(),
        pole: form.pole,
        zone: form.zone.trim() || undefined,
        sortOrder: Number(form.sortOrder) || 0,
        status: form.status,
        slug: form.slug.trim() || undefined,
        publishedAt: form.publishedAt || undefined,
        photo: form.photo?.url,
        photoPublicId: form.photo?.publicId,
      };

      const url = item ? `/api/cms/institut/membres/${item._id}` : "/api/cms/institut/membres";
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

      toast.success(item ? "Membre mis à jour" : "Membre ajouté");
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
          <DialogTitle>{item ? "Modifier le membre" : "Nouveau membre"}</DialogTitle>
          <DialogDescription>
            Personne affichée sur la page Équipe de l&apos;Institut.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="membre-nom">Nom complet</Label>
            <Input
              id="membre-nom"
              value={form.nom}
              onChange={(e) => setForm((prev) => ({ ...prev, nom: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="membre-fonction">Fonction</Label>
            <Input
              id="membre-fonction"
              value={form.fonction}
              onChange={(e) => setForm((prev) => ({ ...prev, fonction: e.target.value }))}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pôle</Label>
              <Select
                value={form.pole}
                onValueChange={(v) =>
                  v && setForm((prev) => ({ ...prev, pole: v as FormState["pole"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUT_POLE_TYPES.map((pole) => (
                    <SelectItem key={pole} value={pole}>
                      {INSTITUT_POLE_LABELS[pole]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="membre-zone">Zone (optionnel)</Label>
              <Input
                id="membre-zone"
                value={form.zone}
                onChange={(e) => setForm((prev) => ({ ...prev, zone: e.target.value }))}
                placeholder="Ex. Niayes"
              />
            </div>
          </div>

          <CmsImageUpload
            value={form.photo}
            onChange={(photo) => setForm((prev) => ({ ...prev, photo }))}
            folder="institut/membres"
            label="Photo (optionnelle)"
            className="[&_.aspect-video]:aspect-square [&_.aspect-video]:max-w-[160px]"
          />

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
              <Label htmlFor="membre-sort">Ordre d&apos;affichage</Label>
              <Input
                id="membre-sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="membre-slug">Slug (URL interne)</Label>
            <Input
              id="membre-slug"
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
