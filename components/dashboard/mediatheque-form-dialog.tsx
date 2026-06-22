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
import type { SerializedMediathequeItem } from "@/lib/services/cms/serialize-mediatheque";

type MediathequeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SerializedMediathequeItem | null;
  onSaved: () => void;
};

type FormState = {
  alt: string;
  caption: string;
  status: (typeof CMS_STATUSES)[number];
  publishedAt: string;
  image?: { url: string; publicId?: string };
};

const emptyForm = (): FormState => ({
  alt: "",
  caption: "",
  status: "brouillon",
  publishedAt: "",
});

export function MediathequeFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: MediathequeFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        alt: item.alt,
        caption: item.caption,
        status: item.status,
        publishedAt: item.publishedAt
          ? new Date(item.publishedAt).toISOString().slice(0, 16)
          : "",
        image: { url: item.imageUrl, publicId: item.imagePublicId },
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, item]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.image?.url || !form.image.publicId) {
      toast.error("L'image est requise");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        imageUrl: form.image.url,
        imagePublicId: form.image.publicId,
        alt: form.alt.trim(),
        caption: form.caption.trim(),
        status: form.status,
        publishedAt: form.publishedAt || undefined,
      };

      const url = item ? `/api/cms/mediatheque/${item._id}` : "/api/cms/mediatheque";
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

      toast.success(item ? "Image mise à jour" : "Image ajoutée");
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier l'image" : "Nouvelle image"}</DialogTitle>
          <DialogDescription>
            Photo de la médiathèque avec texte alternatif et légende. Pas d&apos;éditeur de texte enrichi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CmsImageUpload
            value={form.image}
            onChange={(image) => setForm((prev) => ({ ...prev, image }))}
            folder="mediatheque"
            label="Image"
          />

          <div className="space-y-2">
            <Label htmlFor="mediatheque-alt">Texte alternatif</Label>
            <Input
              id="mediatheque-alt"
              value={form.alt}
              onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediatheque-caption">Légende</Label>
            <Input
              id="mediatheque-caption"
              value={form.caption}
              onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))}
              required
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
              <Label htmlFor="mediatheque-published-at">Date de publication</Label>
              <Input
                id="mediatheque-published-at"
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2Icon className="size-4 animate-spin" />}
              {item ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
