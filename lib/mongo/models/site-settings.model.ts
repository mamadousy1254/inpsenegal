import mongoose, { Schema, type Document, models } from "mongoose";

export interface ISiteSettings extends Document {
  key: "global";
  maintenanceEnabled: boolean;
  maintenanceMessage?: string;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global",
      enum: ["global"],
    },
    maintenanceEnabled: { type: Boolean, default: false },
    maintenanceMessage: { type: String, trim: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const SiteSettingsModel =
  models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);

export default SiteSettingsModel;
