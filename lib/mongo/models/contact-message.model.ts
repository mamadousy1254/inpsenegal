import mongoose, { Schema, type Document, models } from "mongoose";
import {
  CONTACT_MESSAGE_STATUSES,
  type ContactMessageStatus,
} from "@/lib/constants/contact-message";

export interface IContactMessage extends Document {
  reference: string;
  fullName: string;
  institution?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    institution: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: CONTACT_MESSAGE_STATUSES, default: "nouvelle" },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });

const ContactMessageModel =
  models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);

export default ContactMessageModel;
