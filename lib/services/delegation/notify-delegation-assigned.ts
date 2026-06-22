import { isValidSenegalPhone, normalizeSenegalPhone } from "@/lib/constants/phone";
import type { NotifierChannel } from "@/lib/constants/notifications";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import { sendMessageEmail } from "@/lib/services/notifications/send-message-email";
import { sendMessageSms } from "@/lib/services/notifications/send-message-sms";
import type { ValidatorDelegationEntry } from "@/lib/types/delegation";

function getAppBaseUrl(): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function formatDateTimeFr(value: string): string {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildEmailBody(input: {
  delegateFullname: string;
  delegatorFullname: string;
  startAt: string;
  endAt: string;
  reason?: string;
}): string {
  const link = `${getAppBaseUrl()}/dashboard/absences`;
  const lines = [
    `${input.delegatorFullname} vous a délégué ses droits de validation des demandes d'absence sur INP Intranet.`,
    "",
    `Période : du ${formatDateTimeFr(input.startAt)} au ${formatDateTimeFr(input.endAt)}.`,
    "",
    "Pendant cette période, vous pourrez approuver ou refuser les demandes qui lui sont normalement adressées, depuis l'onglet « À valider ».",
  ];

  if (input.reason?.trim()) {
    lines.push("", `Motif : ${input.reason.trim()}`);
  }

  lines.push("", `Accéder aux absences : ${link}`);

  return lines.join("\n");
}

function buildSmsMessage(input: {
  delegateFullname: string;
  delegatorFullname: string;
  startAt: string;
  endAt: string;
}): string {
  const link = `${getAppBaseUrl()}/dashboard/absences`;
  return `${input.delegatorFullname} vous delegue la validation des absences (${formatDateTimeFr(input.startAt)} - ${formatDateTimeFr(input.endAt)}). Voir : ${link}`;
}

export type DelegationNotificationResult = {
  success: boolean;
  channel?: NotifierChannel;
  error?: string;
};

export async function notifyDelegateAssignment(
  delegation: ValidatorDelegationEntry,
  preferredChannel: NotifierChannel = "email",
): Promise<DelegationNotificationResult> {
  await connectDB();

  const delegate = await UserModel.findById(delegation.delegateUserId)
    .select("firstname lastname email phone")
    .lean();

  if (!delegate) {
    return { success: false, error: "Délégué introuvable" };
  }

  const delegateFullname =
    delegation.delegateFullname ||
    `${delegate.firstname ?? ""} ${delegate.lastname ?? ""}`.trim();

  const payload = {
    delegateFullname,
    delegatorFullname: delegation.delegatorFullname,
    startAt: delegation.startAt,
    endAt: delegation.endAt,
    reason: delegation.reason,
  };

  const tryEmail = async (): Promise<DelegationNotificationResult> => {
    if (!delegate.email?.trim()) {
      return { success: false, error: "E-mail du délégué manquant" };
    }

    await sendMessageEmail({
      email: delegate.email,
      fullname: delegateFullname,
      subject: `Délégation de validation — ${delegation.delegatorFullname}`,
      message: buildEmailBody(payload),
    });

    return { success: true, channel: "email" };
  };

  const trySms = async (): Promise<DelegationNotificationResult> => {
    const phone = delegate.phone ? normalizeSenegalPhone(delegate.phone) : "";
    if (!phone || !isValidSenegalPhone(phone)) {
      return { success: false, error: "Numéro SMS du délégué invalide" };
    }

    await sendMessageSms({
      phone,
      message: buildSmsMessage(payload),
    });

    return { success: true, channel: "sms" };
  };

  try {
    if (preferredChannel === "sms") {
      const smsResult = await trySms();
      if (smsResult.success) return smsResult;
      return tryEmail();
    }

    const emailResult = await tryEmail();
    if (emailResult.success) return emailResult;
    return trySms();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur d'envoi",
    };
  }
}
