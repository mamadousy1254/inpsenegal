import mongoose, { Schema, type Document, models } from "mongoose";
import {
  ABSENCE_TYPES,
  VALIDATION_STATUSES,
  type AbsenceType,
  type ValidationStatus,
} from "@/lib/constants/leave";
import { VALIDATOR_ROLES, type ValidatorRole } from "@/lib/permissions/roles";

export interface IAbsenceValidation {
  validatorUserId: mongoose.Types.ObjectId;
  level: number;
  role: ValidatorRole;
  email: string;
  fullname: string;
  phone?: string;
  isValidated: boolean;
  isRejected: boolean;
  comment?: string;
  validatedAt?: Date;
  actedByUserId?: mongoose.Types.ObjectId;
  actedByFullname?: string;
  onBehalfOfUserId?: mongoose.Types.ObjectId;
  delegationId?: mongoose.Types.ObjectId;
}

export interface IAbsenceJustificatif {
  url: string;
  cloudinaryId: string;
  filename: string;
  format: string;
  resourceType: string;
  bytes: number;
}

export interface IAbsenceRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  requesterEmail: string;
  firstname: string;
  lastname: string;
  phone?: string;
  occupation: string;
  absenceType: AbsenceType;
  dateDepart: Date;
  dateFin: Date;
  dateSoumission: Date;
  raison: string;
  duree: number;
  contractYear?: number;
  validations: IAbsenceValidation[];
  statutValidation: ValidationStatus;
  requiredValidatorsCount: number;
  adminBypass?: boolean;
  adminBypassBy?: mongoose.Types.ObjectId;
  justificatif?: IAbsenceJustificatif;
}

const absenceValidationSchema = new Schema<IAbsenceValidation>(
  {
    validatorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: { type: Number, required: true, min: 1 },
    role: { type: String, enum: VALIDATOR_ROLES, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    fullname: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    isValidated: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    comment: { type: String, trim: true },
    validatedAt: { type: Date },
    actedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    actedByFullname: { type: String, trim: true },
    onBehalfOfUserId: { type: Schema.Types.ObjectId, ref: "User" },
    delegationId: { type: Schema.Types.ObjectId, ref: "ValidatorDelegation" },
  },
  { _id: false },
);

const absenceJustificatifSchema = new Schema<IAbsenceJustificatif>(
  {
    url: { type: String, required: true, trim: true },
    cloudinaryId: { type: String, required: true, trim: true },
    filename: { type: String, required: true, trim: true },
    format: { type: String, required: true, trim: true },
    resourceType: { type: String, required: true, trim: true },
    bytes: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const absenceRequestSchema = new Schema<IAbsenceRequest>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requesterEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    occupation: { type: String, required: true, trim: true },
    absenceType: { type: String, enum: ABSENCE_TYPES, required: true },
    dateDepart: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    dateSoumission: { type: Date, default: Date.now },
    raison: { type: String, required: true, trim: true },
    duree: { type: Number, required: true, min: 1 },
    contractYear: { type: Number },
    validations: { type: [absenceValidationSchema], default: [] },
    statutValidation: {
      type: String,
      enum: VALIDATION_STATUSES,
      default: "en_attente",
    },
    requiredValidatorsCount: { type: Number, default: 0 },
    adminBypass: { type: Boolean, default: false },
    adminBypassBy: { type: Schema.Types.ObjectId, ref: "User" },
    justificatif: { type: absenceJustificatifSchema, required: false },
  },
  { timestamps: true },
);

const AbsenceRequestModel =
  models.AbsenceRequest ||
  mongoose.model<IAbsenceRequest>("AbsenceRequest", absenceRequestSchema);

export default AbsenceRequestModel;
