import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import { canViewAllAbsences } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import {
  createValidatorDelegation,
  listDelegationCandidates,
  listDelegationTitularCandidates,
  listDelegationsForUser,
} from "@/lib/services/delegation/delegation-service";
import { notifyDelegateAssignment } from "@/lib/services/delegation/notify-delegation-assigned";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const role = session.user.role as UserRole;
    const canManageForOthers = canViewAllAbsences(role);

    const [lists, candidates, titularCandidates] = await Promise.all([
      listDelegationsForUser(session.user.id),
      listDelegationCandidates(session.user.id),
      canManageForOthers
        ? listDelegationTitularCandidates()
        : Promise.resolve([]),
    ]);

    return NextResponse.json({
      given: lists.given,
      received: lists.received,
      actingForDelegatorIds: lists.actingForDelegatorIds,
      candidates,
      titularCandidates,
      canManageForOthers,
    });
  } catch (error) {
    console.error("GET /api/delegations", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des délégations" },
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
      delegateUserId,
      startAt,
      endAt,
      reason,
      delegatorUserId: bodyDelegatorUserId,
      notifyChannel = "email",
    } = body;

    const resolvedNotifyChannel: "email" | "sms" =
      notifyChannel === "sms" ? "sms" : "email";

    const role = session.user.role as UserRole;
    const delegatorUserId =
      bodyDelegatorUserId && canViewAllAbsences(role)
        ? String(bodyDelegatorUserId)
        : session.user.id;

    if (
      bodyDelegatorUserId &&
      bodyDelegatorUserId !== session.user.id &&
      !canViewAllAbsences(role)
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (!delegateUserId || !startAt || !endAt) {
      return NextResponse.json(
        { error: "Délégué, date de début et date de fin requis" },
        { status: 400 },
      );
    }

    const start = new Date(startAt);
    const end = new Date(endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json({ error: "Dates invalides" }, { status: 400 });
    }

    await connectDB();

    const delegation = await createValidatorDelegation({
      delegatorUserId,
      delegateUserId: String(delegateUserId),
      startAt: start,
      endAt: end,
      reason: reason?.trim(),
      createdById: session.user.id,
    });

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.ABSENCE_DELEGATION_CREATE,
        actionType: "create",
        resource: "ValidatorDelegation",
        resourceId: delegation._id,
        description: ACTION_LABELS[ACTIONS.ABSENCE_DELEGATION_CREATE],
        metadata: {
          delegatorFullname: delegation.delegatorFullname,
          delegateFullname: delegation.delegateFullname,
          startAt: delegation.startAt,
          endAt: delegation.endAt,
          reason: delegation.reason,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (delegation.create):", auditError);
    }

    try {
      const notifyResult = await notifyDelegateAssignment(
        delegation,
        resolvedNotifyChannel,
      );
      if (!notifyResult.success) {
        console.error(
          "Notification délégué (delegation.create):",
          notifyResult.error,
        );
      }
    } catch (notifyError) {
      console.error("Notification délégué (delegation.create):", notifyError);
    }

    return NextResponse.json({ delegation }, { status: 201 });
  } catch (error) {
    console.error("POST /api/delegations", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la création de la délégation",
      },
      { status: 400 },
    );
  }
}
