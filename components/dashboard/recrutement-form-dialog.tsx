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
  RECRUTEMENT_CMS_STATUSES,
  RECRUTEMENT_CMS_STATUS_LABELS,
  RECRUTEMENT_OFFER_STATUSES,
  RECRUTEMENT_OFFER_STATUS_LABELS,
  RECRUTEMENT_TYPES,
  RECRUTEMENT_TYPE_LABELS,
} from "@/lib/constants/recrutement";
import type { SerializedRecrutement } from "@/lib/services/recrutement/serialize-recrutement";

const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

type RecrutementFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SerializedRecrutement | null;
  onSaved: () => void;
};

type FormState = {
  title: string;
  type: (typeof RECRUTEMENT_TYPES)[number];
  shortDescription: string;
  location: string;
  contractType: string;
  publishedAt: string;
  deadline: string;
  deadlineLabel: string;
  offerStatus: (typeof RECRUTEMENT_OFFER_STATUSES)[number];
  emailContact: string;
  references: string;
  slug: string;
  status: (typeof RECRUTEMENT_CMS_STATUSES)[number];
};

const emptyForm = (): FormState => ({
  title: "",
  type: "recrutement",
  shortDescription: "",
  location: "",
  contractType: "",
  publishedAt: "",
  deadline: "",
  deadlineLabel: "",
  offerStatus: "ouvert",
  emailContact: "rh@inp.sn",
  references: "",
  slug: "",
  status: "brouillon",
});

export function RecrutementFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: RecrutementFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setForm({
        title: item.title,
        type: item.type,
        shortDescription: item.shortDescription,
        location: item.location,
        contractType: item.contractType,
        publishedAt: "",
        deadline: "",
        deadlineLabel: item.deadline,
        offerStatus: item.offerStatus,
        emailContact: item.emailContact,
        references: item.references,
        slug: item.slug,
        status: item.status,
      });
    } else {
      setForm(emptyForm());
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        type: form.type,
        shortDescription: form.shortDescription,
        location: form.location,
        contractType: form.contractType,
        publishedAt: form.publishedAt || undefined,
        deadline: form.deadline || undefined,
        deadlineLabel: form.deadlineLabel || undefined,
        offerStatus: form.offerStatus,
        emailContact: form.emailContact,
        references: form.references,
        slug: form.slug || undefined,
        status: form.status,
      };

      const res = await fetch(
        item ? `/api/cms/recrutements/${item._id}` : "/api/cms/recrutements",
        {
          method: item ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }

      toast.success(item ? "Offre mise à jour" : "Offre créée");
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier l'offre" : "Nouvelle offre"}</DialogTitle>
          <DialogDescription>
            Publiée sur la page publique /candidature-spontanee lorsque le statut est « Publié »
            et l&apos;offre est « Ouverte ».
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rec-title">Titre *</Label>
            <Input
              id="rec-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as FormState["type"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECRUTEMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {RECRUTEMENT_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Référence *</Label>
              <Input
                value={form.references}
                onChange={(e) => setForm({ ...form, references: e.target.value })}
                placeholder="INP/2026/RH/001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description courte *</Label>
            <textarea
              className={textareaClass}
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Lieu *</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type de contrat *</Label>
              <Input
                value={form.contractType}
                onChange={(e) => setForm({ ...form, contractType: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Date limite (libellé affiché)</Label>
              <Input
                value={form.deadlineLabel}
                onChange={(e) => setForm({ ...form, deadlineLabel: e.target.value })}
                placeholder="31 juillet 2026"
              />
            </div>
            <div className="space-y-2">
              <Label>Email contact RH *</Label>
              <Input
                type="email"
                value={form.emailContact}
                onChange={(e) => setForm({ ...form, emailContact: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Statut publication</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as FormState["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECRUTEMENT_CMS_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {RECRUTEMENT_CMS_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut offre</Label>
              <Select
                value={form.offerStatus}
                onValueChange={(v) =>
                  setForm({ ...form, offerStatus: v as FormState["offerStatus"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECRUTEMENT_OFFER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {RECRUTEMENT_OFFER_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Slug (optionnel)</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto-généré depuis le titre"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
