import mongoose, { Schema, type Document, models } from "mongoose";
import type { IGedOwnerSnapshot } from "@/lib/mongo/models/ged-folder.model";

export interface IGedFile extends Document {
  name: string;
  size: number;
  mimeType: string;
  itemType: "file";
  path: string;
  owner: IGedOwnerSnapshot;
  parent?: mongoose.Types.ObjectId | null;
  isPublic: boolean;
  sharedWith: mongoose.Types.ObjectId[];
  tags: string[];
  cloudinaryId: string;
  cloudinaryFolder?: string;
  format: string;
  resourceType: string;
  secureUrl: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const gedOwnerSnapshotSchema = new Schema<IGedOwnerSnapshot>(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, trim: true },
  },
  { _id: false },
);

const gedFileSchema = new Schema<IGedFile>(
  {
    name: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
    mimeType: { type: String, required: true },
    itemType: { type: String, default: "file", immutable: true },
    path: { type: String, required: true, trim: true },
    owner: { type: gedOwnerSnapshotSchema, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "GedFolder", default: null },
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String, trim: true }],
    cloudinaryId: { type: String, required: true, unique: true },
    cloudinaryFolder: { type: String, trim: true },
    format: { type: String, required: true },
    resourceType: { type: String, required: true },
    secureUrl: { type: String, required: true },
    thumbnailUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

gedFileSchema.index({ parent: 1 });
gedFileSchema.index({ "owner._id": 1, parent: 1 });
gedFileSchema.index({ tags: 1 });

const GedFileModel =
  models.GedFile || mongoose.model<IGedFile>("GedFile", gedFileSchema);

export default GedFileModel;
