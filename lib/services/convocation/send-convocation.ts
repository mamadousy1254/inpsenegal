import type { NotifierChannel } from "@/lib/constants/notifications";
import type { IConvocation } from "@/lib/mongo/models/convocation.model";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import { notifyConvocationInvitees } from "@/lib/services/convocation/notify-convocation-invitees";
import { generateAttendanceCode } from "@/lib/services/convocation/serialize-convocation";

export type SendConvocationResult = {
  convocation: IConvocation;
  notificationResults: Awaited<ReturnType<typeof notifyConvocationInvitees>>;
};

export async function sendConvocation(
  convocationId: string,
): Promise<SendConvocationResult> {
  const convocation = await ConvocationModel.findById(convocationId);
  if (!convocation) {
    throw new Error("Convocation introuvable");
  }

  if (convocation.status !== "brouillon") {
    throw new Error("Seules les convocations en brouillon peuvent être envoyées");
  }

  if (!convocation.invitees.length) {
    throw new Error("Aucun convoqué");
  }

  const attendanceCode =
    convocation.attendanceCode ?? generateAttendanceCode();

  const notificationResults = await notifyConvocationInvitees({
    convocation,
    channel: convocation.notifyChannel as NotifierChannel,
    attendanceCode,
  });

  const now = new Date();

  for (const result of notificationResults) {
    const invitee = convocation.invitees.find(
      (entry: { userId: { toString(): string } }) =>
        entry.userId.toString() === result.userId,
    );
    if (!invitee) continue;
    invitee.notifyChannel = result.channel;
    invitee.sentAt = now;
    invitee.notifySuccess = result.success;
  }

  convocation.attendanceCode = attendanceCode;
  convocation.status = "envoyee";
  convocation.sentAt = now;
  await convocation.save();

  return { convocation, notificationResults };
}
