import mongoose, { Schema, type Document, models } from "mongoose";

export interface IGedOwnerSnapshot {
  _id: mongoose.Types.ObjectId;
  name: string;
  avatar?: string;
}

export interface IGedFolder extends Document {
  name: string;
  path: string;
  itemType: "folder";
  owner: IGedOwnerSnapshot;
  parent?: mongoose.Types.ObjectId | null;
  isPublic: boolean;
  sharedWith: mongoose.Types.ObjectId[];
  color?: string;
  description?: string;
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

const gedFolderSchema = new Schema<IGedFolder>(
  {
    name: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    itemType: { type: String, default: "folder", immutable: true },
    owner: { type: gedOwnerSnapshotSchema, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "GedFolder", default: null },
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
    color: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

gedFolderSchema.index({ parent: 1 });
gedFolderSchema.index({ "owner._id": 1, parent: 1 });
gedFolderSchema.index({ path: 1, "owner._id": 1 });

const GedFolderModel =
  models.GedFolder ||
  mongoose.model<IGedFolder>("GedFolder", gedFolderSchema);

export default GedFolderModel;
