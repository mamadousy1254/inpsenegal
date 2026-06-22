import mongoose, { Schema, type Document, models } from "mongoose";
import {
  ANALYSIS_REQUEST_STATUSES,
  ANALYSIS_REQUESTER_TYPES,
  type AnalysisRequestStatus,
} from "@/lib/constants/demande-analyse";

export interface IDemandeAnalyse extends Document {
  reference: string;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  requesterType: (typeof ANALYSIS_REQUESTER_TYPES)[number];
  region: string;
  department: string;
  commune: string;
  latitude?: string;
  longitude?: string;
  surface?: string;
  culturePlanned?: string;
  cultureCurrent?: string;
  fertilisationHistory?: string;
  irrigation?: string;
  problem?: string;
  analysisTypes: string[];
  samplesNumber?: string;
  sendMode?: string;
  depositDate?: string;
  status: AnalysisRequestStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const demandeAnalyseSchema = new Schema<IDemandeAnalyse>(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    requesterType: { type: String, enum: ANALYSIS_REQUESTER_TYPES, required: true },
    region: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    commune: { type: String, required: true, trim: true },
    latitude: { type: String, trim: true },
    longitude: { type: String, trim: true },
    surface: { type: String, trim: true },
    culturePlanned: { type: String, trim: true },
    cultureCurrent: { type: String, trim: true },
    fertilisationHistory: { type: String, trim: true },
    irrigation: { type: String, trim: true },
    problem: { type: String, trim: true },
    analysisTypes: { type: [String], default: [] },
    samplesNumber: { type: String, trim: true },
    sendMode: { type: String, trim: true },
    depositDate: { type: String, trim: true },
    status: { type: String, enum: ANALYSIS_REQUEST_STATUSES, default: "nouvelle" },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

demandeAnalyseSchema.index({ status: 1, createdAt: -1 });
demandeAnalyseSchema.index({ email: 1 });
demandeAnalyseSchema.index({ reference: 1 });

const DemandeAnalyseModel =
  models.DemandeAnalyse ||
  mongoose.model<IDemandeAnalyse>("DemandeAnalyse", demandeAnalyseSchema);

export default DemandeAnalyseModel;
