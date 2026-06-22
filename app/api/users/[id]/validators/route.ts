import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

import { auth } from "@/lib/auth/auth";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import { canManageUsers } from "@/lib/permissions/can";
import { VALIDATOR_ROLES, type UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import { findActiveDelegationsForDelegators } from "@/lib/services/delegation/delegation-service";
import type { ValidatorAssignment } from "@/lib/types/validator-assignment";

const validatorSchema = z.object({
  userId: z.string().min(1),
  level: z.number().int().min(1),
  role: z.enum(VALIDATOR_ROLES),
});

const bodySchema = z.object({
  validators: z.array(validatorSchema),
});

function serializeValidators(raw: unknown): ValidatorAssignment[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const record = item as Record<string, unknown>;
      const userRef = record.userId as Record<string, unknown> | string | undefined;

      let userId = "";
      let userSummary: ValidatorAssignment["user"];

      if (userRef && typeof userRef === "object" && userRef._id) {
        userId = String(userRef._id);
        userSummary = {
          _id: userId,
          firstname: String(userRef.firstname ?? ""),
          lastname: String(userRef.lastname ?? ""),
          email: String(userRef.email ?? ""),
          occupation: String(userRef.occupation ?? ""),
          role: String(userRef.role ?? ""),
        };
      } else if (typeof userRef === "string") {
        userId = userRef;
      }

      return {
        userId,
        level: Number(record.level),
        role: record.role as ValidatorAssignment["role"],
        user: userSummary,
      };
    })
    .filter((item) => item.userId && item.level >= 1)
    .sort((a, b) => a.level - b.level);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const user = await UserModel.findById(id)
      .select("firstname lastname email validators")
      .populate({
        path: "validators.userId",
        select: "firstname lastname email occupation role isActive",
      })
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    const validators = serializeValidators(user.validators);
    const delegatorIds = validators.map((validator) => validator.userId);
    const activeDelegations =
      await findActiveDelegationsForDelegators(delegatorIds);

    const validatorsWithDelegation = validators.map((validator) => ({
      ...validator,
      activeDelegation: activeDelegations[validator.userId],
    }));

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      validators: validatorsWithDelegation,
      activeDelegations,
    });
  } catch (error) {
    console.error("GET /api/users/[id]/validators", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des validateurs" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const parsed = bodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { validators } = parsed.data;

    const userIds = validators.map((v) => v.userId);
    const uniqueUserIds = new Set(userIds);

    if (uniqueUserIds.size !== userIds.length) {
      return NextResponse.json(
        { error: "Un même validateur ne peut pas être assigné plusieurs fois" },
        { status: 400 },
      );
    }

    if (userIds.includes(id)) {
      return NextResponse.json(
        { error: "Un utilisateur ne peut pas être son propre validateur" },
        { status: 400 },
      );
    }

    const levels = validators.map((v) => v.level);
    if (new Set(levels).size !== levels.length) {
      return NextResponse.json(
        { error: "Chaque niveau de validation doit être unique" },
        { status: 400 },
      );
    }

    for (const validatorId of userIds) {
      if (!mongoose.Types.ObjectId.isValid(validatorId)) {
        return NextResponse.json(
          { error: "Identifiant de validateur invalide" },
          { status: 400 },
        );
      }
    }

    await connectDB();

    const targetUser = await UserModel.findById(id).select(
      "firstname lastname email",
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    if (userIds.length > 0) {
      const validatorUsers = await UserModel.find({
        _id: { $in: userIds },
        isActive: true,
      }).select("_id");

      if (validatorUsers.length !== userIds.length) {
        return NextResponse.json(
          {
            error:
              "Tous les validateurs doivent exister et avoir un compte actif",
          },
          { status: 400 },
        );
      }
    }

    const sortedValidators = [...validators].sort((a, b) => a.level - b.level);

    targetUser.validators = sortedValidators.map((v) => ({
      userId: new mongoose.Types.ObjectId(v.userId),
      level: v.level,
      role: v.role,
    }));
    targetUser.updatedBy = new mongoose.Types.ObjectId(session.user.id);
    await targetUser.save();

    const updated = await UserModel.findById(id)
      .select("validators")
      .populate({
        path: "validators.userId",
        select: "firstname lastname email occupation role isActive",
      })
      .lean();

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.USER_UPDATE,
        actionType: "update",
        resource: "User",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.USER_UPDATE],
        metadata: {
          targetEmail: targetUser.email,
          targetFullname: `${targetUser.firstname} ${targetUser.lastname}`,
          validatorsUpdated: true,
          validatorsCount: sortedValidators.length,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (validators):", auditError);
    }

    return NextResponse.json({
      message: "Validateurs enregistrés avec succès",
      validators: serializeValidators(updated?.validators),
    });
  } catch (error) {
    console.error("PUT /api/users/[id]/validators", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement des validateurs" },
      { status: 500 },
    );
  }
}
