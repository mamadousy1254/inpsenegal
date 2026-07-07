import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import NewsletterModel from "@/lib/mongo/models/newsletter.model";
import { NEWSLETTER_STATUSES } from "@/lib/constants/newsletter";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { serializeNewsletterSubscriber } from "@/lib/services/newsletter/serialize-newsletter";

const updateSchema = z.object({
  status: z.enum(NEWSLETTER_STATUSES).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

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
  const subscriber = await NewsletterModel.findById(id);
  if (!subscriber) {
    return NextResponse.json({ error: "Abonné introuvable" }, { status: 404 });
  }

  if (parsed.data.status !== undefined) {
    subscriber.status = parsed.data.status;
    subscriber.unsubscribedAt =
      parsed.data.status === "desinscrit" ? new Date() : undefined;
  }

  await subscriber.save();
  return NextResponse.json(serializeNewsletterSubscriber(subscriber));
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
  const deleted = await NewsletterModel.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Abonné introuvable" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
