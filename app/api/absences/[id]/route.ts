import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import AbsenceRequestModel from "@/lib/mongo/models/absence-request.model";
import { canViewAllAbsences } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import {
  canViewFullAbsenceDetails,
  isAbsenceValidator,
  serializeAbsenceRequest,
  serializeAbsenceRequestForViewer,
} from "@/lib/services/absence/serialize-absence";
import { enrichAbsenceValidations } from "@/lib/services/absence/enrich-validation-delegations";
import { getDelegatorIdsForDelegate } from "@/lib/services/delegation/delegation-service";
import { logActivity } from "@/lib/services/audit/log-activity";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const absence = await AbsenceRequestModel.findById(id);
    if (!absence) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    const role = session.user.role as UserRole;
    const isOwner = absence.requesterId.toString() === session.user.id;
    const canDelete =
      isOwner ||
      canViewAllAbsences(role);

    if (!canDelete) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (isOwner && !["en_attente", "en_cours"].includes(absence.statutValidation)) {
      return NextResponse.json(
        { error: "Impossible de supprimer une demande déjà traitée" },
        { status: 400 },
      );
    }

    await absence.deleteOne();

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.ABSENCE_DELETE,
        actionType: "delete",
        resource: "AbsenceRequest",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.ABSENCE_DELETE],
        metadata: {
          requesterFullname: `${absence.firstname} ${absence.lastname}`,
          requesterEmail: absence.requesterEmail,
          dateDepart: absence.dateDepart.toISOString().slice(0, 10),
          dateFin: absence.dateFin.toISOString().slice(0, 10),
          duree: absence.duree,
          raison: absence.raison,
          absenceType: absence.absenceType,
          statutValidation: absence.statutValidation,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (absence.delete):", auditError);
    }

    return NextResponse.json({ message: "Demande supprimée" });
  } catch (error) {
    console.error("DELETE /api/absences/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const absence = await AbsenceRequestModel.findById(id).lean();
    if (!absence) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    const role = session.user.role as UserRole;
    const actingForDelegatorIds = await getDelegatorIdsForDelegate(session.user.id);
    const isOwner = absence.requesterId.toString() === session.user.id;
    const isValidator = isAbsenceValidator(
      session.user.id,
      absence,
      actingForDelegatorIds,
    );

    if (
      !isOwner &&
      !isValidator &&
      !canViewFullAbsenceDetails(role, session.user.id, absence)
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    return NextResponse.json({
      absence: await enrichAbsenceValidations(
        serializeAbsenceRequestForViewer(
          absence,
          {
            id: session.user.id,
            role,
          },
          actingForDelegatorIds,
        ),
      ),
    });
  } catch (error) {
    console.error("GET /api/absences/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 },
    );
  }
}
