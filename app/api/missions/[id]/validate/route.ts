import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import MissionModel from "@/lib/mongo/models/mission.model";
import UserModel from "@/lib/mongo/models/user.model";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logMissionActivity } from "@/lib/services/mission/log-mission-activity";
import {
  canAccessMission,
  type MissionSessionUser,
} from "@/lib/services/mission/mission-access";
import { serializeMission } from "@/lib/services/mission/serialize-mission";
import {
  canUserActOnPendingStep,
  resolveStatusAfterValidation,
} from "@/lib/services/mission/validation-workflow";
import { applyValidationDecision } from "@/lib/services/mission/validation-workflow.server";
import { missionValidateSchema } from "@/lib/validations/mission.schema";
import { notifyAfterMissionValidated } from "@/lib/services/mission/notify-mission-after-change";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    const parsed = missionValidateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 },
      );
    }

    const { action, comment } = parsed.data;

    if (action === "reject" && !comment?.trim()) {
      return NextResponse.json(
        { error: "Un commentaire est requis pour un refus" },
        { status: 400 },
      );
    }

    await connectDB();
    const mission = await MissionModel.findById(id);
    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
    }

    if (mission.status !== "en_validation") {
      return NextResponse.json(
        { error: "Cette mission n'est pas en cours de validation" },
        { status: 400 },
      );
    }

    const sessionUser: MissionSessionUser = {
      id: session.user.id,
      role,
    };
    if (role === "manager") {
      const dbUser = await UserModel.findById(session.user.id)
        .select("direction service")
        .lean();
      sessionUser.direction = dbUser?.direction;
      sessionUser.service = dbUser?.service;
    }

    if (!canAccessMission(sessionUser, mission)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { allowed, step } = canUserActOnPendingStep(
      sessionUser,
      mission.validations,
    );

    if (!allowed || !step) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas valider cette étape pour le moment" },
        { status: 403 },
      );
    }

    mission.validations = applyValidationDecision({
      validations: mission.validations,
      step,
      action,
      user: {
        id: session.user.id,
        fullname: `${session.user.firstname} ${session.user.lastname}`.trim(),
      },
      comment: comment?.trim(),
    });

    mission.status = resolveStatusAfterValidation(mission.validations);
    mission.markModified("validations");
    mission.updatedById = new mongoose.Types.ObjectId(session.user.id);
    await mission.save();

    await logMissionActivity({
      actor: {
        id: session.user.id,
        email: session.user.email,
        firstname: session.user.firstname,
        lastname: session.user.lastname,
      },
      action: action === "approve" ? ACTIONS.MISSION_APPROVE : ACTIONS.MISSION_REJECT,
      actionType: action === "approve" ? "validate" : "reject",
      resourceId: mission._id.toString(),
      metadata: {
        numero: mission.numero,
        step,
        status: mission.status,
        ...(comment && { comment }),
      },
    });

    void notifyAfterMissionValidated({
      mission,
      action,
      comment: comment?.trim(),
    }).catch((error) => console.error("notify mission validate", error));

    return NextResponse.json(serializeMission(mission));
  } catch (error) {
    console.error("POST /api/missions/[id]/validate", error);
    return NextResponse.json(
      { error: "Erreur lors de la validation" },
      { status: 500 },
    );
  }
}
