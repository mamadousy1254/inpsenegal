"use client";

import { useEffect, useMemo, useState } from "react";
import { FileTextIcon, Loader2Icon } from "lucide-react";
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
import { MISSION_TRANSPORT_LABELS } from "@/lib/constants/mission";
import {
  buildOrdreMissionFilename,
  downloadOrdreMissionPdf,
  generateOrdreMissionPdf,
} from "@/lib/services/mission/generate-ordre-mission-pdf";
import type { SerializedMission } from "@/lib/services/mission/serialize-mission";

type OrdreMissionDialogProps = {
  mission: SerializedMission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function defaultTransportHint(mission: SerializedMission | null) {
  if (!mission) return "";
  const plates = (mission.transport.immatriculationsVehicules ?? [])
    .map((p) => p.trim())
    .filter(Boolean);
  if (plates.length > 0) return plates.join(" / ");
  if (mission.transport.immatriculation?.trim()) {
    return mission.transport.immatriculation.trim();
  }
  if (mission.transport.moyen) {
    return MISSION_TRANSPORT_LABELS[mission.transport.moyen];
  }
  return "";
}

export function OrdreMissionDialog({
  mission,
  open,
  onOpenChange,
}: OrdreMissionDialogProps) {
  const [userId, setUserId] = useState<string>("");
  const [moyenTransport, setMoyenTransport] = useState("");
  const [generating, setGenerating] = useState(false);

  const participants = mission?.missionnaires ?? [];
  const transportHint = useMemo(() => defaultTransportHint(mission), [mission]);

  useEffect(() => {
    if (!open || !mission) {
      setUserId("");
      setMoyenTransport("");
      return;
    }
    setUserId(mission.chefMissionId || mission.missionnaires[0]?.userId || "");
    setMoyenTransport("");
  }, [open, mission]);

  const selected = participants.find((p) => p.userId === userId);

  const formatParticipantLabel = (
    p: (typeof participants)[number],
    { withChef = true }: { withChef?: boolean } = {},
  ) => {
    const parts = [p.fullname];
    if (withChef && p.userId === mission?.chefMissionId) {
      parts[0] = `${parts[0]} (Chef)`;
    }
    if (p.occupation?.trim()) {
      parts.push(p.occupation.trim());
    }
    return parts.join(" — ");
  };

  const handleGenerate = async () => {
    if (!mission || !userId) {
      toast.error("Sélectionnez une personne");
      return;
    }
    setGenerating(true);
    try {
      const blob = await generateOrdreMissionPdf({
        mission,
        participantUserId: userId,
        moyenTransportOverride: moyenTransport.trim() || undefined,
      });
      const fullname = selected?.fullname ?? "agent";
      downloadOrdreMissionPdf(blob, buildOrdreMissionFilename(mission, fullname));
      toast.success("Ordre de mission généré");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la génération",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileTextIcon className="size-5 text-[var(--inp-vert)]" />
            Ordre de mission
          </DialogTitle>
          <DialogDescription>
            Sélectionnez la personne concernée. La prise en charge sera toujours
            PDCVR.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Personne concernée</Label>
            <Select
              value={userId}
              onValueChange={(v) => setUserId(v ?? "")}
              disabled={!participants.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un missionnaire">
                  {selected ? formatParticipantLabel(selected) : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {participants.map((p) => (
                  <SelectItem key={p.userId} value={p.userId}>
                    {formatParticipantLabel(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && (
            <div className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Grade :</span>{" "}
                {selected.grade?.trim() || "—"}
              </p>
              <p className="mt-1">
                <span className="font-medium text-foreground">Fonction :</span>{" "}
                {selected.occupation || "—"}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="moyen-transport">
              Moyen de transport{" "}
              <span className="font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="moyen-transport"
              value={moyenTransport}
              onChange={(e) => setMoyenTransport(e.target.value)}
              placeholder={
                transportHint
                  ? `Par défaut : ${transportHint}`
                  : "Ex. AD 3899 ou Véhicule INP"
              }
            />
            <p className="text-xs text-muted-foreground">
              Si renseigné, ce texte apparaît sur l&apos;ordre. Sinon, le moyen de
              transport de la mission est utilisé.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
            disabled={generating || !userId}
            onClick={() => void handleGenerate()}
          >
            {generating ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <FileTextIcon className="size-4" />
            )}
            Générer le PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
