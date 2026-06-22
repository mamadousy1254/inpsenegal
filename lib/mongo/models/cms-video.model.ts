import mongoose, { Schema, type Document, models } from "mongoose";
import {
  CMS_STATUSES,
  CMS_VIDEO_PLATFORMS,
  type CmsStatus,
  type CmsVideoPlatform,
} from "@/lib/constants/cms";

export interface ICmsVideo extends Document {
  title: string;
  platform: CmsVideoPlatform;
  watchUrl: string;
  embedUrl: string;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cmsVideoSchema = new Schema<ICmsVideo>(
  {
    title: { type: String, required: true, trim: true },
    platform: { type: String, enum: CMS_VIDEO_PLATFORMS, required: true },
    watchUrl: { type: String, required: true, trim: true },
    embedUrl: { type: String, required: true, trim: true },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

cmsVideoSchema.index({ status: 1, publishedAt: -1 });

const CmsVideoModel =
  models.CmsVideo || mongoose.model<ICmsVideo>("CmsVideo", cmsVideoSchema);

export default CmsVideoModel;
