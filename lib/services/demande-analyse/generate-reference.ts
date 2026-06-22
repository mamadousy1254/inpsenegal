import DemandeAnalyseModel from "@/lib/mongo/models/demande-analyse.model";

export async function generateAnalysisRequestReference(): Promise<string> {
  const year = new Date().getFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));

  const count = await DemandeAnalyseModel.countDocuments({
    createdAt: { $gte: startOfYear },
  });

  return `INP-ANL-${year}-${String(count + 1).padStart(4, "0")}`;
}
