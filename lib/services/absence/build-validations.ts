import mongoose from "mongoose";
import { connectDB } from "@/lib/mongo/db";
import type { IAbsenceValidation } from "@/lib/mongo/models/absence-request.model";
import UserModel from "@/lib/mongo/models/user.model";

export async function buildValidationsForUser(
  userId: string,
): Promise<IAbsenceValidation[]> {
  await connectDB();

  const user = await UserModel.findById(userId)
    .select("validators")
    .populate({
      path: "validators.userId",
      select: "firstname lastname email phone isActive",
    })
    .lean();

  if (!user?.validators?.length) return [];

  const sorted = [...user.validators].sort((a, b) => a.level - b.level);
  const validations: IAbsenceValidation[] = [];

  for (const assignment of sorted) {
    const validator = assignment.userId as {
      _id: mongoose.Types.ObjectId;
      firstname?: string;
      lastname?: string;
      email?: string;
      phone?: string;
      isActive?: boolean;
    } | null;

    if (!validator || !validator.isActive) continue;

    validations.push({
      validatorUserId: validator._id,
      level: assignment.level,
      role: assignment.role,
      email: validator.email ?? "",
      fullname: `${validator.firstname ?? ""} ${validator.lastname ?? ""}`.trim(),
      phone: validator.phone,
      isValidated: false,
      isRejected: false,
    });
  }

  return validations;
}
