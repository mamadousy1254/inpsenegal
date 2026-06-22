import CandidatureModel from "@/lib/mongo/models/candidature.model";

export async function generateCandidatureReference(): Promise<string> {
  const year = new Date().getFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));

  const count = await CandidatureModel.countDocuments({
    createdAt: { $gte: startOfYear },
  });

  return `INP-CAN-${year}-${String(count + 1).padStart(4, "0")}`;
}
