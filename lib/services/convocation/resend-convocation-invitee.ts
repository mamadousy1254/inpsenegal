import type { NotifierChannel } from "@/lib/constants/notifications";
import type { IConvocation } from "@/lib/mongo/models/convocation.model";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import {
  notifySingleConvocationInvitee,
  type ConvocationNotificationResult,
} from "@/lib/services/convocation/notify-convocation-invitees";

export type ResendConvocationInviteeResult = {
  convocation: IConvocation;
  result: ConvocationNotificationResult;
};

export async function resendConvocationToInvitee(input: {
  convocationId: string;
  inviteeUserId: string;
  channel?: NotifierChannel;
}): Promise<ResendConvocationInviteeResult> {
  const convocation = await ConvocationModel.findById(input.convocationId);
  if (!convocation) {
    throw new Error("Convocation introuvable");
  }

  if (convocation.status !== "envoyee" && convocation.status !== "terminee") {
    throw new Error(
      "Le renvoi n'est possible que pour une convocation déjà envoyée",
    );
  }

  if (!convocation.attendanceCode) {
    throw new Error("Code de présence manquant sur cette convocation");
  }

  const channel: NotifierChannel =
    input.channel === "sms" || input.channel === "email"
      ? input.channel
      : (convocation.notifyChannel as NotifierChannel);

  const result = await notifySingleConvocationInvitee({
    convocation,
    inviteeUserId: input.inviteeUserId,
    channel,
    attendanceCode: convocation.attendanceCode,
    isReminder: true,
  });

  const invitee = convocation.invitees.find(
    (entry: { userId: { toString(): string } }) =>
      entry.userId.toString() === input.inviteeUserId,
  );

  if (invitee) {
    invitee.notifyChannel = result.channel;
    invitee.sentAt = new Date();
    invitee.notifySuccess = result.success;
    await convocation.save();
  }

  if (!result.success) {
    throw new Error(result.error ?? "Échec du renvoi");
  }

  return { convocation, result };
}
