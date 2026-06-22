import mongoose, { Schema, type Document, models } from "mongoose";

export interface ILoginHistory extends Document {
  userId?: mongoose.Types.ObjectId;
  email: string;
  success: boolean;
  failureReason?: string;
  ip?: string;
  userAgent?: string;
}

const loginHistorySchema = new Schema<ILoginHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true, lowercase: true, trim: true },
    success: { type: Boolean, required: true },
    failureReason: { type: String },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const LoginHistoryModel =
  models.LoginHistory ||
  mongoose.model<ILoginHistory>("LoginHistory", loginHistorySchema);

export default LoginHistoryModel;
