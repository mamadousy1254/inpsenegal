import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const user = await UserModel.findById(session.user.id)
      .select("firstname lastname email phone occupation section role")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        occupation: user.occupation,
        section: user.section,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GET /api/users/me", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
