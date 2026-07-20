import mongoose, { Schema, type Document, models } from "mongoose";
import { CMS_STATUSES, type CmsStatus } from "@/lib/constants/cms";

export interface ICartothequeItem extends Document {
  imageUrl: string;
  imagePublicId: string;
  /** Titre court (accessibilité / liste). */
  title: string;
  /** Légende cartographique affichée sur le site. */
  legende: string;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cartothequeItemSchema = new Schema<ICartothequeItem>(
  {
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    legende: { type: String, required: true, trim: true },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

cartothequeItemSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });

const CartothequeItemModel =
  models.CartothequeItem ||
  mongoose.model<ICartothequeItem>("CartothequeItem", cartothequeItemSchema);

export default CartothequeItemModel;
