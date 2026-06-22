import { isValidSenegalPhone } from "@/lib/constants/phone";
import type { NotifierChannel } from "@/lib/constants/notifications";
import type { IConvocation } from "@/lib/mongo/models/convocation.model";
import { sendMessageEmail } from "@/lib/services/notifications/send-message-email";
import { sendMessageSms } from "@/lib/services/notifications/send-message-sms";

export type ConvocationNotificationContext = {
  title: string;
  meetingAt: Date;
  locationType: "presentiel" | "visio";
  location?: string;
  visioLink?: string;
  agenda: string;
  organizerFullname: string;
  convocationId: string;
  attendanceCode: string;
};

export type ConvocationNotificationResult = {
  userId: string;
  fullname: string;
  channel: NotifierChannel;
  success: boolean;
  error?: string;
};

function getAppBaseUrl(): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function buildConvocationLink(convocationId: string): string {
  return `${getAppBaseUrl()}/dashboard/convocations?id=${convocationId}`;
}

function formatMeetingDateTime(value: Date): string {
  return value.toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildPlace(ctx: ConvocationNotificationContext): string {
  if (ctx.locationType === "visio") {
    return ctx.visioLink ? `Visio : ${ctx.visioLink}` : "Visioconférence";
  }
  return ctx.location ? `Lieu : ${ctx.location}` : "Présentiel";
}

function buildSmsMessage(
  inviteeFullname: string,
  ctx: ConvocationNotificationContext,
): string {
  const link = buildConvocationLink(ctx.convocationId);
  return `Bonjour ${inviteeFullname}, convocation INP : "${ctx.title}" le ${formatMeetingDateTime(ctx.meetingAt)}. ${buildPlace(ctx)}. Code presence : ${ctx.attendanceCode}. Confirmer : ${link}`.slice(
    0,
    480,
  );
}

function buildNotificationContext(
  convocation: IConvocation,
  attendanceCode: string,
): ConvocationNotificationContext {
  return {
    title: convocation.title,
    meetingAt: convocation.meetingAt,
    locationType: convocation.locationType,
    location: convocation.location,
    visioLink: convocation.visioLink,
    agenda: convocation.agenda,
    organizerFullname: convocation.createdByFullname,
    convocationId: convocation._id.toString(),
    attendanceCode,
  };
}

function buildEmailSubject(
  ctx: ConvocationNotificationContext,
  isReminder = false,
): string {
  return isReminder
    ? `Rappel — Convocation — ${ctx.title}`
    : `Convocation — ${ctx.title}`;
}

function buildEmailBody(
  _inviteeFullname: string,
  ctx: ConvocationNotificationContext,
): string {
  const link = buildConvocationLink(ctx.convocationId);
  const lines = [
    `${ctx.organizerFullname} vous convoque à la réunion suivante :`,
    "",
    `Objet : ${ctx.title}`,
    `Date : ${formatMeetingDateTime(ctx.meetingAt)}`,
    buildPlace(ctx),
    "",
    "Ordre du jour :",
    ctx.agenda,
    "",
    `Code de présence (émargement le jour de la réunion) : ${ctx.attendanceCode}`,
    "",
    `Consultez la convocation et confirmez votre présence : ${link}`,
  ];
  return lines.join("\n");
}

async function notifyInvitee(
  invitee: IConvocation["invitees"][number],
  channel: NotifierChannel,
  ctx: ConvocationNotificationContext,
  isReminder = false,
): Promise<ConvocationNotificationResult> {
  const userId = invitee.userId.toString();
  const base: ConvocationNotificationResult = {
    userId,
    fullname: invitee.fullname,
    channel,
    success: false,
  };

  try {
    if (channel === "sms") {
      if (!invitee.phone || !isValidSenegalPhone(invitee.phone)) {
        if (invitee.email) {
          await sendMessageEmail({
            email: invitee.email,
            fullname: invitee.fullname,
            subject: buildEmailSubject(ctx, isReminder),
            message: buildEmailBody(invitee.fullname, ctx),
          });
          return { ...base, channel: "email", success: true };
        }
        return { ...base, error: "Numéro SMS invalide ou manquant" };
      }

      await sendMessageSms({
        phone: invitee.phone,
        message: buildSmsMessage(invitee.fullname, ctx),
      });
      return { ...base, success: true };
    }

    await sendMessageEmail({
      email: invitee.email,
      fullname: invitee.fullname,
      subject: buildEmailSubject(ctx, isReminder),
      message: buildEmailBody(invitee.fullname, ctx),
    });
    return { ...base, success: true };
  } catch (error) {
    return {
      ...base,
      error: error instanceof Error ? error.message : "Erreur d'envoi",
    };
  }
}

export async function notifyConvocationInvitees(input: {
  convocation: IConvocation;
  channel: NotifierChannel;
  attendanceCode: string;
}): Promise<ConvocationNotificationResult[]> {
  const ctx = buildNotificationContext(input.convocation, input.attendanceCode);

  const results: ConvocationNotificationResult[] = [];

  for (const invitee of input.convocation.invitees) {
    const result = await notifyInvitee(invitee, input.channel, ctx);
    results.push(result);
  }

  return results;
}

export async function notifySingleConvocationInvitee(input: {
  convocation: IConvocation;
  inviteeUserId: string;
  channel: NotifierChannel;
  attendanceCode: string;
  isReminder?: boolean;
}): Promise<ConvocationNotificationResult> {
  const invitee = input.convocation.invitees.find(
    (entry) => entry.userId.toString() === input.inviteeUserId,
  );

  if (!invitee) {
    throw new Error("Agent non convoqué");
  }

  const ctx = buildNotificationContext(input.convocation, input.attendanceCode);
  return notifyInvitee(invitee, input.channel, ctx, input.isReminder ?? true);
}
