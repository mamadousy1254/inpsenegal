import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import MissionModel, { type IMissionParticipant } from "@/lib/mongo/models/mission.model";
import UserModel from "@/lib/mongo/models/user.model";
import {
  canManageAllMissions,
  canAccessDashboard,
  isMissionManagerRole,
} from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { applyMissionComputedFields } from "@/lib/services/mission/apply-mission-computed-fields";
import { logMissionActivity } from "@/lib/services/mission/log-mission-activity";
import { canAccessMission } from "@/lib/services/mission/mission-access";
import { notifyMissionParticipantsTerrain } from "@/lib/services/mission/notify-mission-workflow";
import { serializeMission } from "@/lib/services/mission/serialize-mission";
import { missionProlongationReviewSchema } from "@/lib/validations/mission.schema";

type RouteContext = { params: Promise<{ id: string; prolongationId: string }> };

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

    const { id, prolongationId } = await context.params;
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(prolongationId)
    ) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    const parsed = missionProlongationReviewSchema.safeParse(await req.json());
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

    if (!canAccessMission({ id: session.user.id, role }, mission)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    let userDirection: string | undefined;
    if (isMissionManagerRole(role)) {
      const dbUser = await UserModel.findById(session.user.id).select("direction").lean();
      userDirection = dbUser?.direction;
    }

    const canReview =
      canManageAllMissions(role) ||
      (isMissionManagerRole(role) &&
        userDirection &&
        mission.direction === userDirection);

    if (!canReview) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas traiter cette prolongation" },
        { status: 403 },
      );
    }

    const prolongation = mission.demandesProlongation.id(prolongationId);
    if (!prolongation) {
      return NextResponse.json(
        { error: "Demande de prolongation introuvable" },
        { status: 404 },
      );
    }

    if (prolongation.status !== "en_attente") {
      return NextResponse.json(
        { error: "Cette demande a déjà été traitée" },
        { status: 400 },
      );
    }

    prolongation.status = action === "approve" ? "approuvee" : "refusee";
    prolongation.reviewedAt = new Date();
    prolongation.reviewedById = new mongoose.Types.ObjectId(session.user.id);
    prolongation.reviewComment = comment?.trim();

    if (action === "approve") {
      mission.dateRetour = prolongation.requestedEndDate;
      applyMissionComputedFields(mission);
    }

    mission.markModified("demandesProlongation");
    mission.updatedById = new mongoose.Types.ObjectId(session.user.id);
    await mission.save();

    await logMissionActivity({
      actor: {
        id: session.user.id,
        email: session.user.email,
        firstname: session.user.firstname,
        lastname: session.user.lastname,
      },
      action: ACTIONS.MISSION_UPDATE,
      actionType: "update",
      resourceId: mission._id.toString(),
      metadata: {
        numero: mission.numero,
        prolongation: action,
      },
    });

    const participantIds = [
      mission.chefMissionId.toString(),
      ...mission.missionnaires.map((m: IMissionParticipant) => m.userId.toString()),
    ];

    void notifyMissionParticipantsTerrain({
      participantIds: [...new Set(participantIds)],
      mission: {
        _id: mission._id.toString(),
        numero: mission.numero,
        objet: mission.objet,
      },
      message:
        action === "approve"
          ? "Votre demande de prolongation a été approuvée."
          : `Votre demande de prolongation a été refusée.${comment ? ` Motif : ${comment}` : ""}`,
    }).catch((error) => console.error("notify prolongation", error));

    return NextResponse.json(serializeMission(mission));
  } catch (error) {
    console.error("POST /api/missions/[id]/prolongation/[prolongationId]", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la prolongation" },
      { status: 500 },
    );
  }
}
