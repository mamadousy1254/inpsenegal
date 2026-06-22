import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { hashPassword } from "@/lib/auth/password";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { isValidSenegalPhone, normalizeSenegalPhone } from "@/lib/constants/phone";
import { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import { canManageUsers } from "@/lib/permissions/can";
import {
  CONTRACT_TYPES,
  GENDERS,
  MARITAL_STATUSES,
  USER_ROLES,
  type ContractType,
  type UserRole,
} from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import { ensureLeaveBalanceForUser } from "@/lib/services/leave/init-leave-balance";
import { prepareUserContractFields } from "@/lib/services/users/prepare-contract-fields";
import { getMongoUserDuplicateMessage } from "@/lib/services/users/user-duplicate-error";
import type { UserDetail } from "@/lib/types/user-detail";

function serializeUser(user: Record<string, unknown>): UserDetail {
  return {
    _id: String(user._id),
    username: user.username as string | undefined,
    email: user.email as string,
    firstname: user.firstname as string,
    lastname: user.lastname as string,
    avatar: user.avatar as string | undefined,
    phone: user.phone as string | undefined,
    phoneSecondary: user.phoneSecondary as string | undefined,
    address: user.address as string | undefined,
    city: user.city as string | undefined,
    gender: user.gender as UserDetail["gender"],
    maritalStatus: user.maritalStatus as UserDetail["maritalStatus"],
    dateOfBirth: user.dateOfBirth
      ? new Date(user.dateOfBirth as string).toISOString()
      : undefined,
    nationality: user.nationality as string | undefined,
    nationalId: user.nationalId as string | undefined,
    numberOfChildren: user.numberOfChildren as number | undefined,
    matricule: user.matricule as string | undefined,
    occupation: user.occupation as string,
    service: user.service as string | undefined,
    direction: user.direction as string | undefined,
    section: user.section as string,
    contractType: user.contractType as UserDetail["contractType"],
    contractYear: user.contractYear as number | undefined,
    hireDate: user.hireDate
      ? new Date(user.hireDate as string).toISOString()
      : undefined,
    endDate: user.endDate
      ? new Date(user.endDate as string).toISOString()
      : undefined,
    grade: user.grade as string | undefined,
    role: user.role as UserRole,
    validatorNotifyChannel: user.validatorNotifyChannel as
      | UserDetail["validatorNotifyChannel"]
      | undefined,
    isActive: user.isActive as boolean,
    emailVerified: user.emailVerified as boolean,
    mustChangePassword: user.mustChangePassword as boolean,
    lastLoginAt: user.lastLoginAt
      ? new Date(user.lastLoginAt as string).toISOString()
      : undefined,
    notes: user.notes as string | undefined,
    createdAt: user.createdAt
      ? new Date(user.createdAt as string).toISOString()
      : undefined,
    updatedAt: user.updatedAt
      ? new Date(user.updatedAt as string).toISOString()
      : undefined,
  };
}

const patchBodySchema = z.object({
  email: z.string().email(),
  firstname: z.string().trim().min(1),
  lastname: z.string().trim().min(1),
  section: z.enum(SENEGAL_REGIONS),
  role: z.enum(USER_ROLES),
  occupation: z.string().trim().min(1),
  isActive: z.boolean(),
  mustChangePassword: z.boolean().optional(),
  password: z.string().min(8).optional(),
  unset: z.record(z.string(), z.literal(1)).optional(),
  phone: z.string().optional(),
  phoneSecondary: z.string().optional(),
  service: z.string().optional(),
  username: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  nationality: z.string().optional(),
  nationalId: z.string().optional(),
  matricule: z.string().optional(),
  direction: z.string().optional(),
  grade: z.string().optional(),
  notes: z.string().optional(),
  dateOfBirth: z.string().optional(),
  hireDate: z.string().optional(),
  endDate: z.string().optional(),
  gender: z.enum(GENDERS).optional(),
  maritalStatus: z.enum(MARITAL_STATUSES).optional(),
  contractType: z.enum(CONTRACT_TYPES).optional(),
  contractYear: z.number().min(2000).max(2100).optional(),
  validatorNotifyChannel: z.enum(["sms", "email"]).optional(),
  numberOfChildren: z.number().min(0).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const parsed = patchBodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const body = parsed.data;

    if (session.user.id === id && body.isActive === false) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas désactiver votre propre compte" },
        { status: 400 },
      );
    }

    if (body.phone && !isValidSenegalPhone(body.phone)) {
      return NextResponse.json(
        {
          error:
            "Numéro invalide. Il doit commencer par +221 suivi de 9 chiffres.",
        },
        { status: 400 },
      );
    }

    if (body.phoneSecondary && !isValidSenegalPhone(body.phoneSecondary)) {
      return NextResponse.json(
        {
          error:
            "Numéro secondaire invalide. Il doit commencer par +221 suivi de 9 chiffres.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await UserModel.findById(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    const normalizedEmail = body.email.trim().toLowerCase();

    if (normalizedEmail !== existing.email) {
      const emailTaken = await UserModel.findOne({ email: normalizedEmail });
      if (emailTaken) {
        return NextResponse.json(
          { error: "Un utilisateur avec cet e-mail existe déjà" },
          { status: 409 },
        );
      }
    }

    if (body.username) {
      const usernameTaken = await UserModel.findOne({
        username: body.username.trim().toLowerCase(),
        _id: { $ne: id },
      });
      if (usernameTaken) {
        return NextResponse.json(
          { error: "Ce nom d'utilisateur est déjà utilisé" },
          { status: 409 },
        );
      }
    }

    if (body.matricule) {
      const matriculeTaken = await UserModel.findOne({
        matricule: body.matricule.trim(),
        _id: { $ne: id },
      });
      if (matriculeTaken) {
        return NextResponse.json(
          { error: "Ce matricule est déjà utilisé" },
          { status: 409 },
        );
      }
    }

    const {
      unset,
      password,
      phone,
      phoneSecondary,
      dateOfBirth,
      hireDate,
      endDate,
      contractType,
      contractYear,
      ...rest
    } = body;

    const update: Record<string, unknown> = {
      ...rest,
      email: normalizedEmail,
      updatedBy: session.user.id,
    };

    if (phone) update.phone = normalizeSenegalPhone(phone);
    if (phoneSecondary) {
      update.phoneSecondary = normalizeSenegalPhone(phoneSecondary);
    }

    if (dateOfBirth) update.dateOfBirth = new Date(dateOfBirth);

    const contractFieldsTouched =
      contractType !== undefined ||
      hireDate !== undefined ||
      contractYear !== undefined ||
      endDate !== undefined ||
      Boolean(
        unset &&
          ("contractType" in unset ||
            "hireDate" in unset ||
            "contractYear" in unset ||
            "endDate" in unset),
      );

    if (contractFieldsTouched) {
      const existingUser = await UserModel.findById(id)
        .select("contractType hireDate contractYear endDate")
        .lean();

      const clearingContract = Boolean(unset && "contractType" in unset);
      const effectiveContractType =
        contractType ?? existingUser?.contractType;

      if (effectiveContractType && !clearingContract) {
        const prepared = prepareUserContractFields({
          contractType: effectiveContractType as ContractType,
          hireDate: hireDate ?? existingUser?.hireDate?.toISOString(),
          contractYear: contractYear ?? existingUser?.contractYear,
          endDate: endDate ?? existingUser?.endDate?.toISOString(),
        });

        if (
          prepared.contractType &&
          prepared.hireDate &&
          prepared.contractYear
        ) {
          update.contractType = prepared.contractType;
          update.hireDate = prepared.hireDate;
          update.contractYear = prepared.contractYear;
          update.endDate = prepared.endDate;
        }
      }
    }

    if (password) {
      update.password = await hashPassword(password);
      update.mustChangePassword = false;
    }

    const updateQuery: Record<string, unknown> = { $set: update };

    if (unset && Object.keys(unset).length > 0) {
      updateQuery.$unset = unset;
    }

    const user = await UserModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    })
      .select("-password")
      .lean();

    if (contractFieldsTouched && user?.contractType && user.hireDate) {
      try {
        await ensureLeaveBalanceForUser(id);
      } catch (leaveError) {
        console.error("Sync solde congés (user.update):", leaveError);
      }
    }

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
          targetEmail: user?.email,
          targetFullname: user
            ? `${user.firstname} ${user.lastname}`
            : undefined,
          passwordUpdated: Boolean(password),
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (user.update):", auditError);
    }

    return NextResponse.json({ user: serializeUser(user!) });
  } catch (error) {
    console.error("PATCH /api/users/[id]", error);
    const duplicateMessage = getMongoUserDuplicateMessage(error);
    if (duplicateMessage) {
      return NextResponse.json({ error: duplicateMessage }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'utilisateur." },
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

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;

    await connectDB();

    const user = await UserModel.findById(id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
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
        action: ACTIONS.USER_VIEW,
        actionType: "read",
        resource: "User",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.USER_VIEW],
        metadata: {
          targetEmail: user.email,
          targetFullname: `${user.firstname} ${user.lastname}`,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (user.view):", auditError);
    }

    return NextResponse.json({ user: serializeUser(user) });
  } catch (error) {
    console.error("GET /api/users/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;

    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await UserModel.findById(id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    await UserModel.findByIdAndDelete(id);

    try {
      await logActivity({
        actor: {
          id: session.user.id,
          email: session.user.email ?? "",
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
        action: ACTIONS.USER_DELETE,
        actionType: "delete",
        resource: "User",
        resourceId: id,
        description: ACTION_LABELS[ACTIONS.USER_DELETE],
        metadata: {
          targetEmail: user.email,
          targetFullname: `${user.firstname} ${user.lastname}`,
          targetRole: user.role,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (user.delete):", auditError);
    }

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("DELETE /api/users/[id]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 },
    );
  }
}
