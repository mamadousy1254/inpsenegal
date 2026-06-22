import mongoose, { Schema, type Document, models } from "mongoose";
import { CMS_STATUSES, type CmsStatus } from "@/lib/constants/cms";
import { PARTENAIRE_CATEGORIES, type PartenaireCategory } from "@/lib/constants/partenaires";

export interface IPartenaire extends Document {
  slug: string;
  nom: string;
  acronyme: string;
  description: string;
  category: PartenaireCategory;
  logo: string;
  logoPublicId?: string;
  siteWeb?: string;
  pays?: string;
  sortOrder: number;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const partenaireSchema = new Schema<IPartenaire>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    nom: { type: String, required: true, trim: true },
    acronyme: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: PARTENAIRE_CATEGORIES, required: true },
    logo: { type: String, required: true, trim: true },
    logoPublicId: { type: String, trim: true },
    siteWeb: { type: String, trim: true },
    pays: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

partenaireSchema.index({ status: 1, category: 1, sortOrder: 1, acronyme: 1 });

const PartenaireModel =
  models.Partenaire || mongoose.model<IPartenaire>("Partenaire", partenaireSchema);

export default PartenaireModel;
