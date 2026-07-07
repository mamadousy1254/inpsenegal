import mongoose, { Schema, type Document, models } from "mongoose";
import {
  CMS_STATUSES,
  RESEARCH_AXIS_COLORS,
  RESEARCH_AXIS_ICONS,
  type CmsStatus,
  type ResearchAxisColor,
  type ResearchAxisIcon,
} from "@/lib/constants/cms";

export interface IResearchAxis extends Document {
  title: string;
  description: string;
  stats?: string;
  icon: ResearchAxisIcon;
  color: ResearchAxisColor;
  image: string;
  imagePublicId?: string;
  imageAlt: string;
  order: number;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const researchAxisSchema = new Schema<IResearchAxis>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    stats: { type: String, trim: true },
    icon: { type: String, enum: RESEARCH_AXIS_ICONS, default: "sprout" },
    color: { type: String, enum: RESEARCH_AXIS_COLORS, default: "amber" },
    image: { type: String, required: true, trim: true },
    imagePublicId: { type: String, trim: true },
    imageAlt: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

researchAxisSchema.index({ status: 1, order: 1, publishedAt: -1 });

const ResearchAxisModel =
  models.ResearchAxis ||
  mongoose.model<IResearchAxis>("ResearchAxis", researchAxisSchema);

export default ResearchAxisModel;
