import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import DemandeAnalyseModel from "@/lib/mongo/models/demande-analyse.model";
import {
  ANALYSIS_REQUESTER_TYPES,
  ANALYSIS_REQUEST_STATUSES,
} from "@/lib/constants/demande-analyse";
import { generateAnalysisRequestReference } from "@/lib/services/demande-analyse/generate-reference";
import { notifyAnalysisRequestSubmitted } from "@/lib/services/demande-analyse/notify-analysis-request";
import { requireLabAdmin } from "@/lib/services/demande-analyse/require-lab-admin";
import { serializeDemandeAnalyse } from "@/lib/services/demande-analyse/serialize-demande-analyse";

const createSchema = z.object({
  lastName: z.string().trim().min(1, "Le nom est requis"),
  firstName: z.string().trim().min(1, "Le prénom est requis"),
  phone: z.string().trim().min(1, "Le téléphone est requis"),
  email: z.string().trim().email("Email invalide"),
  requesterType: z.enum(ANALYSIS_REQUESTER_TYPES),
  region: z.string().trim().min(1, "La région est requise"),
  department: z.string().trim().min(1, "Le département est requis"),
  commune: z.string().trim().min(1, "La commune est requise"),
  latitude: z.string().trim().optional(),
  longitude: z.string().trim().optional(),
  surface: z.string().trim().optional(),
  culturePlanned: z.string().trim().optional(),
  cultureCurrent: z.string().trim().optional(),
  fertilisationHistory: z.string().trim().optional(),
  irrigation: z.string().trim().optional(),
  problem: z.string().trim().optional(),
  analysisTypes: z.array(z.string().trim()).min(1, "Sélectionnez au moins un type d'analyse"),
  samplesNumber: z.string().trim().optional(),
  sendMode: z.string().trim().optional(),
  depositDate: z.string().trim().optional(),
});

export async function GET(req: Request) {
  const authResult = await requireLabAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (
    status &&
    ANALYSIS_REQUEST_STATUSES.includes(status as (typeof ANALYSIS_REQUEST_STATUSES)[number])
  ) {
    filter.status = status;
  }

  const items = await DemandeAnalyseModel.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ items: items.map(serializeDemandeAnalyse) });
}

export async function POST(req: Request) {
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 },
    );
  }

  await connectDB();

  const reference = await generateAnalysisRequestReference();
  const data = parsed.data;

  const item = await DemandeAnalyseModel.create({
    reference,
    ...data,
    status: "nouvelle",
  });

  const serialized = serializeDemandeAnalyse(item);

  try {
    await notifyAnalysisRequestSubmitted(serialized);
  } catch (error) {
    console.error("Notification email demande analyse:", error);
  }

  return NextResponse.json({ item: serialized }, { status: 201 });
}
