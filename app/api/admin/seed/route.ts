import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";

const DEMO_ACCOUNTS = [
  {
    email: "admin@inp.gouv.sn",
    password: "AdminINP2026!",
    firstname: "Ousmane",
    lastname: "Seck",
    username: "oseck",
    phone: "+221771234567",
    occupation: "Directeur général",
    service: "Direction générale",
    direction: "Direction générale",
    section: "Dakar" as const,
    gender: "homme" as const,
    maritalStatus: "marie" as const,
    role: "super_admin" as const,
  },
  {
    email: "demo@inp.gouv.sn",
    password: "Demo2026!",
    firstname: "Aminata",
    lastname: "Ba",
    username: "aba",
    phone: "+221779876543",
    occupation: "Chercheur en pédologie",
    service: "Laboratoire des sols",
    direction: "Direction de la recherche",
    section: "Thiès" as const,
    gender: "femme" as const,
    maritalStatus: "celibataire" as const,
    role: "employe" as const,
  },
  {
    email: "manager@inp.gouv.sn",
    password: "Manager2026!",
    firstname: "Ibrahima",
    lastname: "Tall",
    username: "itall",
    phone: "+221772382463",
    occupation: "Chef de service",
    service: "Ressources humaines",
    direction: "Direction administrative",
    section: "Dakar" as const,
    gender: "homme" as const,
    maritalStatus: "marie" as const,
    role: "manager" as const,
  },
  {
    email: "rh@inp.gouv.sn",
    password: "Rh2026!",
    firstname: "Fatou",
    lastname: "Sarr",
    username: "fsarr",
    phone: "+221773456789",
    occupation: "Responsable RH",
    service: "Ressources humaines",
    direction: "Direction administrative",
    section: "Dakar" as const,
    gender: "femme" as const,
    maritalStatus: "marie" as const,
    role: "rh" as const,
  },
];

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Non disponible en production" },
      { status: 403 },
    );
  }

  try {
    await connectDB();

    const results: {
      email: string;
      password: string;
      role: string;
      status: "created" | "exists";
    }[] = [];

    for (const account of DEMO_ACCOUNTS) {
      const existing = await UserModel.findOne({ email: account.email });

      if (existing) {
        results.push({
          email: account.email,
          password: account.password,
          role: account.role,
          status: "exists",
        });
        continue;
      }

      const hashedPassword = await hashPassword(account.password);

      await UserModel.create({
        ...account,
        password: hashedPassword,
        isActive: true,
        emailVerified: true,
        mustChangePassword: false,
        nationality: "Sénégalaise",
      });

      results.push({
        email: account.email,
        password: account.password,
        role: account.role,
        status: "created",
      });
    }

    return NextResponse.json({
      message: "Comptes de démonstration prêts",
      accounts: results,
    });
  } catch (error) {
    console.error("POST /api/admin/seed", error);
    return NextResponse.json(
      { error: "Erreur lors de la création des comptes" },
      { status: 500 },
    );
  }
}
