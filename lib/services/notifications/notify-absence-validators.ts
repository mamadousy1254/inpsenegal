import { isValidSenegalPhone, normalizeSenegalPhone } from "@/lib/constants/phone";
import type { NotifierChannel } from "@/lib/constants/notifications";
import type { IAbsenceValidation } from "@/lib/mongo/models/absence-request.model";
import UserModel from "@/lib/mongo/models/user.model";
import { getValidatorsToNotify } from "@/lib/services/absence/validation-workflow";
import { findActiveDelegationForDelegator } from "@/lib/services/delegation/delegation-service";
import { sendMessageEmail } from "@/lib/services/notifications/send-message-email";
import { sendMessageSms } from "@/lib/services/notifications/send-message-sms";

export type AbsenceNotificationContext = {
  requesterFullname: string;
  dateDepart: Date;
  dateFin: Date;
  duree: number;
  raison: string;
};

export type AbsenceNotificationResult = {
  validatorUserId: string;
  fullname: string;
  channel: NotifierChannel;
  success: boolean;
  error?: string;
};

function formatDateFr(value: Date): string {
  return value.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getAppBaseUrl(): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function buildAbsenceLink(): string {
  return `${getAppBaseUrl()}/dashboard/absences`;
}

function buildSmsMessage(
  validatorFullname: string,
  ctx: AbsenceNotificationContext,
): string {
  const link = buildAbsenceLink();
  return `Bonjour ${validatorFullname}, demande d'absence de ${ctx.requesterFullname} (${formatDateFr(ctx.dateDepart)}-${formatDateFr(ctx.dateFin)}, ${ctx.duree}j). Valider : ${link}`;
}

function buildEmailSubject(ctx: AbsenceNotificationContext): string {
  return `Demande d'absence — ${ctx.requesterFullname}`;
}

function buildEmailBody(
  validatorFullname: string,
  ctx: AbsenceNotificationContext,
): string {
  const link = buildAbsenceLink();
  return [
    `Une demande d'absence de ${ctx.requesterFullname} est en attente de votre validation.`,
    "",
    `Motif : ${ctx.raison}`,
    `Période : ${formatDateFr(ctx.dateDepart)} → ${formatDateFr(ctx.dateFin)} (${ctx.duree} jour${ctx.duree > 1 ? "s" : ""} ouvré${ctx.duree > 1 ? "s" : ""})`,
    "",
    `Consultez et validez la demande ici : ${link}`,
  ].join("\n");
}

async function sendEmailAndSms(input: {
  userId: string;
  fullname: string;
  email?: string | null;
  phone?: string | null;
  emailSubject: string;
  emailBody: string;
  smsMessage: string;
}): Promise<AbsenceNotificationResult[]> {
  const results: AbsenceNotificationResult[] = [];

  if (input.email?.trim()) {
    try {
      await sendMessageEmail({
        email: input.email,
        fullname: input.fullname,
        subject: input.emailSubject,
        message: input.emailBody,
      });
      results.push({
        validatorUserId: input.userId,
        fullname: input.fullname,
        channel: "email",
        success: true,
      });
    } catch (error) {
      results.push({
        validatorUserId: input.userId,
        fullname: input.fullname,
        channel: "email",
        success: false,
        error: error instanceof Error ? error.message : "Erreur e-mail",
      });
    }
  } else {
    results.push({
      validatorUserId: input.userId,
      fullname: input.fullname,
      channel: "email",
      success: false,
      error: "Adresse e-mail manquante",
    });
  }

  const phone = input.phone ? normalizeSenegalPhone(input.phone) : "";
  if (phone && isValidSenegalPhone(phone)) {
    try {
      await sendMessageSms({
        phone,
        message: input.smsMessage,
      });
      results.push({
        validatorUserId: input.userId,
        fullname: input.fullname,
        channel: "sms",
        success: true,
      });
    } catch (error) {
      results.push({
        validatorUserId: input.userId,
        fullname: input.fullname,
        channel: "sms",
        success: false,
        error: error instanceof Error ? error.message : "Erreur SMS",
      });
    }
  } else {
    results.push({
      validatorUserId: input.userId,
      fullname: input.fullname,
      channel: "sms",
      success: false,
      error: "Numéro de téléphone invalide ou manquant",
    });
  }

  return results;
}

function hasAnySuccessfulDelivery(
  results: AbsenceNotificationResult[],
): boolean {
  return results.some((result) => result.success);
}

async function notifyValidator(
  validator: IAbsenceValidation,
  ctx: AbsenceNotificationContext,
): Promise<AbsenceNotificationResult[]> {
  const validatorUserId = validator.validatorUserId.toString();

  return sendEmailAndSms({
    userId: validatorUserId,
    fullname: validator.fullname,
    email: validator.email,
    phone: validator.phone,
    emailSubject: buildEmailSubject(ctx),
    emailBody: buildEmailBody(validator.fullname, ctx),
    smsMessage: buildSmsMessage(validator.fullname, ctx),
  });
}

function buildDelegatedEmailBody(
  delegateFullname: string,
  delegatorFullname: string,
  ctx: AbsenceNotificationContext,
): string {
  const link = buildAbsenceLink();
  return [
    `Bonjour ${delegateFullname},`,
    "",
    `Vous recevez cette notification en délégation de ${delegatorFullname}.`,
    `Une demande d'absence de ${ctx.requesterFullname} est en attente de validation.`,
    "",
    `Motif : ${ctx.raison}`,
    `Période : ${formatDateFr(ctx.dateDepart)} → ${formatDateFr(ctx.dateFin)} (${ctx.duree} jour${ctx.duree > 1 ? "s" : ""} ouvré${ctx.duree > 1 ? "s" : ""})`,
    "",
    `Consultez et validez la demande ici : ${link}`,
  ].join("\n");
}

function buildDelegatedSmsMessage(
  delegateFullname: string,
  delegatorFullname: string,
  ctx: AbsenceNotificationContext,
): string {
  const link = buildAbsenceLink();
  return `Bonjour ${delegateFullname}, en delegation de ${delegatorFullname} : demande d'absence de ${ctx.requesterFullname} (${formatDateFr(ctx.dateDepart)}-${formatDateFr(ctx.dateFin)}, ${ctx.duree}j). Valider : ${link}`;
}

async function notifyDelegate(
  delegateUserId: string,
  delegatorFullname: string,
  ctx: AbsenceNotificationContext,
): Promise<AbsenceNotificationResult[] | null> {
  const delegate = await UserModel.findById(delegateUserId)
    .select("firstname lastname email phone")
    .lean();

  if (!delegate) return null;

  const fullname = `${delegate.firstname ?? ""} ${delegate.lastname ?? ""}`.trim();

  return sendEmailAndSms({
    userId: delegateUserId,
    fullname,
    email: delegate.email,
    phone: delegate.phone,
    emailSubject: `[Délégation] ${buildEmailSubject(ctx)}`,
    emailBody: buildDelegatedEmailBody(fullname, delegatorFullname, ctx),
    smsMessage: buildDelegatedSmsMessage(fullname, delegatorFullname, ctx),
  });
}

export async function notifyAbsenceValidators(input: {
  validations: IAbsenceValidation[];
  context: AbsenceNotificationContext;
  /** Conservé pour compatibilité API — e-mail et SMS sont toujours tentés. */
  channel?: NotifierChannel;
}): Promise<AbsenceNotificationResult[]> {
  const targets = getValidatorsToNotify(input.validations);
  if (targets.length === 0) return [];

  const results: AbsenceNotificationResult[] = [];

  for (const validator of targets) {
    const validatorUserId = validator.validatorUserId.toString();
    const delegation = await findActiveDelegationForDelegator(validatorUserId);

    if (delegation) {
      const delegateResults = await notifyDelegate(
        delegation.delegateUserId.toString(),
        validator.fullname,
        input.context,
      );
      if (delegateResults) {
        results.push(...delegateResults);
        if (hasAnySuccessfulDelivery(delegateResults)) {
          continue;
        }
      }
    }

    const validatorResults = await notifyValidator(validator, input.context);
    results.push(...validatorResults);
  }

  return results;
}

export function hasFullyFailedValidatorNotifications(
  results: AbsenceNotificationResult[],
): boolean {
  const byUser = new Map<string, AbsenceNotificationResult[]>();

  for (const result of results) {
    const existing = byUser.get(result.validatorUserId) ?? [];
    existing.push(result);
    byUser.set(result.validatorUserId, existing);
  }

  return [...byUser.values()].some(
    (userResults) => !userResults.some((result) => result.success),
  );
}

export type RequesterNotificationResult = {
  success: boolean;
  channel?: NotifierChannel;
  channels?: NotifierChannel[];
  error?: string;
};

function buildRequesterApprovedSms(input: {
  firstname: string;
  dateDepart: Date;
  dateFin: Date;
  duree: number;
  raison: string;
}): string {
  const link = buildAbsenceLink();
  return `Bonjour ${input.firstname}, votre demande d'absence (${formatDateFr(input.dateDepart)}-${formatDateFr(input.dateFin)}, ${input.duree}j, ${input.raison}) a ete approuvee. Details : ${link}`;
}

function buildRequesterApprovedEmailBody(input: {
  firstname: string;
  dateDepart: Date;
  dateFin: Date;
  duree: number;
  raison: string;
}): string {
  const link = buildAbsenceLink();
  return [
    `Votre demande d'absence a ete approuvee par l'ensemble des validateurs.`,
    "",
    `Motif : ${input.raison}`,
    `Période : ${formatDateFr(input.dateDepart)} → ${formatDateFr(input.dateFin)} (${input.duree} jour${input.duree > 1 ? "s" : ""} ouvré${input.duree > 1 ? "s" : ""})`,
    "",
    `Consultez le détail ici : ${link}`,
  ].join("\n");
}

async function loadRequesterContact(requesterId: string) {
  const user = await UserModel.findById(requesterId)
    .select("firstname lastname email phone")
    .lean();

  if (!user) return null;

  return {
    firstname: user.firstname ?? "",
    lastname: user.lastname ?? "",
    email: user.email ?? "",
    phone: user.phone,
    fullname: `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim(),
  };
}

async function sendRequesterNotification(input: {
  contact: NonNullable<Awaited<ReturnType<typeof loadRequesterContact>>>;
  smsMessage: string;
  emailSubject: string;
  emailBody: string;
}): Promise<RequesterNotificationResult> {
  const { contact } = input;
  const channels: NotifierChannel[] = [];
  const errors: string[] = [];

  if (contact.email?.trim()) {
    try {
      await sendMessageEmail({
        email: contact.email,
        fullname: contact.fullname,
        subject: input.emailSubject,
        message: input.emailBody,
      });
      channels.push("email");
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : "Erreur envoi e-mail",
      );
    }
  } else {
    errors.push("Adresse e-mail manquante");
  }

  const normalizedPhone = contact.phone
    ? normalizeSenegalPhone(contact.phone)
    : undefined;

  if (normalizedPhone && isValidSenegalPhone(normalizedPhone)) {
    try {
      await sendMessageSms({
        phone: normalizedPhone,
        message: input.smsMessage,
      });
      channels.push("sms");
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Erreur envoi SMS");
    }
  } else {
    errors.push("Numéro de téléphone invalide ou manquant");
  }

  if (channels.length > 0) {
    return { success: true, channels };
  }

  return {
    success: false,
    error: errors.join(" · ") || "Aucun moyen de contact pour le demandeur",
  };
}

/** Notifie le demandeur lorsque la demande est entièrement approuvée ou refusée. */
export async function notifyRequesterOnFinalDecision(input: {
  requesterId: string;
  statutValidation: "approuvee" | "rejetee";
  dateDepart: Date;
  dateFin: Date;
  duree: number;
  raison: string;
  rejectionComment?: string;
}): Promise<RequesterNotificationResult> {
  const contact = await loadRequesterContact(input.requesterId);
  if (!contact) {
    return { success: false, error: "Demandeur introuvable" };
  }

  const payload = {
    firstname: contact.firstname,
    dateDepart: input.dateDepart,
    dateFin: input.dateFin,
    duree: input.duree,
    raison: input.raison,
  };

  if (input.statutValidation === "approuvee") {
    return sendRequesterNotification({
      contact,
      smsMessage: buildRequesterApprovedSms(payload),
      emailSubject: "Demande d'absence approuvée — INP Intranet",
      emailBody: buildRequesterApprovedEmailBody(payload),
    });
  }

  if (!input.rejectionComment?.trim()) {
    return { success: false, error: "Motif du refus manquant" };
  }

  const rejectedPayload = {
    ...payload,
    rejectionComment: input.rejectionComment.trim(),
  };

  return sendRequesterNotification({
    contact,
    smsMessage: buildRequesterRejectedSms(rejectedPayload),
    emailSubject: "Demande d'absence refusée — INP Intranet",
    emailBody: buildRequesterRejectedEmailBody(rejectedPayload),
  });
}

/** @deprecated Préférer notifyRequesterOnFinalDecision */
export async function notifyRequesterAbsenceApproved(input: {
  requesterId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  dateDepart: Date;
  dateFin: Date;
  duree: number;
  raison: string;
}): Promise<RequesterNotificationResult> {
  return notifyRequesterOnFinalDecision({
    requesterId: input.requesterId,
    statutValidation: "approuvee",
    dateDepart: input.dateDepart,
    dateFin: input.dateFin,
    duree: input.duree,
    raison: input.raison,
  });
}

function truncateForSms(text: string, maxLength = 120): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
}

function buildRequesterRejectedSms(input: {
  firstname: string;
  dateDepart: Date;
  dateFin: Date;
  duree: number;
  raison: string;
  rejectionComment: string;
}): string {
  const link = buildAbsenceLink();
  const motif = truncateForSms(input.rejectionComment);
  return `Bonjour ${input.firstname}, votre demande d'absence (${formatDateFr(input.dateDepart)}-${formatDateFr(input.dateFin)}, ${input.duree}j, ${input.raison}) a ete refusee. Motif : ${motif}. Details : ${link}`;
}

function buildRequesterRejectedEmailBody(input: {
  firstname: string;
  dateDepart: Date;
  dateFin: Date;
  duree: number;
  raison: string;
  rejectionComment: string;
}): string {
  const link = buildAbsenceLink();
  return [
    `Votre demande d'absence a été refusée.`,
    "",
    `Motif de la demande : ${input.raison}`,
    `Période : ${formatDateFr(input.dateDepart)} → ${formatDateFr(input.dateFin)} (${input.duree} jour${input.duree > 1 ? "s" : ""} ouvré${input.duree > 1 ? "s" : ""})`,
    "",
    `Motif du refus : ${input.rejectionComment}`,
    "",
    `Consultez le détail ici : ${link}`,
  ].join("\n");
}

/** @deprecated Préférer notifyRequesterOnFinalDecision */
export async function notifyRequesterAbsenceRejected(input: {
  requesterId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  dateDepart: Date;
  dateFin: Date;
  duree: number;
  raison: string;
  rejectionComment: string;
}): Promise<RequesterNotificationResult> {
  return notifyRequesterOnFinalDecision({
    requesterId: input.requesterId,
    statutValidation: "rejetee",
    dateDepart: input.dateDepart,
    dateFin: input.dateFin,
    duree: input.duree,
    raison: input.raison,
    rejectionComment: input.rejectionComment,
  });
}
