import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { isValidSenegalPhone } from "@/lib/constants/phone";
import { canManageUsers } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { sendCredentialsEmail } from "@/lib/services/notifications/send-credentials-email";
import { sendCredentialsSms } from "@/lib/services/notifications/send-credentials-sms";

const bodySchema = z.discriminatedUnion("channel", [
  z.object({
    channel: z.literal("email"),
    email: z.string().email(),
    fullname: z.string().trim().min(1),
    password: z.string().min(1),
    loginUrl: z.string().url(),
  }),
  z.object({
    channel: z.literal("sms"),
    phone: z.string().trim().min(1),
    email: z.string().email(),
    fullname: z.string().trim().min(1),
    password: z.string().min(1),
    loginUrl: z.string().url(),
  }),
]);

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || !canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const parsed = bodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    if (payload.channel === "email") {
      await sendCredentialsEmail({
        email: payload.email,
        fullname: payload.fullname,
        password: payload.password,
        loginUrl: payload.loginUrl,
      });

      return NextResponse.json({ message: "E-mail envoyé avec succès" });
    }

    if (!isValidSenegalPhone(payload.phone)) {
      return NextResponse.json(
        {
          error:
            "Numéro invalide. Il doit commencer par +221 suivi de 9 chiffres (ex. +221778417586).",
        },
        { status: 400 },
      );
    }

    await sendCredentialsSms({
      phone: payload.phone,
      email: payload.email,
      fullname: payload.fullname,
      password: payload.password,
      loginUrl: payload.loginUrl,
    });

    return NextResponse.json({ message: "SMS envoyé avec succès" });
  } catch (error) {
    console.error("POST /api/notifications/send-credentials", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'envoi des identifiants",
      },
      { status: 500 },
    );
  }
}
