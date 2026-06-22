import type { IContactMessage } from "@/lib/mongo/models/contact-message.model";

export type SerializedContactMessage = {
  _id: string;
  reference: string;
  fullName: string;
  institution?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: IContactMessage["status"];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeContactMessage(
  item: IContactMessage | Record<string, unknown>,
): SerializedContactMessage {
  const doc = item as IContactMessage;
  return {
    _id: String(doc._id),
    reference: doc.reference,
    fullName: doc.fullName,
    institution: doc.institution,
    email: doc.email,
    phone: doc.phone,
    subject: doc.subject,
    message: doc.message,
    status: doc.status,
    adminNotes: doc.adminNotes,
    createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
  };
}
