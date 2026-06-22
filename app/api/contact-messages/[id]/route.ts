import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import ContactMessageModel from "@/lib/mongo/models/contact-message.model";
import { CONTACT_MESSAGE_STATUSES } from "@/lib/constants/contact-message";
import { serializeContactMessage } from "@/lib/services/contact/serialize-contact-message";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";

const updateSchema = z.object({
  status: z.enum(CONTACT_MESSAGE_STATUSES).optional(),
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
  const item = await ContactMessageModel.findById(id).lean();
  if (!item) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  return NextResponse.json(serializeContactMessage(item));
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
  const item = await ContactMessageModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  if (parsed.data.status !== undefined) item.status = parsed.data.status;
  if (parsed.data.adminNotes !== undefined) {
    item.adminNotes = parsed.data.adminNotes ?? undefined;
  }

  await item.save();
  return NextResponse.json(serializeContactMessage(item));
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
  const deleted = await ContactMessageModel.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
