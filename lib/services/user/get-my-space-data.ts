import mongoose from "mongoose";

import { connectDB } from "@/lib/mongo/db";
import AbsenceRequestModel from "@/lib/mongo/models/absence-request.model";
import UserModel from "@/lib/mongo/models/user.model";
import type { UserRole } from "@/lib/permissions/roles";
import {
  serializeAbsenceRequest,
  serializeAbsenceRequestForViewer,
} from "@/lib/services/absence/serialize-absence";
import { enrichAbsenceValidations } from "@/lib/services/absence/enrich-validation-delegations";
import { listDelegationsForUser } from "@/lib/services/delegation/delegation-service";
import { ensureLeaveBalanceForUser } from "@/lib/services/leave/init-leave-balance";
import { getLeaveBalanceSummary } from "@/lib/services/leave/leave-balance-service";
import type { MySpaceData } from "@/lib/types/my-space";
import type { ValidatorAssignment } from "@/lib/types/validator-assignment";

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

export async function getMySpaceData(
  userId: string,
  role: UserRole,
): Promise<MySpaceData> {
  await connectDB();

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [user, delegations] = await Promise.all([
    UserModel.findById(userId)
      .select(
        "firstname lastname email phone avatar matricule occupation service direction section role contractType contractYear hireDate grade city lastLoginAt validators",
      )
      .populate({
        path: "validators.userId",
        select: "firstname lastname email occupation role isActive",
      })
      .lean(),
    listDelegationsForUser(userId),
  ]);

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  await ensureLeaveBalanceForUser(userId);
  const leaveBalance = await getLeaveBalanceSummary(userId);

  const validatorObjectIds = [
    userObjectId,
    ...delegations.actingForDelegatorIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    ),
  ];

  const pendingFilter = {
    requesterId: userObjectId,
    statutValidation: { $in: ["en_attente", "en_cours"] },
  };

  const toValidateFilter = {
    "validations.validatorUserId": { $in: validatorObjectIds },
    statutValidation: { $in: ["en_attente", "en_cours"] },
  };

  const [toValidateItems, toValidateCount, myPendingCount, recentAbsences] =
    await Promise.all([
      AbsenceRequestModel.find(toValidateFilter)
        .sort({ dateSoumission: -1 })
        .limit(8)
        .lean(),
      AbsenceRequestModel.countDocuments(toValidateFilter),
      AbsenceRequestModel.countDocuments(pendingFilter),
      AbsenceRequestModel.find({ requesterId: userObjectId })
        .sort({ dateSoumission: -1 })
        .limit(6)
        .lean(),
    ]);

  const viewer = { id: userId, role };

  return {
    profile: {
      _id: String(user._id),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      matricule: user.matricule,
      occupation: user.occupation,
      service: user.service,
      direction: user.direction,
      section: user.section,
      role: user.role as UserRole,
      contractType: user.contractType,
      contractYear: user.contractYear,
      hireDate: user.hireDate
        ? new Date(user.hireDate).toISOString().slice(0, 10)
        : undefined,
      grade: user.grade,
      city: user.city,
      lastLoginAt: user.lastLoginAt
        ? new Date(user.lastLoginAt).toISOString()
        : undefined,
    },
    leaveBalance,
    validators: serializeValidators(user.validators),
    delegations,
    counts: {
      toValidate: toValidateCount,
      myPendingAbsences: myPendingCount,
      activeDelegationsGiven: delegations.given.length,
      activeDelegationsReceived: delegations.received.length,
    },
    toValidate: await Promise.all(
      toValidateItems.map((item) =>
        enrichAbsenceValidations(
          serializeAbsenceRequestForViewer(
            item,
            viewer,
            delegations.actingForDelegatorIds,
          ),
        ),
      ),
    ),
    recentAbsences: recentAbsences.map((item) =>
      serializeAbsenceRequest(item),
    ),
  };
}
