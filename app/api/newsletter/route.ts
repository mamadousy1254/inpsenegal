import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import NewsletterModel from "@/lib/mongo/models/newsletter.model";
import {
  NEWSLETTER_SOURCES,
  NEWSLETTER_STATUSES,
} from "@/lib/constants/newsletter";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { serializeNewsletterSubscriber } from "@/lib/services/newsletter/serialize-newsletter";

const subscribeSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide"),
  source: z.enum(NEWSLETTER_SOURCES).optional(),
  website: z.string().max(0).optional(),
});

async function getRequestMeta() {
  const headerList = await headers();
  return {
    ip:
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerList.get("x-real-ip") ||
      undefined,
    userAgent: headerList.get("user-agent") || undefined,
  };
}

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 15)));
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const year = searchParams.get("year")?.trim() ?? "";

  await connectDB();

  const filter: Record<string, unknown> = {};

  if (status && NEWSLETTER_STATUSES.includes(status as (typeof NEWSLETTER_STATUSES)[number])) {
    filter.status = status;
  }

  if (year && /^\d{4}$/.test(year)) {
    const y = Number(year);
    filter.createdAt = {
      $gte: new Date(`${y}-01-01T00:00:00.000Z`),
      $lt: new Date(`${y + 1}-01-01T00:00:00.000Z`),
    };
  }

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.email = regex;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    NewsletterModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    NewsletterModel.countDocuments(filter),
  ]);

  return NextResponse.json({
    items: items.map((item) => serializeNewsletterSubscriber(item)),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function POST(req: Request) {
  const parsed = subscribeSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true, message: "Inscription enregistrée." });
  }

  const email = parsed.data.email.toLowerCase();
  const source = parsed.data.source ?? "footer";
  const meta = await getRequestMeta();

  await connectDB();

  const existing = await NewsletterModel.findOne({ email });

  if (existing?.status === "actif") {
    return NextResponse.json(
      { error: "Cette adresse e-mail est déjà inscrite à la newsletter." },
      { status: 409 },
    );
  }

  if (existing) {
    existing.status = "actif";
    existing.source = source;
    existing.unsubscribedAt = undefined;
    existing.ip = meta.ip;
    existing.userAgent = meta.userAgent;
    await existing.save();

    return NextResponse.json(
      {
        success: true,
        message: "Votre inscription à la newsletter a été réactivée.",
        item: serializeNewsletterSubscriber(existing),
      },
      { status: 200 },
    );
  }

  const subscriber = await NewsletterModel.create({
    email,
    status: "actif",
    source,
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  return NextResponse.json(
    {
      success: true,
      message: "Merci ! Vous êtes inscrit à la newsletter de l'INP.",
      item: serializeNewsletterSubscriber(subscriber),
    },
    { status: 201 },
  );
}
