import mongoose, { Schema, type Document, models } from "mongoose";
import { LEAVE_DAYS_PER_MONTH } from "@/lib/constants/leave";
import { CONTRACT_TYPES, type ContractType } from "@/lib/permissions/roles";

export interface IMonthlyBalance {
  year: number;
  month: number;
  accrued: number;
  consumed: number;
}

export interface ILeaveContract {
  contractYear: number;
  contractType: ContractType;
  startDate: Date;
  endDate?: Date;
  monthlyAccrual: number;
  isActive: boolean;
  monthlyBalances: IMonthlyBalance[];
}

export interface ILeaveBalance extends Document {
  userId: mongoose.Types.ObjectId;
  contracts: ILeaveContract[];
}

const monthlyBalanceSchema = new Schema<IMonthlyBalance>(
  {
    year: { type: Number, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    accrued: { type: Number, required: true, min: 0 },
    consumed: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false },
);

const leaveContractSchema = new Schema<ILeaveContract>(
  {
    contractYear: { type: Number, required: true },
    contractType: { type: String, enum: CONTRACT_TYPES, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    monthlyAccrual: { type: Number, default: LEAVE_DAYS_PER_MONTH },
    isActive: { type: Boolean, default: true },
    monthlyBalances: { type: [monthlyBalanceSchema], default: [] },
  },
  { _id: true },
);

const leaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    contracts: { type: [leaveContractSchema], default: [] },
  },
  { timestamps: true },
);

const LeaveBalanceModel =
  models.LeaveBalance ||
  mongoose.model<ILeaveBalance>("LeaveBalance", leaveBalanceSchema);

export default LeaveBalanceModel;
