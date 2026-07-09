import { isValidSenegalPhone, normalizeSenegalPhone } from "@/lib/constants/phone";
import type { MissionValidationStep } from "@/lib/constants/mission";
import { MISSION_VALIDATION_STEP_LABELS } from "@/lib/constants/mission";
import UserModel from "@/lib/mongo/models/user.model";
import { sendMessageEmail } from "@/lib/services/notifications/send-message-email";
import { sendMessageSms } from "@/lib/services/notifications/send-message-sms";
import {
  resolveMissionNotifyTargets,
  type MissionNotifyTarget,
} from "@/lib/services/mission/resolve-mission-notify-targets";

export type MissionNotificationResult = {
  userId: string;
  fullname: string;
  channel: "email" | "sms";
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

function buildMissionLink(missionId?: string): string {
  const base = `${getAppBaseUrl()}/dashboard/missions`;
  return missionId ? `${base}?mission=${missionId}` : base;
}

function formatDateFr(value: Date | string): string {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function notifyTarget(input: {
  target: MissionNotifyTarget;
  emailSubject: string;
  emailBody: string;
  smsMessage: string;
}): Promise<MissionNotificationResult[]> {
  const results: MissionNotificationResult[] = [];

  if (input.target.email?.trim()) {
    try {
      await sendMessageEmail({
        email: input.target.email,
        fullname: input.target.fullname,
        subject: input.emailSubject,
        message: input.emailBody,
      });
      results.push({
        userId: input.target.userId,
        fullname: input.target.fullname,
        channel: "email",
        success: true,
      });
    } catch (error) {
      results.push({
        userId: input.target.userId,
        fullname: input.target.fullname,
        channel: "email",
        success: false,
        error: error instanceof Error ? error.message : "Erreur e-mail",
      });
    }
  }

  const phone = input.target.phone ? normalizeSenegalPhone(input.target.phone) : "";
  if (phone && isValidSenegalPhone(phone)) {
    try {
      await sendMessageSms({ phone, message: input.smsMessage });
      results.push({
        userId: input.target.userId,
        fullname: input.target.fullname,
        channel: "sms",
        success: true,
      });
    } catch (error) {
      results.push({
        userId: input.target.userId,
        fullname: input.target.fullname,
        channel: "sms",
        success: false,
        error: error instanceof Error ? error.message : "Erreur SMS",
      });
    }
  }

  return results;
}

export async function notifyMissionValidators(input: {
  step?: MissionValidationStep;
  mission: {
    _id: string;
    numero: string;
    objet: string;
    direction?: string;
    dateDepart: Date | string;
    dateRetour: Date | string;
    chefFullname?: string;
  };
  targets?: MissionNotifyTarget[];
}): Promise<MissionNotificationResult[]> {
  const targets =
    input.targets ??
    (input.step
      ? await resolveMissionNotifyTargets({
          step: input.step,
          direction: input.mission.direction,
        })
      : []);

  if (!targets.length) return [];

  const link = buildMissionLink(input.mission._id);
  const stepLabel = input.step
    ? MISSION_VALIDATION_STEP_LABELS[input.step]
    : "Chef de service / Directeur";
  const subject = `Mission ${input.mission.numero} — validation requise`;
  const body = [
    `Une mission est en attente de votre validation${input.step ? ` (${stepLabel})` : ""}.`,
    "",
    `N° : ${input.mission.numero}`,
    `Objet : ${input.mission.objet}`,
    `Période : ${formatDateFr(input.mission.dateDepart)} → ${formatDateFr(input.mission.dateRetour)}`,
    input.mission.chefFullname ? `Chef : ${input.mission.chefFullname}` : "",
    "",
    `Consulter la mission : ${link}`,
  ]
    .filter(Boolean)
    .join("\n");

  const sms = `INP Mission ${input.mission.numero} : validation ${stepLabel} requise. ${link}`;

  const results: MissionNotificationResult[] = [];
  for (const target of targets) {
    const sent = await notifyTarget({
      target,
      emailSubject: subject,
      emailBody: body.replace(`Bonjour ${target.fullname},`, `Bonjour ${target.fullname},`),
      smsMessage: `Bonjour ${target.fullname}, ${sms}`,
    });
    results.push(...sent);
  }

  return results;
}

async function loadUserContact(userId: string) {
  const user = await UserModel.findById(userId)
    .select("firstname lastname email phone")
    .lean();
  if (!user) return null;
  return {
    userId: user._id.toString(),
    fullname: `${user.firstname} ${user.lastname}`.trim(),
    email: user.email,
    phone: user.phone,
  };
}

export async function notifyMissionCreator(input: {
  creatorId: string;
  mission: {
    _id: string;
    numero: string;
    objet: string;
  };
  event: "approved" | "rejected" | "validated";
  comment?: string;
}): Promise<MissionNotificationResult[]> {
  const contact = await loadUserContact(input.creatorId);
  if (!contact) return [];

  const link = buildMissionLink(input.mission._id);
  let subject = "";
  let body = "";
  let sms = "";

  switch (input.event) {
    case "validated":
      subject = `Mission ${input.mission.numero} validée`;
      body = `Votre mission « ${input.mission.objet} » a été entièrement validée.\n\nDétails : ${link}`;
      sms = `INP : mission ${input.mission.numero} validée. ${link}`;
      break;
    case "rejected":
      subject = `Mission ${input.mission.numero} refusée`;
      body = [
        `Votre mission « ${input.mission.objet} » a été refusée.`,
        input.comment ? `Motif : ${input.comment}` : "",
        "",
        `Modifier et resoumettre : ${link}`,
      ]
        .filter(Boolean)
        .join("\n");
      sms = `INP : mission ${input.mission.numero} refusee.${input.comment ? ` Motif: ${input.comment}` : ""} ${link}`;
      break;
    case "approved":
      subject = `Mission ${input.mission.numero} — étape validée`;
      body = `Une étape de validation de votre mission « ${input.mission.objet} » a été approuvée.\n\nSuivi : ${link}`;
      sms = `INP : etape validee pour mission ${input.mission.numero}. ${link}`;
      break;
  }

  return notifyTarget({
    target: contact,
    emailSubject: subject,
    emailBody: body,
    smsMessage: `Bonjour ${contact.fullname}, ${sms}`,
  });
}

export async function notifyMissionParticipantsTerrain(input: {
  participantIds: string[];
  mission: { numero: string; objet: string; _id: string };
  message: string;
}): Promise<MissionNotificationResult[]> {
  const link = buildMissionLink(input.mission._id);
  const results: MissionNotificationResult[] = [];

  for (const userId of input.participantIds) {
    const contact = await loadUserContact(userId);
    if (!contact) continue;
    const sent = await notifyTarget({
      target: contact,
      emailSubject: `Mission ${input.mission.numero} — suivi terrain`,
      emailBody: `${input.message}\n\nMission : ${input.mission.objet}\nLien : ${link}`,
      smsMessage: `INP mission ${input.mission.numero}: ${input.message} ${link}`,
    });
    results.push(...sent);
  }

  return results;
}

export async function notifyMissionParticipantsValidated(input: {
  mission: {
    _id: string;
    numero: string;
    objet: string;
    dateDepart: Date | string;
    dateRetour: Date | string;
    chefFullname?: string;
    destinationLabel?: string;
  };
  participants: Array<{
    userId: string;
    fullname: string;
    email?: string;
    phone?: string;
  }>;
}): Promise<MissionNotificationResult[]> {
  if (!input.participants.length) return [];

  const link = buildMissionLink(input.mission._id);
  const subject = `Mission ${input.mission.numero} validée`;
  const bodyLines = [
    "Votre mission a été validée. Vous êtes concerné(e) par cet ordre de mission.",
    "",
    `N° : ${input.mission.numero}`,
    `Objet : ${input.mission.objet}`,
    `Période : ${formatDateFr(input.mission.dateDepart)} → ${formatDateFr(input.mission.dateRetour)}`,
    input.mission.chefFullname ? `Chef de mission : ${input.mission.chefFullname}` : "",
    input.mission.destinationLabel
      ? `Destination : ${input.mission.destinationLabel}`
      : "",
    "",
    `Consulter la mission : ${link}`,
  ].filter(Boolean);

  const body = bodyLines.join("\n");
  const sms = `INP : mission ${input.mission.numero} validee. ${link}`;

  const seen = new Set<string>();
  const results: MissionNotificationResult[] = [];

  for (const participant of input.participants) {
    if (seen.has(participant.userId)) continue;
    seen.add(participant.userId);

    let email = participant.email?.trim();
    let phone = participant.phone;

    if (!email || !phone) {
      const contact = await loadUserContact(participant.userId);
      if (contact) {
        email = email || contact.email;
        phone = phone || contact.phone;
      }
    }

    if (!email?.trim()) continue;

    const sent = await notifyTarget({
      target: {
        userId: participant.userId,
        fullname: participant.fullname,
        email,
        phone,
      },
      emailSubject: subject,
      emailBody: body,
      smsMessage: `Bonjour ${participant.fullname}, ${sms}`,
    });
    results.push(...sent);
  }

  return results;
}
