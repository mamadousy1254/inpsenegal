import mongoose, { Schema, type Document, models } from "mongoose";
import { NOTIFIER_CHANNELS } from "@/lib/constants/notifications";
import { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";
import {
  CONTRACT_TYPES,
  GENDERS,
  MARITAL_STATUSES,
  USER_ROLES,
  VALIDATOR_ROLES,
  type UserRole,
  type ValidatorRole,
} from "@/lib/permissions/roles";

export interface IValidatorAssignment {
  userId: mongoose.Types.ObjectId;
  level: number;
  role: ValidatorRole;
}

export interface IUser extends Document {
  username?: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  phone?: string;
  phoneSecondary?: string;
  address?: string;
  city?: string;
  gender?: (typeof GENDERS)[number];
  maritalStatus?: (typeof MARITAL_STATUSES)[number];
  dateOfBirth?: Date;
  nationality?: string;
  nationalId?: string;
  numberOfChildren?: number;
  matricule?: string;
  occupation: string;
  service?: string;
  direction?: string;
  section: (typeof SENEGAL_REGIONS)[number];
  contractType?: (typeof CONTRACT_TYPES)[number];
  contractYear?: number;
  hireDate?: Date;
  endDate?: Date;
  grade?: string;
  role: UserRole;
  validators: IValidatorAssignment[];
  /** Préférence de notification pour les demandes d'absence à valider. */
  validatorNotifyChannel?: (typeof NOTIFIER_CHANNELS)[number];
  managerId?: mongoose.Types.ObjectId;
  isActive: boolean;
  emailVerified: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  notes?: string;
}

const validatorAssignmentSchema = new Schema<IValidatorAssignment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    level: { type: Number, required: true, min: 1 },
    role: { type: String, enum: VALIDATOR_ROLES, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    avatar: { type: String },
    phone: { type: String, trim: true },
    phoneSecondary: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    gender: { type: String, enum: GENDERS },
    maritalStatus: { type: String, enum: MARITAL_STATUSES },
    dateOfBirth: { type: Date },
    nationality: { type: String, default: "Sénégalaise", trim: true },
    nationalId: { type: String, trim: true },
    numberOfChildren: { type: Number, min: 0, default: 0 },
    matricule: { type: String, trim: true, sparse: true, unique: true },
    occupation: { type: String, required: true, default: "Agent", trim: true },
    service: { type: String, trim: true },
    direction: { type: String, trim: true },
    section: { type: String, enum: SENEGAL_REGIONS, required: true },
    contractType: { type: String, enum: CONTRACT_TYPES },
    contractYear: { type: Number, min: 2000, max: 2100 },
    hireDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String, trim: true },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "employe",
    },
    validators: { type: [validatorAssignmentSchema], default: [] },
    validatorNotifyChannel: {
      type: String,
      enum: NOTIFIER_CHANNELS,
      default: "sms",
    },
    managerId: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    mustChangePassword: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

const UserModel = models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
