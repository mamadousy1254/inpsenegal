import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import { ensureLeaveBalanceForUser } from "@/lib/services/leave/init-leave-balance";
import { getLeaveBalanceSummary } from "@/lib/services/leave/leave-balance-service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    await ensureLeaveBalanceForUser(session.user.id);
    const balance = await getLeaveBalanceSummary(session.user.id);
    return NextResponse.json({ balance });
  } catch (error) {
    console.error("GET /api/leave-balance/me", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du solde" },
      { status: 500 },
    );
  }
}
