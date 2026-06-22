import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo/db";
import RecrutementModel from "@/lib/mongo/models/recrutement.model";
import { getPublishedRecrutementBySlug } from "@/lib/services/recrutement/get-published-recrutements";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const item = await getPublishedRecrutementBySlug(slug);
    if (!item) {
      return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function HEAD(_req: Request, context: RouteContext) {
  const { slug } = await context.params;
  await connectDB();
  const exists = await RecrutementModel.exists({
    slug,
    status: "publie",
    offerStatus: "ouvert",
  });
  return new NextResponse(null, { status: exists ? 200 : 404 });
}
