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

export type CmsVideoItem = {
  _id: string;
  title: string;
  platform: string;
  watchUrl: string;
  embedUrl: string;
  status: (typeof CMS_STATUSES)[number];
  publishedAt?: string;
};

type CmsVideoFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: CmsVideoItem | null;
  onSaved: () => void;
};

type FormState = {
  title: string;
  watchUrl: string;
  status: (typeof CMS_STATUSES)[number];
  publishedAt: string;
};

const emptyForm = (): FormState => ({
  title: "",
  watchUrl: "",
  status: "brouillon",
  publishedAt: "",
});

export function CmsVideoFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: CmsVideoFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        title: item.title,
        watchUrl: item.watchUrl,
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
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        watchUrl: form.watchUrl.trim(),
        status: form.status,
        publishedAt: form.publishedAt || undefined,
      };

      const url = item ? `/api/cms/videos/${item._id}` : "/api/cms/videos";
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

      toast.success(item ? "Vidéo mise à jour" : "Vidéo ajoutée");
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
          <DialogTitle>{item ? "Modifier la vidéo" : "Nouvelle vidéo INP"}</DialogTitle>
          <DialogDescription>
            Collez un lien YouTube, Facebook, Vimeo, Dailymotion, un lien de
            fichier vidéo (.mp4…) ou tout autre lien. L&apos;intégration est
            générée automatiquement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Titre</Label>
            <Input
              id="video-title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="watch-url">Lien de la vidéo</Label>
            <Input
              id="watch-url"
              value={form.watchUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, watchUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/... ou un lien .mp4"
              required
            />
            <p className="text-xs text-muted-foreground">
              YouTube, Facebook, Vimeo, Dailymotion, fichier vidéo direct ou
              autre lien.
            </p>
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
              <Label htmlFor="video-published-at">Date de publication</Label>
              <Input
                id="video-published-at"
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
