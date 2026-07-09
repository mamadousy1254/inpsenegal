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
  canSubmitMission,
  type MissionSessionUser,
} from "@/lib/services/mission/mission-access";
import { serializeMission } from "@/lib/services/mission/serialize-mission";
import {
  resetValidationsForResubmit,
} from "@/lib/services/mission/validation-workflow.server";
import { notifyAfterMissionSubmitted } from "@/lib/services/mission/notify-mission-after-change";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
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

    await connectDB();
    const mission = await MissionModel.findById(id);
    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
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

    if (!canSubmitMission(sessionUser, mission)) {
      return NextResponse.json(
        { error: "Cette mission ne peut pas être soumise" },
        { status: 400 },
      );
    }

    mission.validations = resetValidationsForResubmit(mission.validations);
    mission.status = "en_validation";
    mission.updatedById = new mongoose.Types.ObjectId(session.user.id);
    await mission.save();

    await logMissionActivity({
      actor: {
        id: session.user.id,
        email: session.user.email,
        firstname: session.user.firstname,
        lastname: session.user.lastname,
      },
      action: ACTIONS.MISSION_SUBMIT,
      actionType: "validate",
      resourceId: mission._id.toString(),
      metadata: { numero: mission.numero, objet: mission.objet },
    });

    void notifyAfterMissionSubmitted(mission).catch((error) =>
      console.error("notify mission submit", error),
    );

    return NextResponse.json(serializeMission(mission));
  } catch (error) {
    console.error("POST /api/missions/[id]/submit", error);
    return NextResponse.json(
      { error: "Erreur lors de la soumission" },
      { status: 500 },
    );
  }
}
