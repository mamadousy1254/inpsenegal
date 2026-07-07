"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CmsImageUpload } from "@/components/dashboard/cms-image-upload";
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
  RESEARCH_AXIS_COLORS,
  RESEARCH_AXIS_COLOR_LABELS,
  RESEARCH_AXIS_ICONS,
  RESEARCH_AXIS_ICON_LABELS,
  type ResearchAxisColor,
  type ResearchAxisIcon,
} from "@/lib/constants/cms";
import type { SerializedResearchAxis } from "@/lib/services/cms/serialize-research-axis";
import { cn } from "@/lib/utils";

const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

type ResearchAxisFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SerializedResearchAxis | null;
  onSaved: () => void;
};

type FormState = {
  title: string;
  description: string;
  stats: string;
  icon: ResearchAxisIcon;
  color: ResearchAxisColor;
  image?: { url: string; publicId?: string };
  imageAlt: string;
  order: string;
  status: (typeof CMS_STATUSES)[number];
  publishedAt: string;
};

const emptyForm = (): FormState => ({
  title: "",
  description: "",
  stats: "",
  icon: "sprout",
  color: "amber",
  image: undefined,
  imageAlt: "",
  order: "0",
  status: "brouillon",
  publishedAt: "",
});

export function ResearchAxisFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: ResearchAxisFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        title: item.title,
        description: item.description,
        stats: item.stats ?? "",
        icon: item.icon,
        color: item.color,
        image: item.image
          ? { url: item.image, publicId: item.imagePublicId }
          : undefined,
        imageAlt: item.imageAlt,
        order: String(item.order ?? 0),
        status: item.status,
        publishedAt: item.publishedAt
          ? new Date(item.publishedAt).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, item]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.image?.url) {
      toast.error("L'image est requise");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        stats: form.stats.trim() || undefined,
        icon: form.icon,
        color: form.color,
        image: form.image.url,
        imagePublicId: form.image.publicId,
        imageAlt: form.imageAlt.trim(),
        order: Number.parseInt(form.order, 10) || 0,
        status: form.status,
        publishedAt: form.publishedAt || undefined,
      };

      const url = item
        ? `/api/cms/research-axes/${item._id}`
        : "/api/cms/research-axes";
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

      toast.success(item ? "Axe mis à jour" : "Axe de recherche ajouté");
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
          <DialogTitle>
            {item ? "Modifier l'axe de recherche" : "Nouvel axe de recherche"}
          </DialogTitle>
          <DialogDescription>
            Ces axes alimentent la section « Recherche &amp; innovation » de la
            page d&apos;accueil et les « Axes de recherche » de la page /recherche.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="axis-title">Titre</Label>
            <Input
              id="axis-title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Ex. Fertilité des sols"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="axis-description">Description</Label>
            <textarea
              id="axis-description"
              className={cn(textareaClass, "min-h-[100px]")}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="axis-stats">Statistique (optionnel)</Label>
            <Input
              id="axis-stats"
              value={form.stats}
              onChange={(e) => setForm((prev) => ({ ...prev, stats: e.target.value }))}
              placeholder="Ex. 800+ échantillons analysés"
            />
            <p className="text-xs text-muted-foreground">
              Affichée en badge sur la page d&apos;accueil uniquement.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Icône</Label>
              <Select
                value={form.icon}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, icon: value as ResearchAxisIcon }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESEARCH_AXIS_ICONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {RESEARCH_AXIS_ICON_LABELS[icon]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Couleur</Label>
              <Select
                value={form.color}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, color: value as ResearchAxisColor }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESEARCH_AXIS_COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {RESEARCH_AXIS_COLOR_LABELS[color]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <CmsImageUpload
            value={form.image}
            onChange={(image) => setForm((prev) => ({ ...prev, image }))}
            folder="recherche"
            label="Image de l'axe (4/3)"
          />

          <div className="space-y-2">
            <Label htmlFor="axis-image-alt">Texte alternatif de l&apos;image</Label>
            <Input
              id="axis-image-alt"
              value={form.imageAlt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, imageAlt: e.target.value }))
              }
              placeholder="Description de l'image pour l'accessibilité"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="axis-order">Ordre</Label>
              <Input
                id="axis-order"
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, order: e.target.value }))
                }
              />
            </div>

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
              <Label htmlFor="axis-published-at">Publication</Label>
              <Input
                id="axis-published-at"
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
