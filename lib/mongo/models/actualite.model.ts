import mongoose, { Schema, type Document, models } from "mongoose";
import {
  CMS_STATUSES,
  NEWS_CATEGORIES,
  type CmsStatus,
  type NewsCategory,
} from "@/lib/constants/cms";

export interface IActualite extends Document {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  imageUrl: string;
  imagePublicId?: string;
  category: NewsCategory;
  author: string;
  tags: string[];
  isFeatured: boolean;
  status: CmsStatus;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const actualiteSchema = new Schema<IActualite>(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    contentHtml: { type: String, required: true },
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, trim: true },
    category: { type: String, enum: NEWS_CATEGORIES, required: true },
    author: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: CMS_STATUSES, default: "brouillon" },
    publishedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

actualiteSchema.index({ status: 1, publishedAt: -1 });
actualiteSchema.index({ category: 1, status: 1 });

const ActualiteModel =
  models.Actualite || mongoose.model<IActualite>("Actualite", actualiteSchema);

export default ActualiteModel;
