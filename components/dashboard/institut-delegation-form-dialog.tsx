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
import type { SerializedInstitutDelegation } from "@/lib/services/institut/serialize-institut-delegation";

const textareaClass =
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(values: string[]): string {
  return values.join("\n");
}

type FormState = {
  name: string;
  shortName: string;
  organigrammeLabel: string;
  color: string;
  chefLieu: string;
  regionsCouvertes: string;
  superficie: string;
  population: string;
  typesDeSols: string;
  cultureDominantes: string;
  enjeuxPedologiques: string;
  missionsSpecifiques: string;
  delegueNom: string;
  delegueFonction: string;
  contactAdresse: string;
  contactTelephone: string;
  contactEmail: string;
  description: string;
  sortOrder: string;
  status: (typeof CMS_STATUSES)[number];
  slug: string;
};

const emptyForm = (): FormState => ({
  name: "",
  shortName: "",
  organigrammeLabel: "",
  color: "#7A8B2E",
  chefLieu: "",
  regionsCouvertes: "",
  superficie: "",
  population: "",
  typesDeSols: "",
  cultureDominantes: "",
  enjeuxPedologiques: "",
  missionsSpecifiques: "",
  delegueNom: "",
  delegueFonction: "Délégué pédoclimatique",
  contactAdresse: "",
  contactTelephone: "",
  contactEmail: "",
  description: "",
  sortOrder: "0",
  status: "brouillon",
  slug: "",
});

type InstitutDelegationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SerializedInstitutDelegation | null;
  onSaved: () => void;
};

export function InstitutDelegationFormDialog({
  open,
  onOpenChange,
  item,
  onSaved,
}: InstitutDelegationFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        name: item.name,
        shortName: item.shortName,
        organigrammeLabel: item.organigrammeLabel,
        color: item.color,
        chefLieu: item.chefLieu,
        regionsCouvertes: arrayToLines(item.regionsCouvertes),
        superficie: item.superficie,
        population: item.population,
        typesDeSols: arrayToLines(item.typesDeSols),
        cultureDominantes: arrayToLines(item.cultureDominantes),
        enjeuxPedologiques: arrayToLines(item.enjeuxPedologiques),
        missionsSpecifiques: arrayToLines(item.missionsSpecifiques),
        delegueNom: item.delegueNom,
        delegueFonction: item.delegueFonction,
        contactAdresse: item.contact.adresse,
        contactTelephone: item.contact.telephone,
        contactEmail: item.contact.email,
        description: item.description,
        sortOrder: String(item.sortOrder),
        status: item.status,
        slug: item.slug,
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
        name: form.name.trim(),
        shortName: form.shortName.trim(),
        organigrammeLabel: form.organigrammeLabel.trim() || undefined,
        color: form.color.trim(),
        chefLieu: form.chefLieu.trim(),
        regionsCouvertes: linesToArray(form.regionsCouvertes),
        superficie: form.superficie.trim(),
        population: form.population.trim(),
        typesDeSols: linesToArray(form.typesDeSols),
        cultureDominantes: linesToArray(form.cultureDominantes),
        enjeuxPedologiques: linesToArray(form.enjeuxPedologiques),
        missionsSpecifiques: linesToArray(form.missionsSpecifiques),
        delegueNom: form.delegueNom.trim(),
        delegueFonction: form.delegueFonction.trim(),
        contactAdresse: form.contactAdresse.trim(),
        contactTelephone: form.contactTelephone.trim(),
        contactEmail: form.contactEmail.trim(),
        description: form.description.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        status: form.status,
        slug: form.slug.trim() || undefined,
      };

      const url = item
        ? `/api/cms/institut/delegations/${item._id}`
        : "/api/cms/institut/delegations";
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

      toast.success(item ? "Délégation mise à jour" : "Délégation ajoutée");
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
          <DialogTitle>{item ? "Modifier la délégation" : "Nouvelle délégation"}</DialogTitle>
          <DialogDescription>
            Délégation pédoclimatique affichée sur l&apos;organigramme et sa page dédiée.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deleg-name">Nom complet</Label>
              <Input
                id="deleg-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deleg-short">Nom court</Label>
              <Input
                id="deleg-short"
                value={form.shortName}
                onChange={(e) => setForm((prev) => ({ ...prev, shortName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="deleg-org-label">Libellé organigramme</Label>
              <Input
                id="deleg-org-label"
                value={form.organigrammeLabel}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, organigrammeLabel: e.target.value }))
                }
                placeholder="Ex. Délégation Niayes"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deleg-color">Couleur</Label>
              <Input
                id="deleg-color"
                type="color"
                value={form.color}
                onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deleg-chef">Chef-lieu</Label>
              <Input
                id="deleg-chef"
                value={form.chefLieu}
                onChange={(e) => setForm((prev) => ({ ...prev, chefLieu: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deleg-slug">Slug URL</Label>
              <Input
                id="deleg-slug"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="niayes"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deleg-desc">Description</Label>
            <textarea
              id="deleg-desc"
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deleg-regions">Régions couvertes (une par ligne)</Label>
            <textarea
              id="deleg-regions"
              className={textareaClass}
              value={form.regionsCouvertes}
              onChange={(e) => setForm((prev) => ({ ...prev, regionsCouvertes: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deleg-superficie">Superficie</Label>
              <Input
                id="deleg-superficie"
                value={form.superficie}
                onChange={(e) => setForm((prev) => ({ ...prev, superficie: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deleg-pop">Population</Label>
              <Input
                id="deleg-pop"
                value={form.population}
                onChange={(e) => setForm((prev) => ({ ...prev, population: e.target.value }))}
                required
              />
            </div>
          </div>

          {(
            [
              ["typesDeSols", "Types de sols"],
              ["cultureDominantes", "Cultures dominantes"],
              ["enjeuxPedologiques", "Enjeux pédologiques"],
              ["missionsSpecifiques", "Missions spécifiques"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`deleg-${key}`}>{label} (une par ligne)</Label>
              <textarea
                id={`deleg-${key}`}
                className={textareaClass}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deleg-delegue">Délégué</Label>
              <Input
                id="deleg-delegue"
                value={form.delegueNom}
                onChange={(e) => setForm((prev) => ({ ...prev, delegueNom: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deleg-fonction">Fonction du délégué</Label>
              <Input
                id="deleg-fonction"
                value={form.delegueFonction}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, delegueFonction: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deleg-adresse">Adresse</Label>
            <Input
              id="deleg-adresse"
              value={form.contactAdresse}
              onChange={(e) => setForm((prev) => ({ ...prev, contactAdresse: e.target.value }))}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deleg-tel">Téléphone</Label>
              <Input
                id="deleg-tel"
                value={form.contactTelephone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactTelephone: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deleg-email">E-mail</Label>
              <Input
                id="deleg-email"
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                required
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
              <Label htmlFor="deleg-sort">Ordre (organigramme)</Label>
              <Input
                id="deleg-sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
              />
            </div>
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
