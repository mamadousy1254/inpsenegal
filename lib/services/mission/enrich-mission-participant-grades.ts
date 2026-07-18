import mongoose from "mongoose";
import UserModel from "@/lib/mongo/models/user.model";
import { connectDB } from "@/lib/mongo/db";
import type { SerializedMissionParticipant } from "@/lib/services/mission/serialize-mission";

/** Complète le grade des missionnaires depuis les fiches utilisateur. */
export async function enrichMissionParticipantGrades(
  missionnaires: SerializedMissionParticipant[],
): Promise<SerializedMissionParticipant[]> {
  const missingGradeIds = missionnaires
    .filter((m) => !m.grade?.trim())
    .map((m) => m.userId)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (missingGradeIds.length === 0) {
    return missionnaires;
  }

  await connectDB();
  const users = await UserModel.find({
    _id: { $in: missingGradeIds.map((id) => new mongoose.Types.ObjectId(id)) },
  })
    .select("grade")
    .lean();

  const gradeById = new Map(
    users.map((u) => [u._id.toString(), (u.grade as string | undefined) ?? ""]),
  );

  return missionnaires.map((m) => {
    if (m.grade?.trim()) return m;
    const grade = gradeById.get(m.userId)?.trim();
    return grade ? { ...m, grade } : m;
  });
}
