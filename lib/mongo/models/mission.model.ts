import mongoose, { Schema, type Document, models } from "mongoose";
import {
  MISSION_ATTACHMENT_TYPES,
  MISSION_PRIORITIES,
  MISSION_STATUSES,
  MISSION_TRANSPORT_MEANS,
  MISSION_TYPES,
  MISSION_VALIDATION_STEP_STATUSES,
  MISSION_VALIDATION_STEPS,
  type MissionAttachmentType,
  type MissionPriority,
  type MissionStatus,
  type MissionTransportMean,
  type MissionType,
  type MissionValidationStep,
  type MissionValidationStepStatus,
} from "@/lib/constants/mission";

/* ------------------------------------------------------------------ */
/*  Sous-documents                                                     */
/* ------------------------------------------------------------------ */

export interface IMissionParticipant {
  userId: mongoose.Types.ObjectId;
  fullname: string;
  occupation: string;
  grade?: string;
  service?: string;
  phone?: string;
  email: string;
}

export interface IVehicleOccupant {
  userId: mongoose.Types.ObjectId;
  fullname: string;
  occupation?: string;
  service?: string;
}

export interface IMissionTransport {
  moyen?: MissionTransportMean;
  immatriculation?: string;
  chauffeur?: string;
  kilometrage?: number;
  /** Nombre de véhicules pour la mission. */
  nombreVehicules?: number;
  /** Nombre de personnes dans chaque véhicule (index = véhicule). */
  personnesParVehicule?: number[];
  /** Immatriculation optionnelle de chaque véhicule (index = véhicule). */
  immatriculationsVehicules?: string[];
  /** Occupants optionnels de chaque véhicule (index = véhicule). */
  occupantsParVehicule?: IVehicleOccupant[][];
}

export interface IMissionBudget {
  perDiem?: number;
  hebergement?: number;
  transport?: number;
  carburant?: number;
  peage?: number;
  communication?: number;
  divers?: number;
  budgetPrevu?: number;
  budgetConsomme?: number;
  budgetRestant?: number;
}

export interface IMissionAttachment {
  type: MissionAttachmentType;
  name: string;
  url: string;
  publicId?: string;
  mimeType?: string;
  bytes?: number;
  uploadedAt?: Date;
  uploadedById?: mongoose.Types.ObjectId;
}

export interface IMissionValidation {
  step: MissionValidationStep;
  status: MissionValidationStepStatus;
  validatorId?: mongoose.Types.ObjectId;
  validatorFullname?: string;
  validatedAt?: Date;
  comment?: string;
}

export interface IMissionGpsPosition {
  latitude: number;
  longitude: number;
  label?: string;
  recordedAt: Date;
  recordedById?: mongoose.Types.ObjectId;
}

export interface IMissionTerrainObservation {
  text: string;
  recordedAt: Date;
  recordedById?: mongoose.Types.ObjectId;
}

export interface IMissionIncident {
  description: string;
  severity?: "faible" | "moyenne" | "grave";
  recordedAt: Date;
  recordedById?: mongoose.Types.ObjectId;
}

export interface IMissionProlongationRequest {
  requestedEndDate: Date;
  justification: string;
  status: "en_attente" | "approuvee" | "refusee";
  requestedAt: Date;
  requestedById: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewedById?: mongoose.Types.ObjectId;
  reviewComment?: string;
}

export interface IMissionReport {
  resume?: string;
  activitesRealisees?: string;
  personnesRencontrees?: string;
  difficultes?: string;
  resultats?: string;
  recommandations?: string;
  photosRapport: IMissionAttachment[];
  documentsRapport: IMissionAttachment[];
  dateDepot?: Date;
  depositedById?: mongoose.Types.ObjectId;
}

/* ------------------------------------------------------------------ */
/*  Document principal                                                 */
/* ------------------------------------------------------------------ */

export interface IMission extends Document {
  numero: string;
  objet: string;
  description?: string;
  type: MissionType;
  priorite: MissionPriority;
  /** Direction organisationnelle (texte, aligné sur User.direction) */
  direction?: string;
  /** TODO: brancher sur un module Projet interne quand il existera */
  projetId?: string;
  projetLabel?: string;

  /* Localisation */
  pays: string;
  region?: string;
  departement?: string;
  commune?: string;
  village?: string;
  adressePrecise?: string;
  latitude?: number;
  longitude?: number;

  /* Dates */
  dateDepart: Date;
  heureDepart?: string;
  dateRetour: Date;
  heureRetour?: string;
  dureeCalculee?: number;

  /* Équipe */
  chefMissionId: mongoose.Types.ObjectId;
  missionnaires: IMissionParticipant[];

  transport: IMissionTransport;
  budget: IMissionBudget;
  attachments: IMissionAttachment[];

  status: MissionStatus;
  validations: IMissionValidation[];

  /* Suivi terrain */
  arriveeDeclaree: boolean;
  arriveeAt?: Date;
  positionsGPS: IMissionGpsPosition[];
  photosTerrain: IMissionAttachment[];
  observations: IMissionTerrainObservation[];
  incidents: IMissionIncident[];
  demandesProlongation: IMissionProlongationRequest[];

  rapport?: IMissionReport;

  /* Liens modules existants (les missions ne créent pas d'absences) */
  convocationId?: mongoose.Types.ObjectId;
  /** IDs fichiers GED archivés */
  gedFileIds: mongoose.Types.ObjectId[];

  createdById: mongoose.Types.ObjectId;
  updatedById?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/*  Schémas                                                            */
/* ------------------------------------------------------------------ */

const participantSchema = new Schema<IMissionParticipant>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullname: { type: String, required: true, trim: true },
    occupation: { type: String, required: true, trim: true },
    grade: { type: String, trim: true },
    service: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { _id: false },
);

const transportSchema = new Schema<IMissionTransport>(
  {
    moyen: { type: String, enum: MISSION_TRANSPORT_MEANS },
    immatriculation: { type: String, trim: true },
    chauffeur: { type: String, trim: true },
    kilometrage: { type: Number, min: 0 },
    nombreVehicules: { type: Number, min: 0 },
    personnesParVehicule: { type: [Number], default: [] },
    immatriculationsVehicules: { type: [String], default: [] },
    // Mixed : les tableaux imbriqués de sous-docs sont peu fiables en Mongoose.
    occupantsParVehicule: {
      type: Schema.Types.Mixed,
      default: [],
    },
  },
  { _id: false },
);

const budgetSchema = new Schema<IMissionBudget>(
  {
    perDiem: { type: Number, min: 0, default: 0 },
    hebergement: { type: Number, min: 0, default: 0 },
    transport: { type: Number, min: 0, default: 0 },
    carburant: { type: Number, min: 0, default: 0 },
    peage: { type: Number, min: 0, default: 0 },
    communication: { type: Number, min: 0, default: 0 },
    divers: { type: Number, min: 0, default: 0 },
    budgetPrevu: { type: Number, min: 0, default: 0 },
    budgetConsomme: { type: Number, min: 0, default: 0 },
    budgetRestant: { type: Number, min: 0, default: 0 },
  },
  { _id: false },
);

const attachmentSchema = new Schema<IMissionAttachment>(
  {
    type: { type: String, enum: MISSION_ATTACHMENT_TYPES, required: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    mimeType: { type: String, trim: true },
    bytes: { type: Number, min: 0 },
    uploadedAt: { type: Date, default: Date.now },
    uploadedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const validationSchema = new Schema<IMissionValidation>(
  {
    step: { type: String, enum: MISSION_VALIDATION_STEPS, required: true },
    status: {
      type: String,
      enum: MISSION_VALIDATION_STEP_STATUSES,
      default: "en_attente",
    },
    validatorId: { type: Schema.Types.ObjectId, ref: "User" },
    validatorFullname: { type: String, trim: true },
    validatedAt: { type: Date },
    comment: { type: String, trim: true },
  },
  { _id: false },
);

const gpsPositionSchema = new Schema<IMissionGpsPosition>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    label: { type: String, trim: true },
    recordedAt: { type: Date, required: true, default: Date.now },
    recordedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const observationSchema = new Schema<IMissionTerrainObservation>(
  {
    text: { type: String, required: true, trim: true },
    recordedAt: { type: Date, required: true, default: Date.now },
    recordedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const incidentSchema = new Schema<IMissionIncident>(
  {
    description: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["faible", "moyenne", "grave"], default: "faible" },
    recordedAt: { type: Date, required: true, default: Date.now },
    recordedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const prolongationSchema = new Schema<IMissionProlongationRequest>(
  {
    requestedEndDate: { type: Date, required: true },
    justification: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["en_attente", "approuvee", "refusee"],
      default: "en_attente",
    },
    requestedAt: { type: Date, required: true, default: Date.now },
    requestedById: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedAt: { type: Date },
    reviewedById: { type: Schema.Types.ObjectId, ref: "User" },
    reviewComment: { type: String, trim: true },
  },
  { _id: true },
);

const reportSchema = new Schema<IMissionReport>(
  {
    resume: { type: String, trim: true },
    activitesRealisees: { type: String, trim: true },
    personnesRencontrees: { type: String, trim: true },
    difficultes: { type: String, trim: true },
    resultats: { type: String, trim: true },
    recommandations: { type: String, trim: true },
    photosRapport: { type: [attachmentSchema], default: [] },
    documentsRapport: { type: [attachmentSchema], default: [] },
    dateDepot: { type: Date },
    depositedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const missionSchema = new Schema<IMission>(
  {
    numero: { type: String, required: true, unique: true, trim: true },
    objet: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: MISSION_TYPES, required: true },
    priorite: { type: String, enum: MISSION_PRIORITIES, default: "normale" },
    direction: { type: String, trim: true },
    projetId: { type: String, trim: true },
    projetLabel: { type: String, trim: true },

    pays: { type: String, required: true, trim: true, default: "Sénégal" },
    region: { type: String, trim: true },
    departement: { type: String, trim: true },
    commune: { type: String, trim: true },
    village: { type: String, trim: true },
    adressePrecise: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },

    dateDepart: { type: Date, required: true, index: true },
    heureDepart: { type: String, trim: true },
    dateRetour: { type: Date, required: true, index: true },
    heureRetour: { type: String, trim: true },
    dureeCalculee: { type: Number, min: 0 },

    chefMissionId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    missionnaires: { type: [participantSchema], default: [] },

    transport: { type: transportSchema, default: () => ({}) },
    budget: { type: budgetSchema, default: () => ({}) },
    attachments: { type: [attachmentSchema], default: [] },

    status: {
      type: String,
      enum: MISSION_STATUSES,
      default: "brouillon",
      index: true,
    },
    validations: { type: [validationSchema], default: [] },

    arriveeDeclaree: { type: Boolean, default: false },
    arriveeAt: { type: Date },
    positionsGPS: { type: [gpsPositionSchema], default: [] },
    photosTerrain: { type: [attachmentSchema], default: [] },
    observations: { type: [observationSchema], default: [] },
    incidents: { type: [incidentSchema], default: [] },
    demandesProlongation: { type: [prolongationSchema], default: [] },

    rapport: { type: reportSchema },

    convocationId: { type: Schema.Types.ObjectId, ref: "Convocation" },
    gedFileIds: { type: [{ type: Schema.Types.ObjectId, ref: "GedFile" }], default: [] },

    createdById: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

missionSchema.index({ status: 1, dateDepart: -1 });
missionSchema.index({ chefMissionId: 1 });
missionSchema.index({ "missionnaires.userId": 1 });
missionSchema.index({ direction: 1 });
missionSchema.index({ region: 1 });
missionSchema.index({ pays: 1 });
missionSchema.index({ createdById: 1, createdAt: -1 });

const MissionModel =
  models.Mission || mongoose.model<IMission>("Mission", missionSchema);

export default MissionModel;
