import mongoose, { Schema, type Document, models } from "mongoose";
import {
  CMS_STATUSES,
  PUBLICATION_TYPES,
  RESEARCH_AXES,
  type CmsStatus,
  type PublicationType,
} from "@/lib/constants/cms";

export interface IPublication extends Document {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  type: PublicationType;
  abstract: string;
  tags: string[];
  researchAxis: (typeof RESEARCH_AXES)[number];
  methodology?: string;
  results?: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  pdfFileName?: string;
  doi?: string;
  isFeatured: boolean;
  showOnScientificPage: boolean;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const publicationSchema = new Schema<IPublication>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    authors: { type: [String], default: [] },
    year: { type: Number, required: true },
    type: { type: String, enum: PUBLICATION_TYPES, required: true },
    abstract: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    researchAxis: { type: String, enum: RESEARCH_AXES, required: true },
    methodology: { type: String, trim: true },
    results: { type: String, trim: true },
    pdfUrl: { type: String, trim: true },
    pdfPublicId: { type: String, trim: true },
    pdfFileName: { type: String, trim: true },
    doi: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    showOnScientificPage: { type: Boolean, default: true },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

publicationSchema.index({ status: 1, showOnScientificPage: 1, publishedAt: -1, year: -1 });

const PublicationModel =
  models.Publication ||
  mongoose.model<IPublication>("Publication", publicationSchema);

export default PublicationModel;
