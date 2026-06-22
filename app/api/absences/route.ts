import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import {
  ABSENCE_TYPES,
  VALIDATION_STATUSES,
  shouldDeductLeaveBalance,
} from "@/lib/constants/leave";
import {
  NOTIFIER_CHANNELS,
  type NotifierChannel,
} from "@/lib/constants/notifications";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import AbsenceRequestModel from "@/lib/mongo/models/absence-request.model";
import UserModel from "@/lib/mongo/models/user.model";
import { canViewAllAbsences, canBypassAbsenceValidation } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { buildValidationsForUser } from "@/lib/services/absence/build-validations";
import { enrichAbsenceValidations } from "@/lib/services/absence/enrich-validation-delegations";
import { parseAbsenceJustificatifInput } from "@/lib/services/absence/justificatif";
import {
  serializeAbsenceRequest,
  serializeAbsenceRequestForViewer,
} from "@/lib/services/absence/serialize-absence";
import { determineValidationStatus } from "@/lib/services/absence/validation-workflow";
import { getDelegatorIdsForDelegate } from "@/lib/services/delegation/delegation-service";
import { deleteFromCloudinary } from "@/lib/services/ged/cloudinary-upload";
import { computeBusinessDays } from "@/lib/services/leave/compute-duration";
import { consumeLeaveDays, consumeLeaveDaysWithDebt } from "@/lib/services/leave/leave-balance-service";
import { logActivity } from "@/lib/services/audit/log-activity";
import { notifyAbsenceValidators, notifyRequesterOnFinalDecision } from "@/lib/services/notifications/notify-absence-validators";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 15)));
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const scope = searchParams.get("scope") ?? "mine";

    await connectDB();

    const role = session.user.role as UserRole;
    const filter: Record<string, unknown> = {};
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);
    const canViewAll = canViewAllAbsences(role);
    const actingForDelegatorIds = await getDelegatorIdsForDelegate(session.user.id);
    const validatorObjectIds = [
      userObjectId,
      ...actingForDelegatorIds.map((id) => new mongoose.Types.ObjectId(id)),
    ];

    if (canViewAll) {
      if (scope === "mine") {
        filter.requesterId = userObjectId;
      } else if (scope === "to-validate") {
        filter["validations.validatorUserId"] = { $in: validatorObjectIds };
        filter.statutValidation = { $in: ["en_attente", "en_cours"] };
      }
    } else if (scope === "to-validate") {
      filter["validations.validatorUserId"] = { $in: validatorObjectIds };
      filter.statutValidation = { $in: ["en_attente", "en_cours"] };
    } else {
      filter.requesterId = userObjectId;
    }

    if (status && VALIDATION_STATUSES.includes(status as (typeof VALIDATION_STATUSES)[number])) {
      filter.statutValidation = status;
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { firstname: regex },
        { lastname: regex },
        { requesterEmail: regex },
        { raison: regex },
        { occupation: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      AbsenceRequestModel.find(filter)
        .sort({ dateSoumission: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AbsenceRequestModel.countDocuments(filter),
    ]);

    const serializedItems = await Promise.all(
      items.map(async (item) =>
        enrichAbsenceValidations(
          serializeAbsenceRequestForViewer(
            item,
            {
              id: session.user.id,
              role,
            },
            actingForDelegatorIds,
          ),
        ),
      ),
    );

    return NextResponse.json({
      items: serializedItems,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      actingForDelegatorIds,
    });
  } catch (error) {
    console.error("GET /api/absences", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const {
      absenceType,
      dateDepart,
      dateFin,
      raison,
      targetUserId,
      adminBypass = false,
      notifyChannel = "sms",
      justificatif: justificatifInput,
    } = body;

    const justificatif = parseAbsenceJustificatifInput(justificatifInput);

    const role = session.user.role as UserRole;
    const resolvedNotifyChannel: NotifierChannel =
      notifyChannel === "email" ? "email" : "sms";

    if (adminBypass && !canBypassAbsenceValidation(role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (
      targetUserId &&
      targetUserId !== session.user.id &&
      !canBypassAbsenceValidation(role)
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (
      !absenceType ||
      !ABSENCE_TYPES.includes(absenceType) ||
      !dateDepart ||
      !dateFin ||
      !raison?.trim()
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 },
      );
    }

    const start = new Date(dateDepart);
    const end = new Date(dateFin);
    if (end < start) {
      return NextResponse.json(
        { error: "La date de fin doit être après la date de départ" },
        { status: 400 },
      );
    }

    await connectDB();

    const requesterId =
      targetUserId && typeof targetUserId === "string"
        ? targetUserId
        : session.user.id;

    const user = await UserModel.findById(requesterId).lean();
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    let validations = await buildValidationsForUser(requesterId);
    const duree = computeBusinessDays(start, end);
    let statutValidation = determineValidationStatus(validations);

    if (adminBypass) {
      validations = validations.map((v) => ({
        ...v,
        isValidated: true,
        isRejected: false,
        validatedAt: new Date(),
      }));
      statutValidation = "approuvee";
    } else if (validations.length === 0) {
      statutValidation = "approuvee";
    }

    const absence = await AbsenceRequestModel.create({
      requesterId: user._id,
      requesterEmail: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      occupation: user.occupation,
      absenceType,
      dateDepart: start,
      dateFin: end,
      dateSoumission: new Date(),
      raison: raison.trim(),
      duree,
      contractYear: user.contractYear,
      validations,
      requiredValidatorsCount: validations.length,
      statutValidation,
      adminBypass: Boolean(adminBypass),
      adminBypassBy: adminBypass ? session.user.id : undefined,
      ...(justificatif ? { justificatif } : {}),
    });

    async function cleanupJustificatif() {
      if (!justificatif) return;
      try {
        await deleteFromCloudinary({
          publicId: justificatif.cloudinaryId,
          resourceType: justificatif.resourceType,
        });
      } catch (cleanupError) {
        console.error("Nettoyage justificatif Cloudinary:", cleanupError);
      }
    }

    let debtDays = 0;
    const deductLeave = shouldDeductLeaveBalance(raison.trim());

    if (statutValidation === "approuvee" && deductLeave) {
      if (adminBypass) {
        const result = await consumeLeaveDaysWithDebt(requesterId, duree);
        if (!result.ok) {
          await absence.deleteOne();
          await cleanupJustificatif();
          return NextResponse.json(
            { error: "Impossible de mettre à jour le solde de congés" },
            { status: 400 },
          );
        }
        debtDays = result.debtDays;
      } else {
        const ok = await consumeLeaveDays(requesterId, duree);
        if (!ok) {
          await absence.deleteOne();
          await cleanupJustificatif();
          return NextResponse.json(
            { error: "Solde de congés insuffisant pour cette demande" },
            { status: 400 },
          );
        }
      }
    }

    try {
      const isOnBehalf =
        Boolean(targetUserId) && targetUserId !== session.user.id;
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: adminBypass
          ? ACTIONS.ABSENCE_ADMIN_BYPASS
          : ACTIONS.ABSENCE_CREATE,
        actionType: adminBypass ? "validate" : "create",
        resource: "AbsenceRequest",
        resourceId: absence._id.toString(),
        description: adminBypass
          ? ACTION_LABELS[ACTIONS.ABSENCE_ADMIN_BYPASS]
          : ACTION_LABELS[ACTIONS.ABSENCE_CREATE],
        metadata: {
          requesterFullname: `${user.firstname} ${user.lastname}`,
          requesterEmail: user.email,
          dateDepart,
          dateFin,
          duree,
          raison: raison.trim(),
          absenceType,
          statutValidation,
          ...(adminBypass && { adminBypass: true }),
          ...(debtDays > 0 && { debtDays }),
          ...(isOnBehalf && {
            onBehalfOf: `${user.firstname} ${user.lastname}`,
          }),
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (absence.create):", auditError);
    }

    let notifications: Awaited<
      ReturnType<typeof notifyAbsenceValidators>
    > = [];

    if (
      !adminBypass &&
      validations.length > 0 &&
      statutValidation === "en_attente"
    ) {
      try {
        notifications = await notifyAbsenceValidators({
          validations: absence.validations,
          channel: resolvedNotifyChannel,
          context: {
            requesterFullname: `${user.firstname} ${user.lastname}`,
            dateDepart: start,
            dateFin: end,
            duree,
            raison: raison.trim(),
          },
        });
      } catch (notifyError) {
        console.error("Notification validateurs (absence.create):", notifyError);
      }
    }

    if (adminBypass && statutValidation === "approuvee") {
      try {
        const result = await notifyRequesterOnFinalDecision({
          requesterId: user._id.toString(),
          statutValidation: "approuvee",
          dateDepart: start,
          dateFin: end,
          duree,
          raison: raison.trim(),
        });
        if (!result.success) {
          console.error(
            "Notification demandeur (absence.create):",
            result.error,
            { requesterId: user._id.toString() },
          );
        }
      } catch (notifyError) {
        console.error("Notification demandeur (absence.create):", notifyError);
      }
    }

    return NextResponse.json(
      {
        absence: await enrichAbsenceValidations(
          serializeAbsenceRequest(absence),
        ),
        debtDays,
        notifications,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/absences", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande" },
      { status: 500 },
    );
  }
}
