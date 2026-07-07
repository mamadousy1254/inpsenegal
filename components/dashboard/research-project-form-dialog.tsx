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
import {
  CMS_STATUSES,
  CMS_STATUS_LABELS,
  RESEARCH_PROJECT_STATUSES,
  RESEARCH_PROJECT_STATUS_LABELS,
  type ResearchProjectStatus,
} from "@/lib/constants/cms";
import type { SerializedResearchProject } from "@/lib/services/cms/serialize-research-project";
import { cn } from "@/lib/utils";

const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

type ResearchProjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SerializedResearchProject | null;
  onSaved: () => void;
};

type FormState = {
  title: string;
  lead: string;
  year: string;
  projectStatus: ResearchProjectStatus;
  description: string;
  order: string;
  status: (typeof CMS_STATUSES)[number];
  publishedAt: string;
};

const emptyForm = (): FormState => ({
  title: "",
  lead: "",
  year: "",
  projectStatus: "en_cours",
  description: "",
  order: "0",
  status: "brouillon",
  publishedAt: "",
});

export function ResearchProjectFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: ResearchProjectFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        title: item.title,
        lead: item.lead,
        year: item.year,
        projectStatus: item.projectStatus,
        description: item.description,
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
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        lead: form.lead.trim(),
        year: form.year.trim(),
        projectStatus: form.projectStatus,
        description: form.description.trim(),
        order: Number.parseInt(form.order, 10) || 0,
        status: form.status,
        publishedAt: form.publishedAt || undefined,
      };

      const url = item
        ? `/api/cms/research-projects/${item._id}`
        : "/api/cms/research-projects";
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

      toast.success(item ? "Projet mis à jour" : "Projet ajouté");
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
            {item ? "Modifier le projet" : "Nouveau projet de recherche"}
          </DialogTitle>
          <DialogDescription>
            Ces projets alimentent la section « Projets en cours » de la page
            /recherche.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-title">Titre</Label>
            <Input
              id="project-title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Ex. Cartographie numérique des sols de la Casamance"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-lead">Responsable</Label>
              <Input
                id="project-lead"
                value={form.lead}
                onChange={(e) => setForm((prev) => ({ ...prev, lead: e.target.value }))}
                placeholder="Ex. Dr. Amadou Diallo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-year">Période</Label>
              <Input
                id="project-year"
                value={form.year}
                onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                placeholder="Ex. 2024 – 2026"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <textarea
              id="project-description"
              className={cn(textareaClass, "min-h-[100px]")}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>État du projet</Label>
              <Select
                value={form.projectStatus}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    projectStatus: value as ResearchProjectStatus,
                  }))
                }
                items={RESEARCH_PROJECT_STATUS_LABELS}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESEARCH_PROJECT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {RESEARCH_PROJECT_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                items={CMS_STATUS_LABELS}
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
              <Label htmlFor="project-order">Ordre</Label>
              <Input
                id="project-order"
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, order: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-published-at">Date de publication</Label>
            <Input
              id="project-published-at"
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
              }
            />
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
