import type {
  ConvocationLocationType,
  ConvocationResponseStatus,
  ConvocationStatus,
} from "@/lib/constants/convocation";

export type ConvocationDocumentEntry = {
  name: string;
  gedFileId?: string;
  url?: string;
};

export type ConvocationInviteeEntry = {
  userId: string;
  fullname: string;
  email: string;
  phone?: string;
  service?: string;
  direction?: string;
  section?: string;
  notifyChannel?: "email" | "sms";
  sentAt?: string;
  notifySuccess?: boolean;
  ackAt?: string;
  responseStatus: ConvocationResponseStatus;
  responseAt?: string;
  excuseReason?: string;
  attendedAt?: string;
  attendanceMethod?: "code" | "secretary" | "self";
};

export type ConvocationEntry = {
  _id: string;
  title: string;
  meetingAt: string;
  locationType: ConvocationLocationType;
  location?: string;
  visioLink?: string;
  agenda: string;
  preparatoryDocuments: ConvocationDocumentEntry[];
  status: ConvocationStatus;
  invitees: ConvocationInviteeEntry[];
  notifyChannel: "email" | "sms";
  attendanceCode?: string;
  minutes?: string;
  createdById: string;
  createdByEmail?: string;
  createdByFullname: string;
  secretaryId?: string;
  sentAt?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedConvocations = {
  items: ConvocationEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
