import mongoose, { Schema, type Document, models } from "mongoose";
import {
  CMS_STATUSES,
  RESEARCH_PROJECT_STATUSES,
  type CmsStatus,
  type ResearchProjectStatus,
} from "@/lib/constants/cms";

export interface IResearchProject extends Document {
  title: string;
  lead: string;
  year: string;
  projectStatus: ResearchProjectStatus;
  description: string;
  order: number;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const researchProjectSchema = new Schema<IResearchProject>(
  {
    title: { type: String, required: true, trim: true },
    lead: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    projectStatus: {
      type: String,
      enum: RESEARCH_PROJECT_STATUSES,
      default: "en_cours",
    },
    description: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

researchProjectSchema.index({ status: 1, order: 1, publishedAt: -1 });

const ResearchProjectModel =
  models.ResearchProject ||
  mongoose.model<IResearchProject>("ResearchProject", researchProjectSchema);

export default ResearchProjectModel;
