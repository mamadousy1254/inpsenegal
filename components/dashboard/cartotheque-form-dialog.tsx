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
import { cn } from "@/lib/utils";
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
  CMS_CARTOTHEQUE_IMAGE_MAX_BYTES,
} from "@/lib/constants/cms";
import type { SerializedCartothequeItem } from "@/lib/services/cms/serialize-cartotheque";

type CartothequeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SerializedCartothequeItem | null;
  onSaved: () => void;
};

type FormState = {
  title: string;
  legende: string;
  status: (typeof CMS_STATUSES)[number];
  publishedAt: string;
  image?: { url: string; publicId?: string };
};

const emptyForm = (): FormState => ({
  title: "",
  legende: "",
  status: "brouillon",
  publishedAt: "",
});

export function CartothequeFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: CartothequeFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        title: item.title,
        legende: item.legende,
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
      toast.error("L'image de la carte est requise");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        imageUrl: form.image.url,
        imagePublicId: form.image.publicId,
        title: form.title.trim(),
        legende: form.legende.trim(),
        status: form.status,
        publishedAt: form.publishedAt || undefined,
      };

      const url = item ? `/api/cms/cartotheque/${item._id}` : "/api/cms/cartotheque";
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

      toast.success(item ? "Carte mise à jour" : "Carte ajoutée");
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
      <DialogContent className="w-[min(calc(100%-2rem),26rem)] max-w-[26rem] max-h-[min(90vh,36rem)] gap-3 overflow-y-auto p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier la carte" : "Nouvelle carte"}</DialogTitle>
          <DialogDescription>
            Téléversez une carte cartographique et renseignez sa légende pour le site public.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CmsImageUpload
            value={form.image}
            onChange={(image) => setForm((prev) => ({ ...prev, image }))}
            folder="cartotheque"
            label="Image de la carte"
            previewFit="contain"
            previewClassName="max-h-40 aspect-[4/3]"
            hint="Envoi sécurisé vers Cloudinary (dossier « cartotheque »). Formats : JPEG, PNG, WebP — 10 Mo max."
            maxBytes={CMS_CARTOTHEQUE_IMAGE_MAX_BYTES}
          />

          <div className="space-y-2">
            <Label htmlFor="cartotheque-title">Titre court</Label>
            <Input
              id="cartotheque-title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Ex. Carte pédologique — région de Thiès"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cartotheque-legende">Légende</Label>
            <textarea
              id="cartotheque-legende"
              value={form.legende}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm((prev) => ({ ...prev, legende: e.target.value }))
              }
              rows={4}
              placeholder="Texte descriptif affiché sous la carte sur l'accueil et la liste."
              required
              className={cn(
                "flex w-full min-h-[100px] rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
              )}
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
              <Label htmlFor="cartotheque-published-at">Date de publication</Label>
              <Input
                id="cartotheque-published-at"
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
