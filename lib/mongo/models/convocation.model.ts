import mongoose, { Schema, type Document, models } from "mongoose";
import {
  CONVOCATION_ATTENDANCE_METHODS,
  CONVOCATION_LOCATION_TYPES,
  CONVOCATION_RESPONSE_STATUSES,
  CONVOCATION_STATUSES,
  type ConvocationAttendanceMethod,
  type ConvocationLocationType,
  type ConvocationResponseStatus,
  type ConvocationStatus,
} from "@/lib/constants/convocation";
import { NOTIFIER_CHANNELS } from "@/lib/constants/notifications";

export interface IConvocationDocument {
  name: string;
  gedFileId?: mongoose.Types.ObjectId;
  url?: string;
}

export interface IConvocationInvitee {
  userId: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  phone?: string;
  service?: string;
  direction?: string;
  section?: string;
  notifyChannel?: (typeof NOTIFIER_CHANNELS)[number];
  sentAt?: Date;
  notifySuccess?: boolean;
  ackAt?: Date;
  responseStatus: ConvocationResponseStatus;
  responseAt?: Date;
  excuseReason?: string;
  attendedAt?: Date;
  attendanceMethod?: ConvocationAttendanceMethod;
}

export interface IConvocation extends Document {
  title: string;
  meetingAt: Date;
  locationType: ConvocationLocationType;
  location?: string;
  visioLink?: string;
  agenda: string;
  preparatoryDocuments: IConvocationDocument[];
  status: ConvocationStatus;
  invitees: IConvocationInvitee[];
  notifyChannel: (typeof NOTIFIER_CHANNELS)[number];
  attendanceCode?: string;
  minutes?: string;
  createdById: mongoose.Types.ObjectId;
  createdByEmail: string;
  createdByFullname: string;
  secretaryId?: mongoose.Types.ObjectId;
  sentAt?: Date;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const preparatoryDocumentSchema = new Schema<IConvocationDocument>(
  {
    name: { type: String, required: true, trim: true },
    gedFileId: { type: Schema.Types.ObjectId, ref: "GedFile" },
    url: { type: String, trim: true },
  },
  { _id: false },
);

const inviteeSchema = new Schema<IConvocationInvitee>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    service: { type: String, trim: true },
    direction: { type: String, trim: true },
    section: { type: String, trim: true },
    notifyChannel: { type: String, enum: NOTIFIER_CHANNELS },
    sentAt: { type: Date },
    notifySuccess: { type: Boolean },
    ackAt: { type: Date },
    responseStatus: {
      type: String,
      enum: CONVOCATION_RESPONSE_STATUSES,
      default: "pending",
    },
    responseAt: { type: Date },
    excuseReason: { type: String, trim: true },
    attendedAt: { type: Date },
    attendanceMethod: {
      type: String,
      enum: CONVOCATION_ATTENDANCE_METHODS,
    },
  },
  { _id: false },
);

const convocationSchema = new Schema<IConvocation>(
  {
    title: { type: String, required: true, trim: true },
    meetingAt: { type: Date, required: true, index: true },
    locationType: {
      type: String,
      enum: CONVOCATION_LOCATION_TYPES,
      required: true,
    },
    location: { type: String, trim: true },
    visioLink: { type: String, trim: true },
    agenda: { type: String, required: true, trim: true },
    preparatoryDocuments: { type: [preparatoryDocumentSchema], default: [] },
    status: {
      type: String,
      enum: CONVOCATION_STATUSES,
      default: "brouillon",
      index: true,
    },
    invitees: { type: [inviteeSchema], default: [] },
    notifyChannel: {
      type: String,
      enum: NOTIFIER_CHANNELS,
      default: "email",
    },
    attendanceCode: { type: String, trim: true },
    minutes: { type: String, trim: true },
    createdById: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdByEmail: { type: String, required: true, trim: true, lowercase: true },
    createdByFullname: { type: String, required: true, trim: true },
    secretaryId: { type: Schema.Types.ObjectId, ref: "User" },
    sentAt: { type: Date },
    archivedAt: { type: Date },
  },
  { timestamps: true },
);

convocationSchema.index({ createdById: 1, meetingAt: -1 });
convocationSchema.index({ "invitees.userId": 1 });

const ConvocationModel =
  models.Convocation ||
  mongoose.model<IConvocation>("Convocation", convocationSchema);

export default ConvocationModel;
