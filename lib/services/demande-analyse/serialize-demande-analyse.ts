import type { IDemandeAnalyse } from "@/lib/mongo/models/demande-analyse.model";

export function serializeDemandeAnalyse(doc: IDemandeAnalyse | Record<string, unknown>) {
  const item = doc as IDemandeAnalyse;
  return {
    _id: item._id.toString(),
    reference: item.reference,
    lastName: item.lastName,
    firstName: item.firstName,
    phone: item.phone,
    email: item.email,
    requesterType: item.requesterType,
    region: item.region,
    department: item.department,
    commune: item.commune,
    latitude: item.latitude,
    longitude: item.longitude,
    surface: item.surface,
    culturePlanned: item.culturePlanned,
    cultureCurrent: item.cultureCurrent,
    fertilisationHistory: item.fertilisationHistory,
    irrigation: item.irrigation,
    problem: item.problem,
    analysisTypes: item.analysisTypes ?? [],
    samplesNumber: item.samplesNumber,
    sendMode: item.sendMode,
    depositDate: item.depositDate,
    status: item.status,
    adminNotes: item.adminNotes,
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  };
}

export type SerializedDemandeAnalyse = ReturnType<typeof serializeDemandeAnalyse>;
