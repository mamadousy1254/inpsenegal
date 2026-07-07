import mongoose, { Schema, type Document, models } from "mongoose";
import {
  NEWSLETTER_SOURCES,
  NEWSLETTER_STATUSES,
  type NewsletterSource,
  type NewsletterStatus,
} from "@/lib/constants/newsletter";

export interface INewsletterSubscriber extends Document {
  email: string;
  status: NewsletterStatus;
  source: NewsletterSource;
  ip?: string;
  userAgent?: string;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: { type: String, enum: NEWSLETTER_STATUSES, default: "actif" },
    source: { type: String, enum: NEWSLETTER_SOURCES, default: "footer" },
    ip: { type: String },
    userAgent: { type: String },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true },
);

newsletterSchema.index({ status: 1, createdAt: -1 });
newsletterSchema.index({ email: 1 });

const NewsletterModel =
  models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", newsletterSchema);

export default NewsletterModel;
