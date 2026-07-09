import { z } from "zod";
import {
  MISSION_ATTACHMENT_TYPES,
  MISSION_PRIORITIES,
  MISSION_STATUSES,
  MISSION_TRANSPORT_MEANS,
  MISSION_TYPES,
} from "@/lib/constants/mission";

const attachmentSchema = z.object({
  type: z.enum(MISSION_ATTACHMENT_TYPES),
  name: z.string().trim().min(1),
  url: z.string().trim().url(),
  publicId: z.string().trim().optional(),
  mimeType: z.string().trim().optional(),
  bytes: z.number().min(0).optional(),
});

const budgetSchema = z.object({
  perDiem: z.number().min(0).optional(),
  hebergement: z.number().min(0).optional(),
  transport: z.number().min(0).optional(),
  carburant: z.number().min(0).optional(),
  peage: z.number().min(0).optional(),
  communication: z.number().min(0).optional(),
  divers: z.number().min(0).optional(),
  budgetConsomme: z.number().min(0).optional(),
});

const transportSchema = z.object({
  moyen: z.enum(MISSION_TRANSPORT_MEANS).optional(),
  immatriculation: z.string().trim().optional(),
  chauffeur: z.string().trim().optional(),
  kilometrage: z.number().min(0).optional(),
});

export const createMissionSchema = z.object({
  objet: z.string().trim().min(1, "L'objet est requis"),
  description: z.string().trim().optional(),
  type: z.enum(MISSION_TYPES),
  priorite: z.enum(MISSION_PRIORITIES).optional(),
  direction: z.string().trim().optional(),
  projetId: z.string().trim().optional(),
  projetLabel: z.string().trim().optional(),
  pays: z.string().trim().min(1).default("Sénégal"),
  region: z.string().trim().optional(),
  departement: z.string().trim().optional(),
  commune: z.string().trim().optional(),
  village: z.string().trim().optional(),
  adressePrecise: z.string().trim().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  dateDepart: z.string().min(1, "Date de départ requise"),
  heureDepart: z.string().trim().optional(),
  dateRetour: z.string().min(1, "Date de retour requise"),
  heureRetour: z.string().trim().optional(),
  chefMissionId: z.string().min(1, "Chef de mission requis"),
  missionnaireIds: z.array(z.string()).min(1, "Au moins un missionnaire"),
  transport: transportSchema.optional(),
  budget: budgetSchema.optional(),
  attachments: z.array(attachmentSchema).optional(),
  convocationId: z.string().optional(),
  submitForValidation: z.boolean().optional(),
  validateOnCreate: z.boolean().optional(),
});

export const updateMissionSchema = createMissionSchema
  .partial()
  .extend({
    status: z.enum(MISSION_STATUSES).optional(),
    budgetConsomme: z.number().min(0).optional(),
  });

export const missionReportSchema = z.object({
  resume: z.string().trim().min(1, "Le résumé est requis"),
  activitesRealisees: z.string().trim().optional(),
  personnesRencontrees: z.string().trim().optional(),
  difficultes: z.string().trim().optional(),
  resultats: z.string().trim().optional(),
  recommandations: z.string().trim().optional(),
});

export const missionTerrainSchema = z.object({
  arriveeDeclaree: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  positionLabel: z.string().trim().optional(),
  observation: z.string().trim().optional(),
  incidentDescription: z.string().trim().optional(),
  incidentSeverity: z.enum(["faible", "moyenne", "grave"]).optional(),
  prolongationEndDate: z.string().optional(),
  prolongationJustification: z.string().trim().optional(),
});

export const missionValidateSchema = z.object({
  action: z.enum(["approve", "reject"]),
  comment: z.string().trim().optional(),
});

export const missionProlongationReviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  comment: z.string().trim().optional(),
});
