import mongoose, { Schema, type Document, models } from "mongoose";
import { CMS_STATUSES, type CmsStatus } from "@/lib/constants/cms";
import { INSTITUT_POLE_TYPES, type InstitutPoleType } from "@/lib/constants/institut";

export interface IInstitutMembre extends Document {
  slug: string;
  nom: string;
  fonction: string;
  pole: InstitutPoleType;
  zone?: string;
  photo?: string;
  photoPublicId?: string;
  sortOrder: number;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const institutMembreSchema = new Schema<IInstitutMembre>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    nom: { type: String, required: true, trim: true },
    fonction: { type: String, required: true, trim: true },
    pole: { type: String, enum: INSTITUT_POLE_TYPES, required: true },
    zone: { type: String, trim: true },
    photo: { type: String, trim: true },
    photoPublicId: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

institutMembreSchema.index({ status: 1, pole: 1, sortOrder: 1, nom: 1 });

const InstitutMembreModel =
  models.InstitutMembre ||
  mongoose.model<IInstitutMembre>("InstitutMembre", institutMembreSchema);

export default InstitutMembreModel;
