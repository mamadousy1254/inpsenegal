import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import ContactMessageModel from "@/lib/mongo/models/contact-message.model";
import { CONTACT_MESSAGE_STATUSES } from "@/lib/constants/contact-message";
import { generateContactMessageReference } from "@/lib/services/contact/generate-reference";
import {
  notifyContactMessageAcknowledgment,
  notifyContactMessageSubmitted,
} from "@/lib/services/contact/notify-contact-message";
import { serializeContactMessage } from "@/lib/services/contact/serialize-contact-message";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";

const createSchema = z.object({
  fullName: z.string().trim().min(2, "Le nom est requis"),
  institution: z.string().trim().optional(),
  email: z.string().trim().email("Adresse e-mail invalide"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, "Veuillez choisir un objet"),
  message: z.string().trim().min(10, "Message trop court"),
  website: z.string().max(0).optional(),
});

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (
    status &&
    CONTACT_MESSAGE_STATUSES.includes(status as (typeof CONTACT_MESSAGE_STATUSES)[number])
  ) {
    filter.status = status;
  }

  const items = await ContactMessageModel.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: items.map(serializeContactMessage) });
}

export async function POST(req: Request) {
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  await connectDB();

  const reference = await generateContactMessageReference();
  const data = parsed.data;

  const item = await ContactMessageModel.create({
    reference,
    fullName: data.fullName,
    institution: data.institution,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    status: "nouvelle",
  });

  const serialized = serializeContactMessage(item);

  try {
    await notifyContactMessageSubmitted(serialized);
  } catch (error) {
    console.error("Notification email contact (équipe INP):", error);
  }

  try {
    await notifyContactMessageAcknowledgment(serialized);
  } catch (error) {
    console.error("Accusé de réception email contact:", error);
  }

  return NextResponse.json(
    { success: true, reference, item: serialized },
    { status: 201 },
  );
}
