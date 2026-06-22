import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import CandidatureModel from "@/lib/mongo/models/candidature.model";
import { CANDIDATURE_STATUSES } from "@/lib/constants/candidature";
import { serializeCandidature } from "@/lib/services/candidature/serialize-candidature";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { deleteCmsAsset } from "@/lib/services/cms/cloudinary-cms-upload";

const updateSchema = z.object({
  status: z.enum(CANDIDATURE_STATUSES).optional(),
  adminNotes: z.string().trim().nullable().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();
  const item = await CandidatureModel.findById(id).lean();
  if (!item) {
    return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
  }

  return NextResponse.json(serializeCandidature(item));
}

export async function PATCH(req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 },
    );
  }

  await connectDB();
  const item = await CandidatureModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
  }

  if (parsed.data.status !== undefined) item.status = parsed.data.status;
  if (parsed.data.adminNotes !== undefined) {
    item.adminNotes = parsed.data.adminNotes ?? undefined;
  }

  await item.save();
  return NextResponse.json(serializeCandidature(item));
}

export async function DELETE(_req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();
  const item = await CandidatureModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
  }

  for (const publicId of [item.cvPublicId, item.lettreMotivationPublicId]) {
    if (!publicId) continue;
    try {
      await deleteCmsAsset({ publicId, resourceType: "raw" });
    } catch {
      /* ignore cleanup errors */
    }
  }

  await item.deleteOne();
  return NextResponse.json({ ok: true });
}
