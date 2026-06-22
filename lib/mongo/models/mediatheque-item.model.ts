import mongoose, { Schema, type Document, models } from "mongoose";
import { CMS_STATUSES, type CmsStatus } from "@/lib/constants/cms";

export interface IMediathequeItem extends Document {
  imageUrl: string;
  imagePublicId: string;
  alt: string;
  caption: string;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const mediathequeItemSchema = new Schema<IMediathequeItem>(
  {
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    caption: { type: String, required: true, trim: true },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

mediathequeItemSchema.index({ status: 1, publishedAt: -1 });

const MediathequeItemModel =
  models.MediathequeItem ||
  mongoose.model<IMediathequeItem>("MediathequeItem", mediathequeItemSchema);

export default MediathequeItemModel;
