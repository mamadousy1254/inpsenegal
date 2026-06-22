import mongoose, { Schema, type Document, models } from "mongoose";
import { ACTION_TYPES, type ActionType } from "@/lib/constants/action-types";

export interface IActivityHistory extends Document {
  /** Personne ayant effectué l'action */
  actorId: mongoose.Types.ObjectId;
  actorEmail: string;
  actorFirstname: string;
  actorLastname: string;
  /** Code action métier, ex. user.create */
  action: string;
  /** Type d'action : create, update, delete… */
  actionType: ActionType;
  /** Ressource concernée : User, Absence, File… */
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  description?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

const activityHistorySchema = new Schema<IActivityHistory>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actorEmail: { type: String, required: true, lowercase: true, trim: true },
    actorFirstname: { type: String, required: true, trim: true },
    actorLastname: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
    actionType: { type: String, enum: ACTION_TYPES, required: true },
    resource: { type: String, required: true, trim: true },
    resourceId: { type: Schema.Types.ObjectId },
    description: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const ActivityHistoryModel =
  models.ActivityHistory ||
  mongoose.model<IActivityHistory>("ActivityHistory", activityHistorySchema);

export default ActivityHistoryModel;
