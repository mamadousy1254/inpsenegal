import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import DemandeAnalyseModel from "@/lib/mongo/models/demande-analyse.model";
import { ANALYSIS_REQUEST_STATUSES } from "@/lib/constants/demande-analyse";
import { requireLabAdmin } from "@/lib/services/demande-analyse/require-lab-admin";
import { serializeDemandeAnalyse } from "@/lib/services/demande-analyse/serialize-demande-analyse";

const updateSchema = z.object({
  status: z.enum(ANALYSIS_REQUEST_STATUSES).optional(),
  adminNotes: z.string().trim().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const authResult = await requireLabAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  await connectDB();

  const item = await DemandeAnalyseModel.findById(id).lean();
  if (!item) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }

  return NextResponse.json({ item: serializeDemandeAnalyse(item) });
}

export async function PATCH(req: Request, context: RouteContext) {
  const authResult = await requireLabAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  await connectDB();

  const item = await DemandeAnalyseModel.findByIdAndUpdate(
    id,
    { $set: parsed.data },
    { new: true },
  ).lean();

  if (!item) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }

  return NextResponse.json({ item: serializeDemandeAnalyse(item) });
}
