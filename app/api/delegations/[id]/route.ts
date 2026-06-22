import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import ValidatorDelegationModel from "@/lib/mongo/models/validator-delegation.model";
import { canViewAllAbsences } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import { revokeValidatorDelegation } from "@/lib/services/delegation/delegation-service";

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

    const delegation = await ValidatorDelegationModel.findById(id).lean();
    if (!delegation) {
      return NextResponse.json(
        { error: "Délégation introuvable" },
        { status: 404 },
      );
    }

    const role = session.user.role as UserRole;
    const isOwner =
      delegation.delegatorUserId.toString() === session.user.id ||
      delegation.createdById.toString() === session.user.id;

    if (!isOwner && !canViewAllAbsences(role)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const revoked = await revokeValidatorDelegation(id);
    if (!revoked) {
      return NextResponse.json(
        { error: "Délégation introuvable ou déjà révoquée" },
        { status: 404 },
      );
    }

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.ABSENCE_DELEGATION_REVOKE,
        actionType: "delete",
        resource: "ValidatorDelegation",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.ABSENCE_DELEGATION_REVOKE],
        metadata: {
          delegatorFullname: delegation.delegatorFullname,
          delegateFullname: delegation.delegateFullname,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (delegation.revoke):", auditError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/delegations/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la révocation" },
      { status: 500 },
    );
  }
}
