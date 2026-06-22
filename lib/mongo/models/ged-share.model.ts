import mongoose, { Schema, type Document, models } from "mongoose";
import {
  GED_SHARE_PERMISSIONS,
  type GedSharePermission,
} from "@/lib/constants/ged";

export type GedShareChannel = "email" | "sms";

export interface IGedShare extends Document {
  accessToken: string;
  itemId: mongoose.Types.ObjectId;
  itemType: "file" | "folder";
  sharedBy: mongoose.Types.ObjectId;
  sharedWith?: mongoose.Types.ObjectId;
  channel?: GedShareChannel;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  permission: GedSharePermission;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const gedShareSchema = new Schema<IGedShare>(
  {
    accessToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    itemId: { type: Schema.Types.ObjectId, required: true, index: true },
    itemType: { type: String, enum: ["file", "folder"], required: true },
    sharedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sharedWith: { type: Schema.Types.ObjectId, ref: "User" },
    channel: { type: String, enum: ["email", "sms"] },
    recipientName: { type: String, trim: true },
    recipientEmail: { type: String, trim: true, lowercase: true },
    recipientPhone: { type: String, trim: true },
    permission: {
      type: String,
      enum: GED_SHARE_PERMISSIONS,
      default: "read",
    },
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

gedShareSchema.index({ sharedWith: 1, itemType: 1 });
gedShareSchema.index(
  { itemId: 1, sharedWith: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sharedWith: { $exists: true, $type: "objectId" },
    },
  },
);

const GedShareModel =
  models.GedShare || mongoose.model<IGedShare>("GedShare", gedShareSchema);

export default GedShareModel;
