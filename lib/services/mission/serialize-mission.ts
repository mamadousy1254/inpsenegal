import type { IMission } from "@/lib/mongo/models/mission.model";
import {
  computeMissionBudgetPrevu,
  computeMissionBudgetRestant,
  computeMissionDurationDays,
  isInternationalMission,
} from "@/lib/services/mission/compute-mission";
import type {
  MissionAttachmentType,
  MissionPriority,
  MissionStatus,
  MissionTransportMean,
  MissionType,
  MissionValidationStep,
  MissionValidationStepStatus,
} from "@/lib/constants/mission";
import { MISSION_VALIDATION_STEPS } from "@/lib/constants/mission";

export type SerializedMissionParticipant = {
  userId: string;
  fullname: string;
  occupation: string;
  service?: string;
  phone?: string;
  email: string;
};

export type SerializedMissionAttachment = {
  type: MissionAttachmentType;
  name: string;
  url: string;
  publicId?: string;
  mimeType?: string;
  bytes?: number;
  uploadedAt?: string;
  uploadedById?: string;
};

export type SerializedMissionValidation = {
  step: MissionValidationStep;
  status: MissionValidationStepStatus;
  validatorId?: string;
  validatorFullname?: string;
  validatedAt?: string;
  comment?: string;
};

export type SerializedMissionGpsPosition = {
  latitude: number;
  longitude: number;
  label?: string;
  recordedAt: string;
  recordedById?: string;
};

export type SerializedMissionObservation = {
  text: string;
  recordedAt: string;
  recordedById?: string;
};

export type SerializedMissionIncident = {
  description: string;
  severity?: "faible" | "moyenne" | "grave";
  recordedAt: string;
  recordedById?: string;
};

export type SerializedMissionProlongation = {
  _id: string;
  requestedEndDate: string;
  justification: string;
  status: "en_attente" | "approuvee" | "refusee";
  requestedAt: string;
  requestedById: string;
  reviewedAt?: string;
  reviewComment?: string;
};

export type SerializedMissionReport = {
  resume?: string;
  activitesRealisees?: string;
  personnesRencontrees?: string;
  difficultes?: string;
  resultats?: string;
  recommandations?: string;
  photosRapport: SerializedMissionAttachment[];
  documentsRapport: SerializedMissionAttachment[];
  dateDepot?: string;
  depositedById?: string;
};

export type SerializedMission = {
  _id: string;
  numero: string;
  objet: string;
  description?: string;
  type: MissionType;
  priorite: MissionPriority;
  direction?: string;
  projetId?: string;
  projetLabel?: string;
  pays: string;
  region?: string;
  departement?: string;
  commune?: string;
  village?: string;
  adressePrecise?: string;
  latitude?: number;
  longitude?: number;
  destinationLabel: string;
  dateDepart: string;
  heureDepart?: string;
  dateRetour: string;
  heureRetour?: string;
  dureeCalculee: number;
  chefMissionId: string;
  missionnaires: SerializedMissionParticipant[];
  transport: {
    moyen?: MissionTransportMean;
    immatriculation?: string;
    chauffeur?: string;
    kilometrage?: number;
  };
  budget: {
    perDiem: number;
    hebergement: number;
    transport: number;
    carburant: number;
    peage: number;
    communication: number;
    divers: number;
    budgetPrevu: number;
    budgetConsomme: number;
    budgetRestant: number;
  };
  attachments: SerializedMissionAttachment[];
  status: MissionStatus;
  validations: SerializedMissionValidation[];
  arriveeDeclaree: boolean;
  arriveeAt?: string;
  positionsGPS: SerializedMissionGpsPosition[];
  observations: SerializedMissionObservation[];
  incidents: SerializedMissionIncident[];
  demandesProlongation: SerializedMissionProlongation[];
  rapport?: SerializedMissionReport;
  isInternational: boolean;
  rapportDepose: boolean;
  convocationId?: string;
  convocation?: {
    id: string;
    title: string;
    meetingAt: string;
    agenda: string;
    status: string;
  };
  gedFileIds: string[];
  createdById: string;
  updatedById?: string;
  createdAt: string;
  updatedAt: string;
};

/** Historique agrégé des missions d'un agent (calculé depuis la collection Mission). */
export type MissionAgentStats = {
  userId: string;
  nombreMissions: number;
  nombreJoursMission: number;
  budgetTotalConsomme: number;
  missionsInternationales: number;
  missionsNationales: number;
  derniereMission?: string;
  rapportsDeposes: number;
  rapportsManquants: number;
};

function formatDestination(doc: IMission): string {
  const parts = [
    doc.village,
    doc.commune,
    doc.departement,
    doc.region,
    doc.pays !== "Sénégal" ? doc.pays : undefined,
  ].filter(Boolean);
  return parts.join(", ") || doc.pays || "—";
}

function serializeAttachment(
  att: IMission["attachments"][number],
): SerializedMissionAttachment {
  return {
    type: att.type,
    name: att.name,
    url: att.url,
    publicId: att.publicId,
    mimeType: att.mimeType,
    bytes: att.bytes,
    uploadedAt: att.uploadedAt?.toISOString(),
    uploadedById: att.uploadedById?.toString(),
  };
}

export function buildDefaultValidations(): SerializedMissionValidation[] {
  return MISSION_VALIDATION_STEPS.map((step) => ({
    step,
    status: "en_attente" as const,
  }));
}

export function serializeMission(doc: IMission | Record<string, unknown>): SerializedMission {
  const d = doc as IMission;

  const budgetPrevu =
    d.budget?.budgetPrevu ??
    computeMissionBudgetPrevu(d.budget ?? {});
  const budgetConsomme = d.budget?.budgetConsomme ?? 0;
  const budgetRestant = computeMissionBudgetRestant(budgetPrevu, budgetConsomme);

  const dureeCalculee =
    d.dureeCalculee ??
    computeMissionDurationDays({
      dateDepart: d.dateDepart,
      heureDepart: d.heureDepart,
      dateRetour: d.dateRetour,
      heureRetour: d.heureRetour,
    });

  return {
    _id: d._id.toString(),
    numero: d.numero,
    objet: d.objet,
    description: d.description,
    type: d.type,
    priorite: d.priorite,
    direction: d.direction,
    projetId: d.projetId,
    projetLabel: d.projetLabel,
    pays: d.pays,
    region: d.region,
    departement: d.departement,
    commune: d.commune,
    village: d.village,
    adressePrecise: d.adressePrecise,
    latitude: d.latitude,
    longitude: d.longitude,
    destinationLabel: formatDestination(d),
    dateDepart: d.dateDepart.toISOString(),
    heureDepart: d.heureDepart,
    dateRetour: d.dateRetour.toISOString(),
    heureRetour: d.heureRetour,
    dureeCalculee,
    chefMissionId: d.chefMissionId.toString(),
    missionnaires: (d.missionnaires ?? []).map((m) => ({
      userId: m.userId.toString(),
      fullname: m.fullname,
      occupation: m.occupation,
      service: m.service,
      phone: m.phone,
      email: m.email,
    })),
    transport: {
      moyen: d.transport?.moyen,
      immatriculation: d.transport?.immatriculation,
      chauffeur: d.transport?.chauffeur,
      kilometrage: d.transport?.kilometrage,
    },
    budget: {
      perDiem: d.budget?.perDiem ?? 0,
      hebergement: d.budget?.hebergement ?? 0,
      transport: d.budget?.transport ?? 0,
      carburant: d.budget?.carburant ?? 0,
      peage: d.budget?.peage ?? 0,
      communication: d.budget?.communication ?? 0,
      divers: d.budget?.divers ?? 0,
      budgetPrevu,
      budgetConsomme,
      budgetRestant,
    },
    attachments: (d.attachments ?? []).map(serializeAttachment),
    status: d.status,
    validations: (d.validations ?? []).map((v) => ({
      step: v.step,
      status: v.status,
      validatorId: v.validatorId?.toString(),
      validatorFullname: v.validatorFullname,
      validatedAt: v.validatedAt?.toISOString(),
      comment: v.comment,
    })),
    arriveeDeclaree: d.arriveeDeclaree ?? false,
    arriveeAt: d.arriveeAt?.toISOString(),
    positionsGPS: (d.positionsGPS ?? []).map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
      label: p.label,
      recordedAt: p.recordedAt.toISOString(),
      recordedById: p.recordedById?.toString(),
    })),
    observations: (d.observations ?? []).map((o) => ({
      text: o.text,
      recordedAt: o.recordedAt.toISOString(),
      recordedById: o.recordedById?.toString(),
    })),
    incidents: (d.incidents ?? []).map((i) => ({
      description: i.description,
      severity: i.severity,
      recordedAt: i.recordedAt.toISOString(),
      recordedById: i.recordedById?.toString(),
    })),
    demandesProlongation: (d.demandesProlongation ?? []).map((p) => {
      const item = p as typeof p & { _id?: { toString(): string } };
      return {
        _id: item._id?.toString() ?? "",
        requestedEndDate: p.requestedEndDate.toISOString(),
        justification: p.justification,
        status: p.status,
        requestedAt: p.requestedAt.toISOString(),
        requestedById: p.requestedById.toString(),
        reviewedAt: p.reviewedAt?.toISOString(),
        reviewComment: p.reviewComment,
      };
    }),
    rapport: d.rapport
      ? {
          resume: d.rapport.resume,
          activitesRealisees: d.rapport.activitesRealisees,
          personnesRencontrees: d.rapport.personnesRencontrees,
          difficultes: d.rapport.difficultes,
          resultats: d.rapport.resultats,
          recommandations: d.rapport.recommandations,
          photosRapport: (d.rapport.photosRapport ?? []).map(serializeAttachment),
          documentsRapport: (d.rapport.documentsRapport ?? []).map(serializeAttachment),
          dateDepot: d.rapport.dateDepot?.toISOString(),
          depositedById: d.rapport.depositedById?.toString(),
        }
      : undefined,
    isInternational: isInternationalMission(d.pays),
    rapportDepose: Boolean(d.rapport?.dateDepot),
    convocationId: d.convocationId?.toString(),
    gedFileIds: (d.gedFileIds ?? []).map((id) => id.toString()),
    createdById: d.createdById.toString(),
    updatedById: d.updatedById?.toString(),
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}
