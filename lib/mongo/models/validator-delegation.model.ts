import mongoose, { Schema, type Document, models } from "mongoose";
import {
  DELEGATION_SCOPES,
  DELEGATION_STATUSES,
  type DelegationScope,
  type DelegationStatus,
} from "@/lib/constants/delegation";

export interface IValidatorDelegation extends Document {
  delegatorUserId: mongoose.Types.ObjectId;
  delegatorFullname: string;
  delegateUserId: mongoose.Types.ObjectId;
  delegateFullname: string;
  scope: DelegationScope;
  startAt: Date;
  endAt: Date;
  status: DelegationStatus;
  reason?: string;
  createdById: mongoose.Types.ObjectId;
  revokedAt?: Date;
  revokedById?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const validatorDelegationSchema = new Schema<IValidatorDelegation>(
  {
    delegatorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    delegatorFullname: { type: String, required: true, trim: true },
    delegateUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    delegateFullname: { type: String, required: true, trim: true },
    scope: {
      type: String,
      enum: DELEGATION_SCOPES,
      default: "absence_validation",
      required: true,
    },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: DELEGATION_STATUSES,
      default: "active",
      index: true,
    },
    reason: { type: String, trim: true },
    createdById: { type: Schema.Types.ObjectId, ref: "User", required: true },
    revokedAt: { type: Date },
    revokedById: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

validatorDelegationSchema.index(
  { delegatorUserId: 1, scope: 1, status: 1, startAt: 1, endAt: 1 },
  { name: "delegator_active_window" },
);

// Suppression automatique après endAt (TTL)
validatorDelegationSchema.index(
  { endAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { status: "active" } },
);

const ValidatorDelegationModel =
  models.ValidatorDelegation ||
  mongoose.model<IValidatorDelegation>(
    "ValidatorDelegation",
    validatorDelegationSchema,
  );

export default ValidatorDelegationModel;
