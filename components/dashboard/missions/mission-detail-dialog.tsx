"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ExternalLinkIcon,
  FileTextIcon,
  Link2Icon,
  Loader2Icon,
  MapPinIcon,
  PencilIcon,
  PlaneIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { toast } from "sonner";

import { MissionStatusBadge } from "@/components/dashboard/missions/mission-status-badge";
import { MissionTypeBadge } from "@/components/dashboard/missions/mission-type-badge";
import { MissionValidationStepper } from "@/components/dashboard/missions/mission-validation-stepper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MISSION_ATTACHMENT_TYPE_LABELS,
  MISSION_PRIORITY_LABELS,
  MISSION_TRANSPORT_LABELS,
  MISSION_VALIDATION_STEP_LABELS,
} from "@/lib/constants/mission";
import type { UserRole } from "@/lib/permissions/roles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildMissionSessionUser,
  getMissionDetailPermissions,
} from "@/lib/services/mission/mission-ui-permissions";
import type { SerializedMission } from "@/lib/services/mission/serialize-mission";
import { cn } from "@/lib/utils";

type MissionDetailDialogProps = {
  missionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
  onEdit?: (missionId: string) => void;
};

function formatDay(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBudget(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}

function toDateInput(value: string) {
  return value.slice(0, 10);
}

function InfoBlock({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-muted/15 p-3", className)}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

export function MissionDetailDialog({
  missionId,
  open,
  onOpenChange,
  onUpdated,
  onEdit,
}: MissionDetailDialogProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const [mission, setMission] = useState<SerializedMission | null>(null);
  const [validateOpen, setValidateOpen] = useState(false);
  const [validateAction, setValidateAction] = useState<"approve" | "reject">("approve");
  const [validateComment, setValidateComment] = useState("");

  const [terrainObservation, setTerrainObservation] = useState("");
  const [terrainLat, setTerrainLat] = useState("");
  const [terrainLng, setTerrainLng] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState<"faible" | "moyenne" | "grave">(
    "faible",
  );
  const [prolongationEndDate, setProlongationEndDate] = useState("");
  const [prolongationJustification, setProlongationJustification] = useState("");
  const [prolongationReviewComment, setProlongationReviewComment] = useState("");
  const [reportResume, setReportResume] = useState("");
  const [reportActivites, setReportActivites] = useState("");
  const [reportResultats, setReportResultats] = useState("");
  const [reportDifficultes, setReportDifficultes] = useState("");
  const [reportRecommandations, setReportRecommandations] = useState("");
  const [reportPersonnes, setReportPersonnes] = useState("");

  const role = session?.user?.role as UserRole | undefined;
  const userId = session?.user?.id;

  const fetchMission = useCallback(async () => {
    if (!missionId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/missions/${missionId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMission(data);
      setReportResume(data.rapport?.resume ?? "");
      setReportActivites(data.rapport?.activitesRealisees ?? "");
      setReportResultats(data.rapport?.resultats ?? "");
      setReportDifficultes(data.rapport?.difficultes ?? "");
      setReportRecommandations(data.rapport?.recommandations ?? "");
      setReportPersonnes(data.rapport?.personnesRencontrees ?? "");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur de chargement");
      setMission(null);
    } finally {
      setLoading(false);
    }
  }, [missionId]);

  useEffect(() => {
    if (!open || !missionId) {
      setMission(null);
      return;
    }
    void fetchMission();
  }, [open, missionId, fetchMission]);

  const permissions = useMemo(() => {
    if (!mission || !userId || !role) return null;
    return getMissionDetailPermissions({
      user: buildMissionSessionUser({ id: userId, role }),
      mission,
    });
  }, [mission, userId, role]);

  const chefName = useMemo(() => {
    if (!mission) return "—";
    return (
      mission.missionnaires.find((m) => m.userId === mission.chefMissionId)?.fullname ??
      "—"
    );
  }, [mission]);

  const refresh = async () => {
    await fetchMission();
    onUpdated();
  };

  const handleSubmit = async () => {
    if (!mission) return;
    setActing(true);
    try {
      const res = await fetch(`/api/missions/${mission._id}/submit`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Mission soumise pour validation");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setActing(false);
    }
  };

  const handleValidate = async () => {
    if (!mission) return;
    setActing(true);
    try {
      const res = await fetch(`/api/missions/${mission._id}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: validateAction,
          comment: validateComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(validateAction === "approve" ? "Étape validée" : "Mission refusée");
      setValidateOpen(false);
      setValidateComment("");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setActing(false);
    }
  };

  const patchStatus = async (status: "en_cours" | "annulee") => {
    if (!mission) return;
    setActing(true);
    try {
      const res = await fetch(`/api/missions/${mission._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(status === "en_cours" ? "Mission démarrée" : "Mission annulée");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setActing(false);
    }
  };

  const handleTerrainUpdate = async (payload: Record<string, unknown>) => {
    if (!mission) return;
    setActing(true);
    try {
      const res = await fetch(`/api/missions/${mission._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terrain: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Suivi terrain enregistré");
      setTerrainObservation("");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setActing(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!mission) return;
    setActing(true);
    try {
      const res = await fetch(`/api/missions/${mission._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rapport: {
            resume: reportResume.trim(),
            activitesRealisees: reportActivites.trim() || undefined,
            resultats: reportResultats.trim() || undefined,
            difficultes: reportDifficultes.trim() || undefined,
            recommandations: reportRecommandations.trim() || undefined,
            personnesRencontrees: reportPersonnes.trim() || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Rapport enregistré");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setActing(false);
    }
  };

  const handleProlongationReview = async (
    prolongationId: string,
    action: "approve" | "reject",
  ) => {
    if (!mission) return;
    if (action === "reject" && !prolongationReviewComment.trim()) {
      toast.error("Un commentaire est requis pour refuser");
      return;
    }
    setActing(true);
    try {
      const res = await fetch(
        `/api/missions/${mission._id}/prolongation/${prolongationId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            comment: prolongationReviewComment.trim() || undefined,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(action === "approve" ? "Prolongation approuvée" : "Prolongation refusée");
      setProlongationReviewComment("");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setActing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
          {loading || !mission ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="border-b bg-linear-to-br from-[var(--inp-vert)]/10 via-background to-background px-6 py-5">
                <DialogHeader className="text-left">
                  <DialogTitle className="flex flex-wrap items-center gap-2 text-xl">
                    <PlaneIcon className="size-5 text-[var(--inp-vert)]" />
                    <span className="font-mono text-base">{mission.numero}</span>
                    <MissionTypeBadge type={mission.type} />
                    <MissionStatusBadge status={mission.status} />
                  </DialogTitle>
                  <DialogDescription>
                    <span className="mt-1 block text-base font-medium text-foreground">
                      {mission.objet}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-sm">
                      <MapPinIcon className="size-3.5" />
                      {mission.destinationLabel}
                    </span>
                  </DialogDescription>
                </DialogHeader>
              </div>

              <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
                <div className="border-b px-6 pt-3">
                  <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                    <TabsTrigger value="validation">Validation</TabsTrigger>
                    <TabsTrigger value="terrain">Terrain</TabsTrigger>
                    <TabsTrigger value="report">Rapport</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <InfoBlock
                        label="Période"
                        value={
                          <>
                            {formatDay(mission.dateDepart)}
                            {mission.heureDepart ? ` ${mission.heureDepart}` : ""}
                            <br />→ {formatDay(mission.dateRetour)}
                            {mission.heureRetour ? ` ${mission.heureRetour}` : ""}
                          </>
                        }
                      />
                      <InfoBlock
                        label="Durée"
                        value={`${mission.dureeCalculee} jour(s)`}
                      />
                      <InfoBlock
                        label="Priorité"
                        value={MISSION_PRIORITY_LABELS[mission.priorite]}
                      />
                      <InfoBlock label="Chef de mission" value={chefName} />
                    </div>

                    {mission.description && (
                      <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Description
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm">{mission.description}</p>
                      </div>
                    )}

                    {(mission.convocation || mission.gedFileIds.length > 0) && (
                      <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <Link2Icon className="size-4" />
                          Intégrations
                        </p>
                        <ul className="space-y-2 text-sm">
                          {mission.convocation && (
                            <li className="rounded-lg border border-border/50 bg-background px-3 py-2">
                              <p className="font-medium">Convocation liée</p>
                              <p className="text-muted-foreground">{mission.convocation.title}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(mission.convocation.meetingAt).toLocaleString("fr-FR")}
                              </p>
                              {mission.convocation.agenda && (
                                <p className="mt-2 line-clamp-3 text-xs">
                                  {mission.convocation.agenda}
                                </p>
                              )}
                              <Link
                                href="/dashboard/convocations"
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--inp-vert)] hover:underline"
                              >
                                Voir les convocations
                                <ExternalLinkIcon className="size-3" />
                              </Link>
                            </li>
                          )}
                          {mission.gedFileIds.length > 0 && (
                            <li className="rounded-lg border border-border/50 bg-background px-3 py-2">
                              <p className="font-medium">Archives GED</p>
                              <p className="text-muted-foreground">
                                {mission.gedFileIds.length} document(s) archivé(s)
                              </p>
                              <Link
                                href="/dashboard/ged"
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--inp-vert)] hover:underline"
                              >
                                Ouvrir la GED
                                <ExternalLinkIcon className="size-3" />
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="grid gap-3 lg:grid-cols-2">
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <UsersIcon className="size-4" />
                          Missionnaires ({mission.missionnaires.length})
                        </p>
                        <ul className="space-y-2">
                          {mission.missionnaires.map((m) => (
                            <li
                              key={m.userId}
                              className="rounded-lg border border-border/50 bg-muted/10 px-3 py-2 text-sm"
                            >
                              <p className="font-medium">
                                {m.fullname}
                                {m.userId === mission.chefMissionId && (
                                  <span className="ml-2 text-xs text-[var(--inp-vert)]">
                                    Chef
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {m.occupation} · {m.email}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-xl border border-border/60 p-4">
                          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                            <WalletIcon className="size-4" />
                            Budget
                          </p>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Prévu</dt>
                              <dd className="font-medium">
                                {formatBudget(mission.budget.budgetPrevu)}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Consommé</dt>
                              <dd>{formatBudget(mission.budget.budgetConsomme)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Restant</dt>
                              <dd className="font-medium text-[var(--inp-vert)]">
                                {formatBudget(mission.budget.budgetRestant)}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {mission.transport.moyen && (
                          <div className="rounded-xl border border-border/60 p-4 text-sm">
                            <p className="font-semibold">Transport</p>
                            <p className="mt-1 text-muted-foreground">
                              {MISSION_TRANSPORT_LABELS[mission.transport.moyen]}
                              {mission.transport.immatriculation
                                ? ` · ${mission.transport.immatriculation}`
                                : ""}
                            </p>
                          </div>
                        )}

                        {(mission.direction || mission.projetLabel) && (
                          <div className="rounded-xl border border-border/60 p-4 text-sm">
                            {mission.direction && (
                              <p>
                                <span className="text-muted-foreground">Direction : </span>
                                {mission.direction}
                              </p>
                            )}
                            {mission.projetLabel && (
                              <p className="mt-1">
                                <span className="text-muted-foreground">Projet : </span>
                                {mission.projetLabel}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="validation" className="mt-0 space-y-4">
                    <MissionValidationStepper
                      validations={mission.validations}
                      pendingStep={permissions?.pendingValidationStep}
                    />

                    {permissions?.canValidate && (
                      <div className="flex flex-wrap gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <p className="w-full text-sm font-medium">
                          Action requise :{" "}
                          {permissions.pendingValidationStep
                            ? MISSION_VALIDATION_STEP_LABELS[
                                permissions.pendingValidationStep
                              ]
                            : "validation"}
                        </p>
                        <Button
                          size="sm"
                          className="bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
                          disabled={acting}
                          onClick={() => {
                            setValidateAction("approve");
                            setValidateOpen(true);
                          }}
                        >
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={acting}
                          onClick={() => {
                            setValidateAction("reject");
                            setValidateOpen(true);
                          }}
                        >
                          Refuser
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="terrain" className="mt-0 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoBlock
                        label="Arrivée déclarée"
                        value={
                          mission.arriveeDeclaree
                            ? `Oui · ${formatDateTime(mission.arriveeAt)}`
                            : "Non"
                        }
                      />
                      <InfoBlock
                        label="Positions GPS"
                        value={`${mission.positionsGPS.length} enregistrement(s)`}
                      />
                    </div>

                    {mission.positionsGPS.length > 0 && (
                      <ul className="space-y-2">
                        {mission.positionsGPS.map((pos, index) => (
                          <li
                            key={`${pos.recordedAt}-${index}`}
                            className="rounded-lg border border-border/60 px-3 py-2 text-sm"
                          >
                            {pos.latitude}, {pos.longitude}
                            {pos.label ? ` · ${pos.label}` : ""}
                            <span className="ml-2 text-xs text-muted-foreground">
                              {formatDateTime(pos.recordedAt)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {mission.observations.length > 0 && (
                      <div>
                        <p className="mb-2 text-sm font-semibold">Observations</p>
                        <ul className="space-y-2">
                          {mission.observations.map((obs, index) => (
                            <li
                              key={`${obs.recordedAt}-${index}`}
                              className="rounded-lg bg-muted/20 px-3 py-2 text-sm"
                            >
                              {obs.text}
                              <p className="mt-1 text-xs text-muted-foreground">
                                {formatDateTime(obs.recordedAt)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {mission.incidents.length > 0 && (
                      <div>
                        <p className="mb-2 text-sm font-semibold">Incidents</p>
                        <ul className="space-y-2">
                          {mission.incidents.map((inc, index) => (
                            <li
                              key={`${inc.recordedAt}-${index}`}
                              className="rounded-lg border border-rose-200/60 bg-rose-50/40 px-3 py-2 text-sm dark:border-rose-900/40 dark:bg-rose-950/20"
                            >
                              {inc.description}
                              <p className="mt-1 text-xs text-muted-foreground">
                                {inc.severity ?? "faible"} · {formatDateTime(inc.recordedAt)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {permissions?.canTrackTerrain && (
                      <div className="space-y-3 rounded-xl border border-dashed border-border p-4">
                        <p className="text-sm font-semibold">Mettre à jour le terrain</p>
                        {!mission.arriveeDeclaree && (
                          <Button
                            variant="outline"
                            disabled={acting}
                            onClick={() => void handleTerrainUpdate({ arriveeDeclaree: true })}
                          >
                            Déclarer mon arrivée
                          </Button>
                        )}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Latitude</Label>
                            <Input
                              value={terrainLat}
                              onChange={(e) => setTerrainLat(e.target.value)}
                              placeholder="14.6928"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Longitude</Label>
                            <Input
                              value={terrainLng}
                              onChange={(e) => setTerrainLng(e.target.value)}
                              placeholder="-17.4467"
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          disabled={acting || !terrainLat || !terrainLng}
                          onClick={() =>
                            void handleTerrainUpdate({
                              latitude: Number(terrainLat),
                              longitude: Number(terrainLng),
                            })
                          }
                        >
                          Enregistrer la position
                        </Button>
                        <div className="space-y-2">
                          <Label>Observation</Label>
                          <textarea
                            value={terrainObservation}
                            onChange={(e) => setTerrainObservation(e.target.value)}
                            rows={3}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <Button
                          disabled={acting || !terrainObservation.trim()}
                          onClick={() =>
                            void handleTerrainUpdate({
                              observation: terrainObservation.trim(),
                            })
                          }
                        >
                          Ajouter l&apos;observation
                        </Button>

                        <div className="space-y-2 border-t border-border/60 pt-3">
                          <Label>Signaler un incident</Label>
                          <textarea
                            value={incidentDescription}
                            onChange={(e) => setIncidentDescription(e.target.value)}
                            rows={3}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Description de l'incident…"
                          />
                          <Select
                            value={incidentSeverity}
                            onValueChange={(v) =>
                              setIncidentSeverity(
                                (v ?? "faible") as "faible" | "moyenne" | "grave",
                              )
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="faible">Faible</SelectItem>
                              <SelectItem value="moyenne">Moyenne</SelectItem>
                              <SelectItem value="grave">Grave</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            disabled={acting || !incidentDescription.trim()}
                            onClick={() =>
                              void handleTerrainUpdate({
                                incidentDescription: incidentDescription.trim(),
                                incidentSeverity,
                              })
                            }
                          >
                            Enregistrer l&apos;incident
                          </Button>
                        </div>

                        <div className="space-y-2 border-t border-border/60 pt-3">
                          <Label>Demande de prolongation</Label>
                          <Input
                            type="date"
                            value={prolongationEndDate}
                            min={toDateInput(mission.dateRetour)}
                            onChange={(e) => setProlongationEndDate(e.target.value)}
                          />
                          <textarea
                            value={prolongationJustification}
                            onChange={(e) => setProlongationJustification(e.target.value)}
                            rows={3}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Justification…"
                          />
                          <Button
                            variant="outline"
                            disabled={
                              acting ||
                              !prolongationEndDate ||
                              !prolongationJustification.trim()
                            }
                            onClick={() =>
                              void handleTerrainUpdate({
                                prolongationEndDate: prolongationEndDate,
                                prolongationJustification: prolongationJustification.trim(),
                              })
                            }
                          >
                            Demander une prolongation
                          </Button>
                        </div>
                      </div>
                    )}

                    {mission.demandesProlongation.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">Demandes de prolongation</p>
                        {mission.demandesProlongation.map((item) => (
                          <div
                            key={item._id}
                            className="rounded-xl border border-border/60 p-3 text-sm"
                          >
                            <p>
                              Nouvelle date : <strong>{formatDay(item.requestedEndDate)}</strong>
                            </p>
                            <p className="mt-1 text-muted-foreground">{item.justification}</p>
                            <p className="mt-2 text-xs capitalize">Statut : {item.status}</p>
                            {item.reviewComment && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Commentaire : {item.reviewComment}
                              </p>
                            )}
                            {item.status === "en_attente" && permissions?.canReviewProlongation && (
                              <div className="mt-3 space-y-2">
                                <Input
                                  value={prolongationReviewComment}
                                  onChange={(e) => setProlongationReviewComment(e.target.value)}
                                  placeholder="Commentaire (obligatoire si refus)"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    disabled={acting}
                                    onClick={() =>
                                      void handleProlongationReview(item._id, "approve")
                                    }
                                  >
                                    Approuver
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={acting}
                                    onClick={() =>
                                      void handleProlongationReview(item._id, "reject")
                                    }
                                  >
                                    Refuser
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="report" className="mt-0 space-y-4">
                    {mission.rapport?.dateDepot ? (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                            Rapport déposé le {formatDateTime(mission.rapport.dateDepot)}
                          </p>
                        </div>
                        {mission.rapport.resume && (
                          <div className="rounded-xl border p-4">
                            <p className="text-xs font-medium uppercase text-muted-foreground">
                              Résumé
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-sm">
                              {mission.rapport.resume}
                            </p>
                          </div>
                        )}
                        {mission.rapport.activitesRealisees && (
                          <div className="rounded-xl border p-4 text-sm">
                            <p className="font-semibold">Activités réalisées</p>
                            <p className="mt-2 whitespace-pre-wrap">
                              {mission.rapport.activitesRealisees}
                            </p>
                          </div>
                        )}
                        {mission.rapport.resultats && (
                          <div className="rounded-xl border p-4 text-sm">
                            <p className="font-semibold">Résultats</p>
                            <p className="mt-2 whitespace-pre-wrap">
                              {mission.rapport.resultats}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : permissions?.canSubmitReport ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Résumé *</Label>
                          <textarea
                            value={reportResume}
                            onChange={(e) => setReportResume(e.target.value)}
                            rows={4}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Activités réalisées</Label>
                          <textarea
                            value={reportActivites}
                            onChange={(e) => setReportActivites(e.target.value)}
                            rows={3}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Résultats</Label>
                          <textarea
                            value={reportResultats}
                            onChange={(e) => setReportResultats(e.target.value)}
                            rows={3}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Personnes rencontrées</Label>
                          <textarea
                            value={reportPersonnes}
                            onChange={(e) => setReportPersonnes(e.target.value)}
                            rows={2}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Difficultés</Label>
                          <textarea
                            value={reportDifficultes}
                            onChange={(e) => setReportDifficultes(e.target.value)}
                            rows={2}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Recommandations</Label>
                          <textarea
                            value={reportRecommandations}
                            onChange={(e) => setReportRecommandations(e.target.value)}
                            rows={2}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <Button
                          className="bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
                          disabled={acting || !reportResume.trim()}
                          onClick={() => void handleReportSubmit()}
                        >
                          Déposer le rapport
                        </Button>
                      </div>
                    ) : (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        Le rapport sera disponible lorsque la mission sera en cours.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0">
                    {mission.attachments.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        Aucune pièce jointe.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {mission.attachments.map((file, index) => (
                          <li
                            key={`${file.url}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <FileTextIcon className="size-4 shrink-0 text-[var(--inp-vert)]" />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {MISSION_ATTACHMENT_TYPE_LABELS[file.type]}
                                </p>
                              </div>
                            </div>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 items-center justify-center gap-1 rounded-lg px-2 text-sm font-medium hover:bg-muted"
                            >
                              <ExternalLinkIcon className="size-4" />
                              Ouvrir
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                </div>
              </Tabs>

              <DialogFooter className="border-t px-6 py-4 sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Créée le {formatDay(mission.createdAt)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {permissions?.canEdit && onEdit && mission.status === "brouillon" && (
                    <Button
                      variant="outline"
                      disabled={acting}
                      onClick={() => {
                        onOpenChange(false);
                        onEdit(mission._id);
                      }}
                    >
                      <PencilIcon className="size-4" />
                      Modifier
                    </Button>
                  )}
                  {permissions?.canSubmit && (
                    <Button disabled={acting} onClick={() => void handleSubmit()}>
                      Soumettre
                    </Button>
                  )}
                  {permissions?.canStart && (
                    <Button
                      disabled={acting}
                      className="bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
                      onClick={() => void patchStatus("en_cours")}
                    >
                      Démarrer la mission
                    </Button>
                  )}
                  {permissions?.canCancel && (
                    <Button
                      variant="outline"
                      disabled={acting}
                      onClick={() => void patchStatus("annulee")}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={validateOpen} onOpenChange={setValidateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {validateAction === "approve" ? "Approuver l'étape" : "Refuser la mission"}
            </DialogTitle>
            <DialogDescription>
              {validateAction === "reject"
                ? "Un commentaire est obligatoire pour expliquer le refus."
                : "Vous pouvez ajouter un commentaire optionnel."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="validate-comment">Commentaire</Label>
            <textarea
              id="validate-comment"
              value={validateComment}
              onChange={(e) => setValidateComment(e.target.value)}
              rows={4}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setValidateOpen(false)}>
              Annuler
            </Button>
            <Button
              disabled={
                acting || (validateAction === "reject" && !validateComment.trim())
              }
              onClick={() => void handleValidate()}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
