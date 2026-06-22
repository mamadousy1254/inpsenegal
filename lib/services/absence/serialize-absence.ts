import type { IAbsenceRequest } from "@/lib/mongo/models/absence-request.model";
import { canViewAllAbsences } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type { AbsenceRequestEntry } from "@/lib/types/absence";
import { serializeAbsenceJustificatif } from "@/lib/services/absence/justificatif";

export function serializeAbsenceRequest(
  doc: IAbsenceRequest | Record<string, unknown>,
): AbsenceRequestEntry {
  const absence = doc as IAbsenceRequest;
  return {
    _id: String(absence._id),
    requesterId: String(absence.requesterId),
    requesterEmail: absence.requesterEmail,
    firstname: absence.firstname,
    lastname: absence.lastname,
    phone: absence.phone,
    occupation: absence.occupation,
    absenceType: absence.absenceType,
    dateDepart: new Date(absence.dateDepart).toISOString(),
    dateFin: new Date(absence.dateFin).toISOString(),
    dateSoumission: new Date(absence.dateSoumission).toISOString(),
    raison: absence.raison,
    duree: absence.duree,
    contractYear: absence.contractYear,
    validations: (absence.validations ?? []).map((v) => ({
      validatorUserId: String(v.validatorUserId),
      level: v.level,
      role: v.role,
      email: v.email,
      fullname: v.fullname,
      phone: v.phone,
      isValidated: v.isValidated,
      isRejected: v.isRejected,
      comment: v.comment,
      validatedAt: v.validatedAt
        ? new Date(v.validatedAt).toISOString()
        : undefined,
      actedByUserId: v.actedByUserId ? String(v.actedByUserId) : undefined,
      actedByFullname: v.actedByFullname,
      onBehalfOfUserId: v.onBehalfOfUserId
        ? String(v.onBehalfOfUserId)
        : undefined,
      delegationId: v.delegationId ? String(v.delegationId) : undefined,
    })),
    statutValidation: absence.statutValidation,
    requiredValidatorsCount: absence.requiredValidatorsCount,
    createdAt: (absence as { createdAt?: Date }).createdAt
      ? new Date((absence as { createdAt?: Date }).createdAt!).toISOString()
      : undefined,
    justificatif: serializeAbsenceJustificatif(absence.justificatif),
  };
}

export function canViewFullAbsenceDetails(
  role: UserRole,
  userId: string,
  absence: IAbsenceRequest | Record<string, unknown>,
): boolean {
  const doc = absence as IAbsenceRequest;
  if (canViewAllAbsences(role)) return true;
  return doc.requesterId?.toString() === userId;
}

export function isAbsenceValidator(
  userId: string,
  absence: IAbsenceRequest | Record<string, unknown>,
  delegatorIdsForUser: string[] = [],
): boolean {
  const doc = absence as IAbsenceRequest;
  return (doc.validations ?? []).some(
    (validation) =>
      validation.validatorUserId.toString() === userId ||
      delegatorIdsForUser.includes(validation.validatorUserId.toString()),
  );
}

export function serializeAbsenceRequestForViewer(
  doc: IAbsenceRequest | Record<string, unknown>,
  viewer: { id: string; role: UserRole },
  delegatorIdsForUser: string[] = [],
): AbsenceRequestEntry {
  const serialized = serializeAbsenceRequest(doc);

  if (canViewFullAbsenceDetails(viewer.role, viewer.id, doc)) {
    return serialized;
  }

  if (!isAbsenceValidator(viewer.id, doc, delegatorIdsForUser)) {
    return serialized;
  }

  const pending = serialized.validations.find(
    (v) => !v.isValidated && !v.isRejected,
  );
  const actingForValidatorId =
    pending &&
    delegatorIdsForUser.includes(pending.validatorUserId) &&
    pending.validatorUserId !== viewer.id
      ? pending.validatorUserId
      : viewer.id;

  return {
    ...serialized,
    requesterEmail: undefined,
    phone: undefined,
    validations: serialized.validations.map((validation) => {
      if (
        validation.validatorUserId === viewer.id ||
        validation.validatorUserId === actingForValidatorId
      ) {
        return validation;
      }

      return {
        validatorUserId: validation.validatorUserId,
        level: validation.level,
        role: validation.role,
        email: "",
        fullname: validation.fullname,
        isValidated: validation.isValidated,
        isRejected: validation.isRejected,
        comment:
          validation.isValidated || validation.isRejected
            ? validation.comment
            : undefined,
        validatedAt: validation.validatedAt,
        actedByFullname: validation.actedByFullname,
      };
    }),
  };
}
