import type { IConvocation } from "@/lib/mongo/models/convocation.model";
import { canViewAllConvocations } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type {
  ConvocationDocumentEntry,
  ConvocationEntry,
  ConvocationInviteeEntry,
} from "@/lib/types/convocation";

function serializeDocument(
  doc: IConvocation["preparatoryDocuments"][number],
): ConvocationDocumentEntry {
  return {
    name: doc.name,
    gedFileId: doc.gedFileId?.toString(),
    url: doc.url,
  };
}

function serializeInvitee(
  invitee: IConvocation["invitees"][number],
): ConvocationInviteeEntry {
  return {
    userId: invitee.userId.toString(),
    fullname: invitee.fullname,
    email: invitee.email,
    phone: invitee.phone,
    service: invitee.service,
    direction: invitee.direction,
    section: invitee.section,
    notifyChannel: invitee.notifyChannel,
    sentAt: invitee.sentAt?.toISOString(),
    notifySuccess: invitee.notifySuccess,
    ackAt: invitee.ackAt?.toISOString(),
    responseStatus: invitee.responseStatus,
    responseAt: invitee.responseAt?.toISOString(),
    excuseReason: invitee.excuseReason,
    attendedAt: invitee.attendedAt?.toISOString(),
    attendanceMethod: invitee.attendanceMethod,
  };
}

export function serializeConvocation(convocation: IConvocation): ConvocationEntry {
  return {
    _id: convocation._id.toString(),
    title: convocation.title,
    meetingAt: convocation.meetingAt.toISOString(),
    locationType: convocation.locationType,
    location: convocation.location,
    visioLink: convocation.visioLink,
    agenda: convocation.agenda,
    preparatoryDocuments: convocation.preparatoryDocuments.map(serializeDocument),
    status: convocation.status,
    invitees: convocation.invitees.map(serializeInvitee),
    notifyChannel: convocation.notifyChannel,
    attendanceCode: convocation.attendanceCode,
    minutes: convocation.minutes,
    createdById: convocation.createdById.toString(),
    createdByEmail: convocation.createdByEmail,
    createdByFullname: convocation.createdByFullname,
    secretaryId: convocation.secretaryId?.toString(),
    sentAt: convocation.sentAt?.toISOString(),
    archivedAt: convocation.archivedAt?.toISOString(),
    createdAt: convocation.createdAt.toISOString(),
    updatedAt: convocation.updatedAt.toISOString(),
  };
}

export function canViewFullConvocationDetails(
  role: UserRole,
  userId: string,
  convocation: IConvocation,
): boolean {
  if (canViewAllConvocations(role)) return true;
  return convocation.createdById.toString() === userId;
}

export function serializeConvocationForViewer(
  convocation: IConvocation,
  viewer: { id: string; role: UserRole },
): ConvocationEntry {
  const serialized = serializeConvocation(convocation);

  if (canViewFullConvocationDetails(viewer.role, viewer.id, convocation)) {
    return serialized;
  }

  const myInvitee = convocation.invitees.find(
    (invitee) => invitee.userId.toString() === viewer.id,
  );

  return {
    ...serialized,
    invitees: myInvitee ? [serializeInvitee(myInvitee)] : [],
    attendanceCode: undefined,
    createdByEmail: undefined,
    secretaryId: undefined,
  };
}

export function canUserManageConvocation(
  userId: string,
  convocation: IConvocation,
  canManage: boolean,
): boolean {
  if (canManage) return true;
  return convocation.createdById.toString() === userId;
}

export function isConvocationInvitee(
  userId: string,
  convocation: IConvocation,
): boolean {
  return convocation.invitees.some(
    (invitee) => invitee.userId.toString() === userId,
  );
}

export function generateAttendanceCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
