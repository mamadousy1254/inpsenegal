"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  MapPinIcon,
  PaperclipIcon,
  PlaneIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  MissionAgentPicker,
  type MissionAgentOption,
} from "@/components/dashboard/missions/mission-agent-picker";
import {
  MissionAttachmentUpload,
  type MissionAttachmentDraft,
} from "@/components/dashboard/missions/mission-attachment-upload";
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
  MISSION_PRIORITIES,
  MISSION_PRIORITY_LABELS,
  MISSION_TRANSPORT_LABELS,
  MISSION_TRANSPORT_MEANS,
  MISSION_TYPE_LABELS,
  MISSION_TYPES,
  type MissionPriority,
  type MissionTransportMean,
  type MissionType,
} from "@/lib/constants/mission";
import { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";
import {
  computeMissionBudgetPrevu,
  computeMissionDurationDays,
  isInternationalMission,
} from "@/lib/services/mission/compute-mission";
import type { SerializedMission } from "@/lib/services/mission/serialize-mission";
import { canManageAllMissions } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "general", label: "Général", icon: PlaneIcon },
  { id: "location", label: "Localisation", icon: MapPinIcon },
  { id: "team", label: "Dates & équipe", icon: UsersIcon },
  { id: "budget", label: "Transport & budget", icon: WalletIcon },
  { id: "attachments", label: "Pièces & envoi", icon: PaperclipIcon },
] as const;

type StepId = (typeof STEPS)[number]["id"];

type MissionFormState = {
  convocationId: string;
  objet: string;
  description: string;
  type: MissionType;
  priorite: MissionPriority;
  direction: string;
  projetLabel: string;
  pays: string;
  region: string;
  departement: string;
  commune: string;
  village: string;
  adressePrecise: string;
  latitude: string;
  longitude: string;
  dateDepart: string;
  heureDepart: string;
  dateRetour: string;
  heureRetour: string;
  chefMissionId: string;
  missionnaireIds: string[];
  transport: {
    moyen: MissionTransportMean | "";
    immatriculation: string;
    chauffeur: string;
    kilometrage: string;
  };
  budget: {
    perDiem: string;
    hebergement: string;
    transport: string;
    carburant: string;
    peage: string;
    communication: string;
    divers: string;
  };
  attachments: MissionAttachmentDraft[];
};

type MissionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  missionId?: string | null;
};

function toDateInput(value: string) {
  return value.slice(0, 10);
}

function missionToFormState(mission: SerializedMission): MissionFormState {
  return {
    convocationId: mission.convocationId ?? "",
    objet: mission.objet,
    description: mission.description ?? "",
    type: mission.type,
    priorite: mission.priorite,
    direction: mission.direction ?? "",
    projetLabel: mission.projetLabel ?? "",
    pays: mission.pays,
    region: mission.region ?? "",
    departement: mission.departement ?? "",
    commune: mission.commune ?? "",
    village: mission.village ?? "",
    adressePrecise: mission.adressePrecise ?? "",
    latitude: mission.latitude !== undefined ? String(mission.latitude) : "",
    longitude: mission.longitude !== undefined ? String(mission.longitude) : "",
    dateDepart: toDateInput(mission.dateDepart),
    heureDepart: mission.heureDepart ?? "08:00",
    dateRetour: toDateInput(mission.dateRetour),
    heureRetour: mission.heureRetour ?? "18:00",
    chefMissionId: mission.chefMissionId,
    missionnaireIds: mission.missionnaires.map((m) => m.userId),
    transport: {
      moyen: mission.transport.moyen ?? "",
      immatriculation: mission.transport.immatriculation ?? "",
      chauffeur: mission.transport.chauffeur ?? "",
      kilometrage:
        mission.transport.kilometrage !== undefined
          ? String(mission.transport.kilometrage)
          : "",
    },
    budget: {
      perDiem: mission.budget.perDiem ? String(mission.budget.perDiem) : "",
      hebergement: mission.budget.hebergement ? String(mission.budget.hebergement) : "",
      transport: mission.budget.transport ? String(mission.budget.transport) : "",
      carburant: mission.budget.carburant ? String(mission.budget.carburant) : "",
      peage: mission.budget.peage ? String(mission.budget.peage) : "",
      communication: mission.budget.communication
        ? String(mission.budget.communication)
        : "",
      divers: mission.budget.divers ? String(mission.budget.divers) : "",
    },
    attachments: mission.attachments,
  };
}

const SELECT_IN_DIALOG = {
  side: "bottom" as const,
  alignItemWithTrigger: false,
  className: "z-[200] max-h-64",
};

function emptyForm(userId: string): MissionFormState {
  return {
    convocationId: "",
    objet: "",
    description: "",
    type: "terrain",
    priorite: "normale",
    direction: "",
    projetLabel: "",
    pays: "Sénégal",
    region: "",
    departement: "",
    commune: "",
    village: "",
    adressePrecise: "",
    latitude: "",
    longitude: "",
    dateDepart: "",
    heureDepart: "08:00",
    dateRetour: "",
    heureRetour: "18:00",
    chefMissionId: userId,
    missionnaireIds: userId ? [userId] : [],
    transport: {
      moyen: "",
      immatriculation: "",
      chauffeur: "",
      kilometrage: "",
    },
    budget: {
      perDiem: "",
      hebergement: "",
      transport: "",
      carburant: "",
      peage: "",
      communication: "",
      divers: "",
    },
    attachments: [],
  };
}

function parseNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value.replace(/\s/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildDestinationLabel(form: MissionFormState) {
  return [form.commune, form.departement, form.region, form.pays]
    .filter(Boolean)
    .join(", ");
}

export function MissionFormDialog({
  open,
  onOpenChange,
  onSuccess,
  missionId = null,
}: MissionFormDialogProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";
  const isEditMode = Boolean(missionId);

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<MissionFormState>(() => emptyForm(userId));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingMission, setLoadingMission] = useState(false);
  const [submitMode, setSubmitMode] = useState<"draft" | "submit" | "validate">("draft");
  const [convocationOptions, setConvocationOptions] = useState<
    { id: string; title: string; meetingAt: string }[]
  >([]);
  const [loadingConvocation, setLoadingConvocation] = useState(false);

  const canValidateOnCreate = canManageAllMissions(
    (session?.user?.role ?? "agent") as UserRole,
  );

  const currentUser = useMemo<MissionAgentOption | null>(() => {
    if (!session?.user?.id) return null;
    return {
      _id: session.user.id,
      firstname: session.user.firstname ?? "",
      lastname: session.user.lastname ?? "",
      email: session.user.email ?? "",
      occupation: session.user.occupation,
    };
  }, [session?.user]);

  const resetForm = useCallback(() => {
    setStepIndex(0);
    setForm(emptyForm(userId));
    setErrors({});
    setSubmitMode("draft");
  }, [userId]);

  useEffect(() => {
    if (!open || isEditMode) return;

    fetch("/api/missions/convocations")
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setConvocationOptions(data.items ?? []))
      .catch(() => setConvocationOptions([]));
  }, [open, isEditMode]);

  const applyConvocationPrefill = async (convocationId: string) => {
    if (!convocationId) return;
    setLoadingConvocation(true);
    try {
      const res = await fetch(`/api/missions/convocations/${convocationId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setForm((prev) => ({
        ...prev,
        convocationId,
        objet: data.objet || prev.objet,
        description: data.description || prev.description,
        type: data.type || prev.type,
        dateDepart: data.dateDepart || prev.dateDepart,
        dateRetour: data.dateRetour || prev.dateRetour,
        heureDepart: data.heureDepart || prev.heureDepart,
        heureRetour: data.heureRetour || prev.heureRetour,
        adressePrecise: data.adressePrecise || prev.adressePrecise,
        chefMissionId: data.chefMissionId || prev.chefMissionId,
        missionnaireIds:
          data.missionnaireIds?.length > 0 ? data.missionnaireIds : prev.missionnaireIds,
        attachments:
          data.attachments?.length > 0
            ? [...prev.attachments, ...data.attachments]
            : prev.attachments,
      }));
      toast.success("Données importées depuis la convocation");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import convocation impossible");
      setForm((prev) => ({ ...prev, convocationId: "" }));
    } finally {
      setLoadingConvocation(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (!missionId) {
      resetForm();
      return;
    }

    let cancelled = false;
    setLoadingMission(true);
    setStepIndex(0);
    setErrors({});

    fetch(`/api/missions/${missionId}`)
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) throw new Error(data.error);
        setForm(missionToFormState(data as SerializedMission));
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Erreur de chargement");
          onOpenChange(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingMission(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, missionId, resetForm, onOpenChange]);

  const durationDays = useMemo(() => {
    if (!form.dateDepart || !form.dateRetour) return 0;
    return computeMissionDurationDays({
      dateDepart: form.dateDepart,
      heureDepart: form.heureDepart,
      dateRetour: form.dateRetour,
      heureRetour: form.heureRetour,
    });
  }, [form.dateDepart, form.dateRetour, form.heureDepart, form.heureRetour]);

  const budgetPrevu = useMemo(
    () =>
      computeMissionBudgetPrevu({
        perDiem: parseNumber(form.budget.perDiem) ?? 0,
        hebergement: parseNumber(form.budget.hebergement) ?? 0,
        transport: parseNumber(form.budget.transport) ?? 0,
        carburant: parseNumber(form.budget.carburant) ?? 0,
        peage: parseNumber(form.budget.peage) ?? 0,
        communication: parseNumber(form.budget.communication) ?? 0,
        divers: parseNumber(form.budget.divers) ?? 0,
      }),
    [form.budget],
  );

  const updateForm = <K extends keyof MissionFormState>(
    key: K,
    value: MissionFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[String(key)];
      return next;
    });
  };

  const validateStep = (step: StepId): boolean => {
    const nextErrors: Record<string, string> = {};

    if (step === "general") {
      if (!form.objet.trim()) nextErrors.objet = "L'objet est requis";
    }

    if (step === "location") {
      if (!form.pays.trim()) nextErrors.pays = "Le pays est requis";
    }

    if (step === "team") {
      if (!form.dateDepart) nextErrors.dateDepart = "Date de départ requise";
      if (!form.dateRetour) nextErrors.dateRetour = "Date de retour requise";
      if (
        form.dateDepart &&
        form.dateRetour &&
        new Date(form.dateRetour) < new Date(form.dateDepart)
      ) {
        nextErrors.dateRetour = "La date de retour doit être postérieure au départ";
      }
      if (form.missionnaireIds.length === 0) {
        nextErrors.missionnaireIds = "Au moins un missionnaire";
      }
      if (!form.chefMissionId) {
        nextErrors.chefMissionId = "Chef de mission requis";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    const step = STEPS[stepIndex]?.id;
    if (!step || !validateStep(step)) return;
    setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (mode: "draft" | "submit" | "validate") => {
    for (const step of STEPS) {
      if (!validateStep(step.id)) {
        setStepIndex(STEPS.findIndex((s) => s.id === step.id));
        return;
      }
    }

    setSubmitting(true);
    setSubmitMode(mode);

    try {
      const payload = {
        objet: form.objet.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        priorite: form.priorite,
        direction: form.direction.trim() || undefined,
        projetLabel: form.projetLabel.trim() || undefined,
        pays: form.pays.trim(),
        region: form.region.trim() || undefined,
        departement: form.departement.trim() || undefined,
        commune: form.commune.trim() || undefined,
        village: form.village.trim() || undefined,
        adressePrecise: form.adressePrecise.trim() || undefined,
        latitude: parseNumber(form.latitude),
        longitude: parseNumber(form.longitude),
        dateDepart: form.dateDepart,
        heureDepart: form.heureDepart || undefined,
        dateRetour: form.dateRetour,
        heureRetour: form.heureRetour || undefined,
        chefMissionId: form.chefMissionId,
        missionnaireIds: form.missionnaireIds,
        transport: {
          moyen: form.transport.moyen || undefined,
          immatriculation: form.transport.immatriculation.trim() || undefined,
          chauffeur: form.transport.chauffeur.trim() || undefined,
          kilometrage: parseNumber(form.transport.kilometrage),
        },
        budget: {
          perDiem: parseNumber(form.budget.perDiem),
          hebergement: parseNumber(form.budget.hebergement),
          transport: parseNumber(form.budget.transport),
          carburant: parseNumber(form.budget.carburant),
          peage: parseNumber(form.budget.peage),
          communication: parseNumber(form.budget.communication),
          divers: parseNumber(form.budget.divers),
        },
        attachments: form.attachments,
        ...(form.convocationId && !isEditMode
          ? { convocationId: form.convocationId }
          : {}),
        ...(isEditMode
          ? {}
          : {
              submitForValidation: mode === "submit",
              validateOnCreate: mode === "validate",
            }),
      };

      const res = await fetch(
        isEditMode ? `/api/missions/${missionId}` : "/api/missions",
        {
          method: isEditMode ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            (isEditMode ? "Erreur lors de la mise à jour" : "Erreur lors de la création"),
        );
      }

      toast.success(
        isEditMode
          ? "Mission mise à jour"
          : mode === "validate"
            ? "Mission créée et validée"
            : mode === "submit"
              ? "Mission soumise pour validation"
              : "Mission enregistrée en brouillon",
      );
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>
            {isEditMode ? "Modifier la mission" : "Nouvelle mission"}
          </DialogTitle>
          <DialogDescription>
            Complétez les étapes pour créer un ordre de mission.
          </DialogDescription>
        </DialogHeader>

        <div className="border-b px-4 py-3">
          <ol className="flex gap-1 overflow-x-auto pb-1">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === stepIndex;
              const isDone = index < stepIndex;
              return (
                <li key={step.id} className="min-w-[108px] flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (index <= stepIndex) setStepIndex(index);
                    }}
                    className={cn(
                      "flex w-full flex-col items-center gap-1 rounded-lg px-2 py-2 text-center transition-colors",
                      isActive && "bg-[var(--inp-vert)]/8",
                      isDone && "opacity-80",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                        isActive || isDone
                          ? "border-[var(--inp-vert)] bg-[var(--inp-vert)] text-white"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {isDone ? <CheckIcon className="size-4" /> : <Icon className="size-4" />}
                    </span>
                    <span className="text-[11px] font-medium leading-tight">{step.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadingMission ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
          {currentStep?.id === "general" && (
            <div className="space-y-4">
              {!isEditMode && convocationOptions.length > 0 && (
                <div className="space-y-2">
                  <Label>Convocation source (optionnel)</Label>
                  <Select
                    value={form.convocationId || "none"}
                    onValueChange={(value) => {
                      const nextId = value === "none" ? "" : (value ?? "");
                      setForm((prev) => ({ ...prev, convocationId: nextId }));
                      if (nextId) void applyConvocationPrefill(nextId);
                    }}
                    disabled={loadingConvocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Importer depuis une convocation" />
                    </SelectTrigger>
                    <SelectContent {...SELECT_IN_DIALOG}>
                      <SelectItem value="none">Aucune convocation</SelectItem>
                      {convocationOptions.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.title} —{" "}
                          {new Date(item.meetingAt).toLocaleDateString("fr-FR")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Pré-remplit l&apos;objet, les dates, l&apos;équipe et les pièces jointes.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="mission-objet">Objet de la mission *</Label>
                <Input
                  id="mission-objet"
                  value={form.objet}
                  onChange={(e) => updateForm("objet", e.target.value)}
                  placeholder="Ex. Supervision des activités de dépistage"
                />
                {errors.objet && (
                  <p className="text-xs text-destructive">{errors.objet}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission-description">Description</Label>
                <textarea
                  id="mission-description"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  rows={4}
                  className="flex min-h-[96px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  placeholder="Contexte, objectifs, résultats attendus…"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      updateForm("type", (value ?? "terrain") as MissionType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent {...SELECT_IN_DIALOG}>
                      {MISSION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {MISSION_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select
                    value={form.priorite}
                    onValueChange={(value) =>
                      updateForm("priorite", (value ?? "normale") as MissionPriority)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent {...SELECT_IN_DIALOG}>
                      {MISSION_PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {MISSION_PRIORITY_LABELS[priority]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission-direction">Direction</Label>
                  <Input
                    id="mission-direction"
                    value={form.direction}
                    onChange={(e) => updateForm("direction", e.target.value)}
                    placeholder="Ex. Direction des programmes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission-projet">Projet / programme</Label>
                  <Input
                    id="mission-projet"
                    value={form.projetLabel}
                    onChange={(e) => updateForm("projetLabel", e.target.value)}
                    placeholder="Libellé du projet associé"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep?.id === "location" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission-pays">Pays *</Label>
                  <Input
                    id="mission-pays"
                    value={form.pays}
                    onChange={(e) => updateForm("pays", e.target.value)}
                  />
                  {errors.pays && (
                    <p className="text-xs text-destructive">{errors.pays}</p>
                  )}
                  {isInternationalMission(form.pays) && (
                    <p className="text-xs text-amber-700">Mission internationale détectée</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Région</Label>
                  <Select
                    value={form.region || "none"}
                    onValueChange={(value) =>
                      updateForm("region", value === "none" ? "" : (value ?? ""))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent {...SELECT_IN_DIALOG}>
                      <SelectItem value="none">—</SelectItem>
                      {SENEGAL_REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission-departement">Département</Label>
                  <Input
                    id="mission-departement"
                    value={form.departement}
                    onChange={(e) => updateForm("departement", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission-commune">Commune</Label>
                  <Input
                    id="mission-commune"
                    value={form.commune}
                    onChange={(e) => updateForm("commune", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission-village">Village / quartier</Label>
                  <Input
                    id="mission-village"
                    value={form.village}
                    onChange={(e) => updateForm("village", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission-adresse">Adresse précise</Label>
                  <Input
                    id="mission-adresse"
                    value={form.adressePrecise}
                    onChange={(e) => updateForm("adressePrecise", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission-latitude">Latitude (optionnel)</Label>
                  <Input
                    id="mission-latitude"
                    value={form.latitude}
                    onChange={(e) => updateForm("latitude", e.target.value)}
                    placeholder="Ex. 14.6928"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission-longitude">Longitude (optionnel)</Label>
                  <Input
                    id="mission-longitude"
                    value={form.longitude}
                    onChange={(e) => updateForm("longitude", e.target.value)}
                    placeholder="Ex. -17.4467"
                  />
                </div>
              </div>

              {buildDestinationLabel(form) && (
                <div className="rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm">
                  Destination : <strong>{buildDestinationLabel(form)}</strong>
                </div>
              )}
            </div>
          )}

          {currentStep?.id === "team" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission-date-depart">Date de départ *</Label>
                  <Input
                    id="mission-date-depart"
                    type="date"
                    value={form.dateDepart}
                    onChange={(e) => updateForm("dateDepart", e.target.value)}
                  />
                  {errors.dateDepart && (
                    <p className="text-xs text-destructive">{errors.dateDepart}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission-heure-depart">Heure de départ</Label>
                  <Input
                    id="mission-heure-depart"
                    type="time"
                    value={form.heureDepart}
                    onChange={(e) => updateForm("heureDepart", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission-date-retour">Date de retour *</Label>
                  <Input
                    id="mission-date-retour"
                    type="date"
                    value={form.dateRetour}
                    min={form.dateDepart || undefined}
                    onChange={(e) => updateForm("dateRetour", e.target.value)}
                  />
                  {errors.dateRetour && (
                    <p className="text-xs text-destructive">{errors.dateRetour}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission-heure-retour">Heure de retour</Label>
                  <Input
                    id="mission-heure-retour"
                    type="time"
                    value={form.heureRetour}
                    onChange={(e) => updateForm("heureRetour", e.target.value)}
                  />
                </div>
              </div>

              {durationDays > 0 && (
                <p className="text-sm text-muted-foreground">
                  Durée estimée : <strong>{durationDays} jour(s)</strong>
                </p>
              )}

              <MissionAgentPicker
                selectedIds={form.missionnaireIds}
                chefMissionId={form.chefMissionId}
                onSelectedChange={(ids) => updateForm("missionnaireIds", ids)}
                onChefChange={(id) => updateForm("chefMissionId", id)}
                currentUser={currentUser}
                disabled={submitting}
              />
              {errors.missionnaireIds && (
                <p className="text-xs text-destructive">{errors.missionnaireIds}</p>
              )}
            </div>
          )}

          {currentStep?.id === "budget" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Moyen de transport</Label>
                  <Select
                    value={form.transport.moyen || "none"}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        transport: {
                          ...prev.transport,
                          moyen:
                            value === "none" ? "" : ((value ?? "") as MissionTransportMean),
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent {...SELECT_IN_DIALOG}>
                      <SelectItem value="none">—</SelectItem>
                      {MISSION_TRANSPORT_MEANS.map((mean) => (
                        <SelectItem key={mean} value={mean}>
                          {MISSION_TRANSPORT_LABELS[mean]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission-immatriculation">Immatriculation</Label>
                  <Input
                    id="mission-immatriculation"
                    value={form.transport.immatriculation}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        transport: { ...prev.transport, immatriculation: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mission-chauffeur">Chauffeur</Label>
                  <Input
                    id="mission-chauffeur"
                    value={form.transport.chauffeur}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        transport: { ...prev.transport, chauffeur: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission-kilometrage">Kilométrage estimé</Label>
                  <Input
                    id="mission-kilometrage"
                    inputMode="numeric"
                    value={form.transport.kilometrage}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        transport: { ...prev.transport, kilometrage: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["perDiem", "Per diem total"],
                    ["hebergement", "Hébergement"],
                    ["transport", "Transport"],
                    ["carburant", "Carburant"],
                    ["peage", "Péage"],
                    ["communication", "Communication"],
                    ["divers", "Divers"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`mission-budget-${key}`}>{label} (FCFA)</Label>
                    <Input
                      id={`mission-budget-${key}`}
                      inputMode="numeric"
                      value={form.budget[key]}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          budget: { ...prev.budget, [key]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[var(--inp-vert)]/20 bg-[var(--inp-vert)]/5 px-4 py-3 text-sm">
                Budget prévisionnel total :{" "}
                <strong>{budgetPrevu.toLocaleString("fr-FR")} FCFA</strong>
              </div>
            </div>
          )}

          {currentStep?.id === "attachments" && (
            <div className="space-y-5">
              <MissionAttachmentUpload
                attachments={form.attachments}
                onChange={(attachments) => updateForm("attachments", attachments)}
                disabled={submitting}
              />

              <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm">
                <p className="font-semibold text-foreground">Récapitulatif</p>
                <dl className="mt-3 space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Objet</dt>
                    <dd className="text-right font-medium">{form.objet || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Destination</dt>
                    <dd className="text-right">{buildDestinationLabel(form) || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Période</dt>
                    <dd className="text-right">
                      {form.dateDepart && form.dateRetour
                        ? `${form.dateDepart} → ${form.dateRetour}`
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Missionnaires</dt>
                    <dd className="text-right">{form.missionnaireIds.length}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Budget prévu</dt>
                    <dd className="text-right font-medium">
                      {budgetPrevu.toLocaleString("fr-FR")} FCFA
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Pièces jointes</dt>
                    <dd className="text-right">{form.attachments.length}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
            </>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4 sm:justify-between">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            {stepIndex > 0 && (
              <Button type="button" variant="outline" onClick={goBack} disabled={submitting}>
                <ChevronLeftIcon className="size-4" />
                Retour
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {isLastStep ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting || loadingMission}
                  onClick={() => void handleSubmit("draft")}
                >
                  {submitting && submitMode === "draft" ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : null}
                  {isEditMode ? "Enregistrer" : "Enregistrer brouillon"}
                </Button>
                {!isEditMode && (
                  <Button
                    type="button"
                    disabled={submitting || loadingMission}
                    className="bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
                    onClick={() => void handleSubmit("submit")}
                  >
                    {submitting && submitMode === "submit" ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : null}
                    Soumettre pour validation
                  </Button>
                )}
                {!isEditMode && canValidateOnCreate && (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={submitting || loadingMission}
                    onClick={() => void handleSubmit("validate")}
                  >
                    {submitting && submitMode === "validate" ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : null}
                    Valider
                  </Button>
                )}
              </>
            ) : (
              <Button
                type="button"
                disabled={submitting || loadingMission}
                className="bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
                onClick={goNext}
              >
                Suivant
                <ChevronRightIcon className="size-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
