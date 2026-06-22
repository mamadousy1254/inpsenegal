import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { hashPassword } from "@/lib/auth/password";
import { ACTION_LABELS, ACTIONS } from "@/lib/constants/action-types";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import { canManageUsers } from "@/lib/permissions/can";
import type { ContractType, UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";
import { initLeaveBalanceForUser } from "@/lib/services/leave/init-leave-balance";
import { prepareUserContractFields } from "@/lib/services/users/prepare-contract-fields";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await connectDB();

    const users = await UserModel.find()
      .select("-password")
      .sort({ lastname: 1, firstname: 1 })
      .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET /api/users", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const {
      email,
      password,
      firstname,
      lastname,
      section,
      occupation,
      role = "employe",
      phone,
      username,
      ...rest
    } = body;

    if (!email || !password || !firstname || !lastname || !section || !occupation) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet e-mail existe déjà" },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const contractFields = prepareUserContractFields({
      contractType: rest.contractType as ContractType | undefined,
      hireDate: rest.hireDate,
      contractYear: rest.contractYear,
      endDate: rest.endDate,
    });

    const user = await UserModel.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      section,
      occupation: occupation.trim(),
      role,
      phone: phone?.trim(),
      username: username?.trim() || undefined,
      createdBy: session.user.id,
      ...rest,
      ...contractFields,
    });

    if (
      contractFields.contractType &&
      contractFields.hireDate &&
      contractFields.contractYear
    ) {
      try {
        await initLeaveBalanceForUser({
          userId: user._id.toString(),
          contractType: contractFields.contractType,
          hireDate: contractFields.hireDate,
          contractYear: contractFields.contractYear,
        });
      } catch (leaveError) {
        console.error("Init solde congés:", leaveError);
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
        action: ACTIONS.USER_CREATE,
        actionType: "create",
        resource: "User",
        resourceId: user._id.toString(),
        description: ACTION_LABELS[ACTIONS.USER_CREATE],
        metadata: {
          targetEmail: user.email,
          targetFullname: `${user.firstname} ${user.lastname}`,
          targetRole: user.role,
          targetSection: user.section,
        },
      });
    } catch (auditError) {
      console.error("Erreur journal activité (user.create):", auditError);
    }

    const safeUser = await UserModel.findById(user._id).select("-password").lean();

    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 },
    );
  }
}
