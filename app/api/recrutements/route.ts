import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo/db";
import { getPublishedRecrutements } from "@/lib/services/recrutement/get-published-recrutements";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getPublishedRecrutements();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
