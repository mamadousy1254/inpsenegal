import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { isValidSenegalPhone } from "@/lib/constants/phone";
import { canManageUsers } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { sendMessageEmail } from "@/lib/services/notifications/send-message-email";
import { sendMessageSms } from "@/lib/services/notifications/send-message-sms";

const SMS_MAX_LENGTH = 480;

const bodySchema = z.discriminatedUnion("channel", [
  z.object({
    channel: z.literal("email"),
    email: z.string().email(),
    fullname: z.string().trim().min(1),
    subject: z.string().trim().min(1, "L'objet est requis").max(200),
    message: z.string().trim().min(1, "Le message est requis").max(5000),
  }),
  z.object({
    channel: z.literal("sms"),
    phone: z.string().trim().min(1),
    fullname: z.string().trim().min(1),
    message: z
      .string()
      .trim()
      .min(1, "Le message est requis")
      .max(SMS_MAX_LENGTH, `Le SMS ne peut pas dépasser ${SMS_MAX_LENGTH} caractères`),
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
      const firstError = parsed.error.issues[0]?.message ?? "Données invalides";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const payload = parsed.data;

    if (payload.channel === "email") {
      await sendMessageEmail({
        email: payload.email,
        fullname: payload.fullname,
        subject: payload.subject,
        message: payload.message,
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

    await sendMessageSms({
      phone: payload.phone,
      message: payload.message,
    });

    return NextResponse.json({ message: "SMS envoyé avec succès" });
  } catch (error) {
    console.error("POST /api/notifications/send-message", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'envoi du message",
      },
      { status: 500 },
    );
  }
}
