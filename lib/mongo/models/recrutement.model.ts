import mongoose, { Schema, type Document, models } from "mongoose";
import {
  RECRUTEMENT_CMS_STATUSES,
  RECRUTEMENT_OFFER_STATUSES,
  RECRUTEMENT_TYPES,
  type RecrutementCmsStatus,
  type RecrutementOfferStatus,
  type RecrutementType,
} from "@/lib/constants/recrutement";

export interface IRecrutement extends Document {
  slug: string;
  type: RecrutementType;
  title: string;
  shortDescription: string;
  location: string;
  contractType: string;
  publishedAt?: Date;
  deadline?: Date;
  deadlineLabel?: string;
  offerStatus: RecrutementOfferStatus;
  emailContact: string;
  references: string;
  status: RecrutementCmsStatus;
  createdAt: Date;
  updatedAt: Date;
}

const recrutementSchema = new Schema<IRecrutement>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: RECRUTEMENT_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    contractType: { type: String, required: true, trim: true },
    publishedAt: { type: Date },
    deadline: { type: Date },
    deadlineLabel: { type: String, trim: true },
    offerStatus: {
      type: String,
      enum: RECRUTEMENT_OFFER_STATUSES,
      default: "ouvert",
    },
    emailContact: { type: String, required: true, trim: true },
    references: { type: String, required: true, trim: true },
    status: { type: String, enum: RECRUTEMENT_CMS_STATUSES, default: "brouillon" },
  },
  { timestamps: true },
);

recrutementSchema.index({ status: 1, offerStatus: 1, publishedAt: -1 });

const RecrutementModel =
  models.Recrutement || mongoose.model<IRecrutement>("Recrutement", recrutementSchema);

export default RecrutementModel;
