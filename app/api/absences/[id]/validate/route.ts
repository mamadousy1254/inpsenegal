import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { shouldDeductLeaveBalance } from "@/lib/constants/leave";
import { connectDB } from "@/lib/mongo/db";
import AbsenceRequestModel from "@/lib/mongo/models/absence-request.model";
import {
  canValidatorAct,
  determineValidationStatus,
  findActingValidation,
  isFinalValidationStatus,
} from "@/lib/services/absence/validation-workflow";
import { serializeAbsenceRequestForViewer } from "@/lib/services/absence/serialize-absence";
import { enrichAbsenceValidations } from "@/lib/services/absence/enrich-validation-delegations";
import type { UserRole } from "@/lib/permissions/roles";
import { consumeLeaveDays } from "@/lib/services/leave/leave-balance-service";
import { logActivity } from "@/lib/services/audit/log-activity";
import {
  findActiveDelegation,
  getDelegatorIdsForDelegate,
} from "@/lib/services/delegation/delegation-service";
import {
  notifyAbsenceValidators,
  notifyRequesterOnFinalDecision,
} from "@/lib/services/notifications/notify-absence-validators";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const action = body.action as "approve" | "reject";
    const comment = body.comment?.trim();

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    if (action === "reject" && !comment) {
      return NextResponse.json(
        { error: "Un commentaire est requis pour un refus" },
        { status: 400 },
      );
    }

    await connectDB();

    const absence = await AbsenceRequestModel.findById(id);
    if (!absence) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    if (!["en_attente", "en_cours"].includes(absence.statutValidation)) {
      return NextResponse.json(
        { error: "Cette demande est déjà traitée" },
        { status: 400 },
      );
    }

    const actingForDelegatorIds = await getDelegatorIdsForDelegate(session.user.id);

    if (
      !canValidatorAct(
        absence.validations,
        session.user.id,
        actingForDelegatorIds,
      )
    ) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas valider cette demande pour le moment" },
        { status: 403 },
      );
    }

    const actingValidation = findActingValidation(
      absence.validations,
      session.user.id,
      actingForDelegatorIds,
    );

    if (!actingValidation) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const validation = absence.validations.find(
      (v: (typeof absence.validations)[number]) =>
        v.validatorUserId.toString() ===
        actingValidation.validatorUserId.toString(),
    );

    if (!validation) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const isDelegated =
      actingValidation.validatorUserId.toString() !== session.user.id;

    if (isDelegated) {
      const delegation = await findActiveDelegation(
        actingValidation.validatorUserId.toString(),
        session.user.id,
      );

      validation.actedByUserId = new mongoose.Types.ObjectId(session.user.id);
      validation.actedByFullname =
        `${session.user.firstname} ${session.user.lastname}`.trim();
      validation.onBehalfOfUserId = actingValidation.validatorUserId;
      if (delegation?._id) {
        validation.delegationId = delegation._id;
      }
    }

    if (action === "approve") {
      validation.isValidated = true;
      validation.isRejected = false;
    } else {
      validation.isValidated = false;
      validation.isRejected = true;
      validation.comment = comment;
    }

    validation.validatedAt = new Date();
    if (comment && action === "approve") {
      validation.comment = comment;
    }

    absence.statutValidation = determineValidationStatus(absence.validations);
    absence.markModified("validations");

    if (
      absence.statutValidation === "approuvee" &&
      shouldDeductLeaveBalance(absence.raison)
    ) {
      const ok = await consumeLeaveDays(
        absence.requesterId.toString(),
        absence.duree,
      );
      if (!ok) {
        return NextResponse.json(
          {
            error:
              "Solde de congés insuffisant pour approuver cette demande",
          },
          { status: 400 },
        );
      }
    }

    await absence.save();

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action:
          action === "approve"
            ? ACTIONS.ABSENCE_APPROVE
            : ACTIONS.ABSENCE_REJECT,
        actionType: action === "approve" ? "validate" : "reject",
        resource: "AbsenceRequest",
        resourceId: absence._id.toString(),
        description:
          action === "approve"
            ? ACTION_LABELS[ACTIONS.ABSENCE_APPROVE]
            : ACTION_LABELS[ACTIONS.ABSENCE_REJECT],
        metadata: {
          requesterFullname: `${absence.firstname} ${absence.lastname}`,
          requesterEmail: absence.requesterEmail,
          dateDepart: absence.dateDepart.toISOString().slice(0, 10),
          dateFin: absence.dateFin.toISOString().slice(0, 10),
          duree: absence.duree,
          raison: absence.raison,
          absenceType: absence.absenceType,
          statutValidation: absence.statutValidation,
          ...(isDelegated && {
            onBehalfOf: actingValidation.fullname,
            delegatedValidation: true,
          }),
          ...(comment && { comment }),
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (absence.validate):", auditError);
    }

    if (action === "approve" && absence.statutValidation === "en_cours") {
      try {
        await notifyAbsenceValidators({
          validations: absence.validations,
          context: {
            requesterFullname: `${absence.firstname} ${absence.lastname}`,
            dateDepart: absence.dateDepart,
            dateFin: absence.dateFin,
            duree: absence.duree,
            raison: absence.raison,
          },
        });
      } catch (notifyError) {
        console.error(
          "Notification validateurs (absence.validate):",
          notifyError,
        );
      }
    }

    if (isFinalValidationStatus(absence.statutValidation)) {
      try {
        const result = await notifyRequesterOnFinalDecision({
          requesterId: absence.requesterId.toString(),
          statutValidation: absence.statutValidation,
          dateDepart: absence.dateDepart,
          dateFin: absence.dateFin,
          duree: absence.duree,
          raison: absence.raison,
          rejectionComment: action === "reject" ? comment : undefined,
        });

        if (!result.success) {
          console.error(
            "Notification demandeur (décision finale):",
            result.error,
            { requesterId: absence.requesterId.toString() },
          );
        }
      } catch (notifyError) {
        console.error(
          "Notification demandeur (absence.validate):",
          notifyError,
        );
      }
    }

    return NextResponse.json({
      absence: await enrichAbsenceValidations(
        serializeAbsenceRequestForViewer(
          absence,
          {
            id: session.user.id,
            role: session.user.role as UserRole,
          },
          actingForDelegatorIds,
        ),
      ),
    });
  } catch (error) {
    console.error("POST /api/absences/[id]/validate", error);
    return NextResponse.json(
      { error: "Erreur lors de la validation" },
      { status: 500 },
    );
  }
}
