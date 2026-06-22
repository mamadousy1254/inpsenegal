import mongoose, { Schema, type Document, models } from "mongoose";
import { CMS_STATUSES, type CmsStatus } from "@/lib/constants/cms";

export interface IInstitutDelegation extends Document {
  slug: string;
  name: string;
  shortName: string;
  organigrammeLabel?: string;
  color: string;
  chefLieu: string;
  regionsCouvertes: string[];
  superficie: string;
  population: string;
  typesDeSols: string[];
  cultureDominantes: string[];
  enjeuxPedologiques: string[];
  missionsSpecifiques: string[];
  delegueNom: string;
  delegueFonction: string;
  contactAdresse: string;
  contactTelephone: string;
  contactEmail: string;
  description: string;
  sortOrder: number;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const institutDelegationSchema = new Schema<IInstitutDelegation>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    organigrammeLabel: { type: String, trim: true },
    color: { type: String, required: true, trim: true },
    chefLieu: { type: String, required: true, trim: true },
    regionsCouvertes: { type: [String], default: [] },
    superficie: { type: String, required: true, trim: true },
    population: { type: String, required: true, trim: true },
    typesDeSols: { type: [String], default: [] },
    cultureDominantes: { type: [String], default: [] },
    enjeuxPedologiques: { type: [String], default: [] },
    missionsSpecifiques: { type: [String], default: [] },
    delegueNom: { type: String, required: true, trim: true },
    delegueFonction: { type: String, required: true, trim: true },
    contactAdresse: { type: String, required: true, trim: true },
    contactTelephone: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

institutDelegationSchema.index({ status: 1, sortOrder: 1, name: 1 });

const InstitutDelegationModel =
  models.InstitutDelegation ||
  mongoose.model<IInstitutDelegation>("InstitutDelegation", institutDelegationSchema);

export default InstitutDelegationModel;
