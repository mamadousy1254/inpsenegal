import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import MissionModel from "@/lib/mongo/models/mission.model";
import ConvocationModel from "@/lib/mongo/models/convocation.model";
import { canAccessDashboard, canManageAllMissions } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { applyMissionComputedFields } from "@/lib/services/mission/apply-mission-computed-fields";
import { logMissionActivity } from "@/lib/services/mission/log-mission-activity";
import {
  canAccessMission,
  canDeleteMission,
  canEditMission,
  canTrackMissionTerrain,
  type MissionSessionUser,
} from "@/lib/services/mission/mission-access";
import { resolveMissionSessionUser } from "@/lib/services/mission/resolve-mission-session-user.server";
import {
  resolveChefMissionId,
  resolveMissionParticipants,
} from "@/lib/services/mission/resolve-participants";
import { archiveMissionToGed } from "@/lib/services/mission/archive-mission-to-ged";
import { serializeMission } from "@/lib/services/mission/serialize-mission";
import {
  missionReportSchema,
  missionTerrainSchema,
  updateMissionSchema,
} from "@/lib/validations/mission.schema";

type RouteContext = { params: Promise<{ id: string }> };

async function getSessionUser(session: {
  user: { id: string; role: UserRole };
}): Promise<MissionSessionUser | null> {
  return resolveMissionSessionUser({
    id: session.user.id,
    role: session.user.role,
  });
}

function actorFromSession(user: {
  id: string;
  email?: string | null;
  firstname: string;
  lastname: string;
}) {
  return {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
  };
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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

    const sessionUser = await getSessionUser({
      user: { id: session.user.id, role: session.user.role as UserRole },
    });

    if (!sessionUser || !canAccessMission(sessionUser, mission)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const payload = serializeMission(mission);

    if (mission.convocationId) {
      const convocation = await ConvocationModel.findById(mission.convocationId)
        .select("title meetingAt agenda status")
        .lean();
      if (convocation) {
        payload.convocation = {
          id: convocation._id.toString(),
          title: convocation.title,
          meetingAt: convocation.meetingAt.toISOString(),
          agenda: convocation.agenda,
          status: convocation.status,
        };
      }
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/missions/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la mission" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    const body = await req.json();
    const terrainParsed = missionTerrainSchema.safeParse(body.terrain ?? {});
    const reportParsed = missionReportSchema.safeParse(body.rapport ?? {});
    const updateParsed = updateMissionSchema.safeParse(body);

    await connectDB();
    const mission = await MissionModel.findById(id);
    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
    }

    const sessionUser = await getSessionUser({
      user: { id: session.user.id, role: session.user.role as UserRole },
    });

    if (!sessionUser || !canAccessMission(sessionUser, mission)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    /* --- Suivi terrain --- */
    if (body.terrain && canTrackMissionTerrain(sessionUser, mission)) {
      const terrain = terrainParsed.success ? terrainParsed.data : null;
      const hasTerrainUpdate =
        terrain &&
        (terrain.arriveeDeclaree ||
          (terrain.latitude !== undefined && terrain.longitude !== undefined) ||
          terrain.observation?.trim() ||
          terrain.incidentDescription?.trim() ||
          (terrain.prolongationEndDate && terrain.prolongationJustification?.trim()));

      if (hasTerrainUpdate && terrain) {
        if (terrain.arriveeDeclaree) {
          mission.arriveeDeclaree = true;
          mission.arriveeAt = new Date();
        }
        if (terrain.latitude !== undefined && terrain.longitude !== undefined) {
          mission.positionsGPS.push({
            latitude: terrain.latitude,
            longitude: terrain.longitude,
            label: terrain.positionLabel,
            recordedAt: new Date(),
            recordedById: new mongoose.Types.ObjectId(session.user.id),
          });
        }
        if (terrain.observation?.trim()) {
          mission.observations.push({
            text: terrain.observation.trim(),
            recordedAt: new Date(),
            recordedById: new mongoose.Types.ObjectId(session.user.id),
          });
        }
        if (terrain.incidentDescription?.trim()) {
          mission.incidents.push({
            description: terrain.incidentDescription.trim(),
            severity: terrain.incidentSeverity ?? "faible",
            recordedAt: new Date(),
            recordedById: new mongoose.Types.ObjectId(session.user.id),
          });
        }
        if (terrain.prolongationEndDate && terrain.prolongationJustification?.trim()) {
          mission.demandesProlongation.push({
            requestedEndDate: new Date(terrain.prolongationEndDate),
            justification: terrain.prolongationJustification.trim(),
            status: "en_attente",
            requestedAt: new Date(),
            requestedById: new mongoose.Types.ObjectId(session.user.id),
          });
        }
        mission.updatedById = new mongoose.Types.ObjectId(session.user.id);
        await mission.save();
        return NextResponse.json(serializeMission(mission));
      }
    }

    /* --- Rapport final --- */
    if (body.rapport) {
      if (!reportParsed.success) {
        return NextResponse.json(
          { error: reportParsed.error.issues[0]?.message ?? "Rapport invalide" },
          { status: 400 },
        );
      }
      if (!["en_cours", "terminee"].includes(mission.status)) {
        return NextResponse.json(
          { error: "Le rapport n'est pas disponible pour ce statut" },
          { status: 400 },
        );
      }
      const r = reportParsed.data;
      mission.rapport = {
        resume: r.resume,
        activitesRealisees: r.activitesRealisees,
        personnesRencontrees: r.personnesRencontrees,
        difficultes: r.difficultes,
        resultats: r.resultats,
        recommandations: r.recommandations,
        photosRapport: mission.rapport?.photosRapport ?? [],
        documentsRapport: mission.rapport?.documentsRapport ?? [],
        dateDepot: new Date(),
        depositedById: new mongoose.Types.ObjectId(session.user.id),
      };
      if (mission.status === "en_cours") {
        mission.status = "terminee";
        await logMissionActivity({
          actor: actorFromSession(session.user),
          action: ACTIONS.MISSION_COMPLETE,
          actionType: "update",
          resourceId: mission._id.toString(),
          metadata: { numero: mission.numero },
        });
      }
      mission.updatedById = new mongoose.Types.ObjectId(session.user.id);
      applyMissionComputedFields(mission);
      await mission.save();

      if (mission.status === "terminee") {
        void archiveMissionToGed({
          mission,
          actor: actorFromSession(session.user),
        }).catch((error) => console.error("archive mission ged", error));
      }

      return NextResponse.json(serializeMission(mission));
    }

    /* --- Mise à jour standard --- */
    if (!canEditMission(sessionUser, mission)) {
      return NextResponse.json(
        { error: "Cette mission ne peut plus être modifiée" },
        { status: 403 },
      );
    }

    if (!updateParsed.success) {
      return NextResponse.json(
        { error: updateParsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 },
      );
    }

    const data = updateParsed.data;

    if (data.objet !== undefined) mission.objet = data.objet;
    if (data.description !== undefined) mission.description = data.description;
    if (data.type !== undefined) mission.type = data.type;
    if (data.priorite !== undefined) mission.priorite = data.priorite;
    if (data.direction !== undefined) mission.direction = data.direction;
    if (data.projetId !== undefined) mission.projetId = data.projetId;
    if (data.projetLabel !== undefined) mission.projetLabel = data.projetLabel;
    if (data.pays !== undefined) mission.pays = data.pays;
    if (data.region !== undefined) mission.region = data.region;
    if (data.departement !== undefined) mission.departement = data.departement;
    if (data.commune !== undefined) mission.commune = data.commune;
    if (data.village !== undefined) mission.village = data.village;
    if (data.adressePrecise !== undefined) mission.adressePrecise = data.adressePrecise;
    if (data.latitude !== undefined) mission.latitude = data.latitude;
    if (data.longitude !== undefined) mission.longitude = data.longitude;
    if (data.heureDepart !== undefined) mission.heureDepart = data.heureDepart;
    if (data.heureRetour !== undefined) mission.heureRetour = data.heureRetour;
    if (data.dateDepart !== undefined) mission.dateDepart = new Date(data.dateDepart);
    if (data.dateRetour !== undefined) mission.dateRetour = new Date(data.dateRetour);
    if (data.transport !== undefined) mission.transport = { ...mission.transport, ...data.transport };
    if (data.budget !== undefined) {
      mission.budget = { ...mission.budget, ...data.budget };
    }
    if (data.budgetConsomme !== undefined) {
      mission.budget.budgetConsomme = data.budgetConsomme;
    }
    if (data.attachments !== undefined) mission.attachments = data.attachments;

    if (data.chefMissionId && data.missionnaireIds?.length) {
      const chef = await resolveChefMissionId(data.chefMissionId);
      mission.chefMissionId = chef.id;
      mission.missionnaires = await resolveMissionParticipants(
        data.missionnaireIds,
        data.chefMissionId,
      );
      if (!data.direction) mission.direction = chef.direction;
    }

    if (data.status !== undefined) {
      const prevStatus = mission.status;
      if (data.status === "en_cours" && mission.status === "validee") {
        mission.status = "en_cours";
        await logMissionActivity({
          actor: actorFromSession(session.user),
          action: ACTIONS.MISSION_START,
          actionType: "update",
          resourceId: mission._id.toString(),
          metadata: { numero: mission.numero },
        });
      } else if (data.status === "terminee") {
        if (!mission.rapport?.dateDepot && !canManageAllMissions(sessionUser.role)) {
          return NextResponse.json(
            { error: "Le rapport de mission est requis avant clôture" },
            { status: 400 },
          );
        }
        mission.status = "terminee";
        await logMissionActivity({
          actor: actorFromSession(session.user),
          action: ACTIONS.MISSION_COMPLETE,
          actionType: "update",
          resourceId: mission._id.toString(),
          metadata: { numero: mission.numero },
        });
        mission.updatedById = new mongoose.Types.ObjectId(session.user.id);
        applyMissionComputedFields(mission);
        await mission.save();
        void archiveMissionToGed({
          mission,
          actor: actorFromSession(session.user),
        }).catch((error) => console.error("archive mission ged", error));
        return NextResponse.json(serializeMission(mission));
      } else if (data.status === "annulee") {
        mission.status = "annulee";
        await logMissionActivity({
          actor: actorFromSession(session.user),
          action: ACTIONS.MISSION_CANCEL,
          actionType: "update",
          resourceId: mission._id.toString(),
          metadata: { numero: mission.numero },
        });
      } else if (
        canManageAllMissions(sessionUser.role) ||
        ["brouillon", "en_validation"].includes(data.status)
      ) {
        mission.status = data.status;
      } else if (prevStatus !== data.status) {
        return NextResponse.json(
          { error: "Transition de statut non autorisée" },
          { status: 400 },
        );
      }
    }

    mission.updatedById = new mongoose.Types.ObjectId(session.user.id);
    applyMissionComputedFields(mission);
    await mission.save();

    await logMissionActivity({
      actor: actorFromSession(session.user),
      action: ACTIONS.MISSION_UPDATE,
      actionType: "update",
      resourceId: mission._id.toString(),
      metadata: { numero: mission.numero, status: mission.status },
    });

    return NextResponse.json(serializeMission(mission));
  } catch (error) {
    console.error("PATCH /api/missions/[id]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erreur lors de la mise à jour",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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

    const sessionUser = await getSessionUser({
      user: { id: session.user.id, role: session.user.role as UserRole },
    });

    if (!sessionUser || !canDeleteMission(sessionUser, mission)) {
      return NextResponse.json({ error: "Suppression non autorisée" }, { status: 403 });
    }

    const numero = mission.numero;
    await mission.deleteOne();

    await logMissionActivity({
      actor: actorFromSession(session.user),
      action: ACTIONS.MISSION_DELETE,
      actionType: "delete",
      resourceId: id,
      metadata: { numero },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/missions/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}
