import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth/auth";
import { ACTIONS } from "@/lib/constants/action-types";
import {
  MISSION_STATUSES,
  MISSION_TYPES,
} from "@/lib/constants/mission";
import { connectDB } from "@/lib/mongo/db";
import MissionModel from "@/lib/mongo/models/mission.model";
import { canAccessDashboard, canCreateMission } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { applyMissionComputedFields } from "@/lib/services/mission/apply-mission-computed-fields";
import { generateMissionNumber } from "@/lib/services/mission/generate-mission-number";
import { logMissionActivity } from "@/lib/services/mission/log-mission-activity";
import { buildMissionListFilter } from "@/lib/services/mission/mission-list-filter.server";
import { resolveMissionSessionUser } from "@/lib/services/mission/resolve-mission-session-user.server";
import { canValidateMissionOnCreate } from "@/lib/services/mission/mission-access";
import {
  resolveChefMissionId,
  resolveMissionParticipants,
} from "@/lib/services/mission/resolve-participants";
import { serializeMission } from "@/lib/services/mission/serialize-mission";
import { normalizeMissionTransport } from "@/lib/services/mission/normalize-transport";
import {
  buildInitialValidations,
} from "@/lib/services/mission/validation-workflow";
import { markAllValidationsApproved } from "@/lib/services/mission/validation-workflow.server";
import { notifyAfterMissionSubmitted, notifyAfterMissionFullyValidated } from "@/lib/services/mission/notify-mission-after-change";
import { applyConvocationLinks } from "@/lib/services/mission/convocation-integration";
import { createMissionSchema } from "@/lib/validations/mission.schema";

function parseMissionDate(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Date invalide");
  }
  return date;
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

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 15)));
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const type = searchParams.get("type")?.trim() ?? "";
    const region = searchParams.get("region")?.trim() ?? "";
    const directionFilter = searchParams.get("direction")?.trim() ?? "";
    const chefMissionId = searchParams.get("chefMissionId")?.trim() ?? "";
    const dateFrom = searchParams.get("dateFrom")?.trim() ?? "";
    const dateTo = searchParams.get("dateTo")?.trim() ?? "";
    const scope = (searchParams.get("scope") ?? "mine") as "all" | "mine";

    await connectDB();

    const sessionUser = await resolveMissionSessionUser({
      id: session.user.id,
      role: session.user.role as UserRole,
    });

    if (!sessionUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const accessFilter = buildMissionListFilter(sessionUser, scope);

    const filter: Record<string, unknown> = { ...accessFilter };

    if (status && MISSION_STATUSES.includes(status as (typeof MISSION_STATUSES)[number])) {
      filter.status = status;
    }

    if (type && MISSION_TYPES.includes(type as (typeof MISSION_TYPES)[number])) {
      filter.type = type;
    }

    if (region) {
      filter.region = new RegExp(region.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }

    if (directionFilter) {
      filter.direction = new RegExp(
        directionFilter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
    }

    if (chefMissionId && mongoose.Types.ObjectId.isValid(chefMissionId)) {
      filter.chefMissionId = new mongoose.Types.ObjectId(chefMissionId);
    }

    if (dateFrom || dateTo) {
      filter.dateDepart = {};
      if (dateFrom) {
        (filter.dateDepart as Record<string, Date>).$gte = parseMissionDate(dateFrom);
      }
      if (dateTo) {
        (filter.dateDepart as Record<string, Date>).$lte = parseMissionDate(dateTo);
      }
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$and = [
        ...(Array.isArray(filter.$and) ? filter.$and : []),
        {
          $or: [
            { numero: regex },
            { objet: regex },
            { region: regex },
            { departement: regex },
            { commune: regex },
            { "missionnaires.fullname": regex },
          ],
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      MissionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      MissionModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      items: items.map((item) => serializeMission(item)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("GET /api/missions", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des missions" },
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

    const role = session.user.role as UserRole;
    if (!canAccessDashboard(role, true)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await connectDB();

    const sessionUser = await resolveMissionSessionUser({
      id: session.user.id,
      role,
    });

    if (!sessionUser || !canCreateMission(sessionUser.role)) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à créer une mission" },
        { status: 403 },
      );
    }

    const parsed = createMissionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const dateDepart = parseMissionDate(data.dateDepart);
    const dateRetour = parseMissionDate(data.dateRetour);

    if (dateRetour < dateDepart) {
      return NextResponse.json(
        { error: "La date de retour doit être postérieure au départ" },
        { status: 400 },
      );
    }

    const chef = await resolveChefMissionId(data.chefMissionId);
    const missionnaires = await resolveMissionParticipants(
      data.missionnaireIds,
      data.chefMissionId,
    );

    const numero = await generateMissionNumber();
    let validations = buildInitialValidations();
    let status: (typeof MISSION_STATUSES)[number] = "brouillon";
    const actorFullname = `${session.user.firstname} ${session.user.lastname}`.trim();

    if (data.validateOnCreate) {
      if (!canValidateMissionOnCreate(role)) {
        return NextResponse.json(
          { error: "Vous n'êtes pas autorisé à valider une mission à la création" },
          { status: 403 },
        );
      }
      validations = markAllValidationsApproved(validations, {
        id: session.user.id,
        fullname: actorFullname,
      });
      status = "validee";
    } else if (data.submitForValidation) {
      status = "en_validation";
    }

    const mission = await MissionModel.create({
      numero,
      objet: data.objet,
      description: data.description,
      type: data.type,
      priorite: data.priorite ?? "normale",
      direction: data.direction ?? chef.direction,
      projetId: data.projetId,
      projetLabel: data.projetLabel,
      pays: data.pays,
      region: data.region,
      departement: data.departement,
      commune: data.commune,
      village: data.village,
      adressePrecise: data.adressePrecise,
      latitude: data.latitude,
      longitude: data.longitude,
      dateDepart,
      heureDepart: data.heureDepart,
      dateRetour,
      heureRetour: data.heureRetour,
      chefMissionId: chef.id,
      missionnaires,
      transport: normalizeMissionTransport(data.transport),
      budget: data.budget ?? {},
      attachments: data.attachments ?? [],
      status,
      validations,
      convocationId:
        data.convocationId && mongoose.Types.ObjectId.isValid(data.convocationId)
          ? new mongoose.Types.ObjectId(data.convocationId)
          : undefined,
      createdById: session.user.id,
    });

    applyMissionComputedFields(mission);
    await mission.save();

    if (mission.convocationId) {
      try {
        await applyConvocationLinks(mission._id, mission.convocationId);
      } catch (error) {
        console.error("apply convocation links", error);
      }
    }

    await logMissionActivity({
      actor: actorFromSession(session.user),
      action: data.validateOnCreate
        ? ACTIONS.MISSION_APPROVE
        : data.submitForValidation
          ? ACTIONS.MISSION_SUBMIT
          : ACTIONS.MISSION_CREATE,
      actionType: data.validateOnCreate || data.submitForValidation ? "validate" : "create",
      resourceId: mission._id.toString(),
      metadata: {
        numero: mission.numero,
        objet: mission.objet,
        status: mission.status,
        ...(data.validateOnCreate && { validateOnCreate: true }),
      },
    });

    if (data.submitForValidation) {
      void notifyAfterMissionSubmitted(mission).catch((error) =>
        console.error("notify mission create+submit", error),
      );
    }

    if (data.validateOnCreate) {
      void notifyAfterMissionFullyValidated(mission).catch((error) =>
        console.error("notify mission validated on create", error),
      );
    }

    return NextResponse.json(serializeMission(mission), { status: 201 });
  } catch (error) {
    console.error("POST /api/missions", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erreur lors de la création de la mission",
      },
      { status: 500 },
    );
  }
}
