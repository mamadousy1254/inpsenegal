import { headers } from "next/headers";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth/auth.config";
import { verifyPassword } from "@/lib/auth/password";
import { connectDB } from "@/lib/mongo/db";
import LoginHistoryModel from "@/lib/mongo/models/login-history.model";
import UserModel from "@/lib/mongo/models/user.model";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { logActivity } from "@/lib/services/audit/log-activity";

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

async function logLoginAttempt({
  email,
  userId,
  success,
  failureReason,
}: {
  email: string;
  userId?: string;
  success: boolean;
  failureReason?: string;
}) {
  const { ip, userAgent } = await getRequestMeta();

  await LoginHistoryModel.create({
    email,
    userId,
    success,
    failureReason,
    ip,
    userAgent,
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  events: {
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      const actor = token as {
        id?: string;
        email?: string;
        firstname?: string;
        lastname?: string;
      } | null;
      if (!actor?.id) return;

      try {
        await connectDB();
        await logActivity({
          actor: {
            id: actor.id,
            email: actor.email ?? "",
            firstname: actor.firstname ?? "",
            lastname: actor.lastname ?? "",
          },
          action: "auth.logout",
          actionType: "logout",
          resource: "Session",
          resourceId: actor.id,
          description: "Déconnexion du tableau de bord",
        });
      } catch (error) {
        console.error("Journal déconnexion:", error);
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Ne pas requêter Mongo ici : ce callback tourne aussi via proxy.ts
      // à chaque navigation et provoquait une boucle login ↔ dashboard
      // (réécriture concurrente du cookie de session).
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.role = user.role;
        token.section = user.section;
        token.occupation = user.occupation;
        token.avatar = user.avatar;
      }

      return token;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();

        if (!email || !password) {
          return null;
        }

        await connectDB();

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
          await logLoginAttempt({
            email,
            success: false,
            failureReason: "user_not_found",
          });
          return null;
        }

        if (!user.isActive) {
          await logLoginAttempt({
            email,
            userId: user._id.toString(),
            success: false,
            failureReason: "account_disabled",
          });
          return null;
        }

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
          await logLoginAttempt({
            email,
            userId: user._id.toString(),
            success: false,
            failureReason: "invalid_password",
          });
          return null;
        }

        if (!canAccessDashboard(user.role as UserRole, user.isActive)) {
          await logLoginAttempt({
            email,
            userId: user._id.toString(),
            success: false,
            failureReason: "access_denied",
          });
          return null;
        }

        user.lastLoginAt = new Date();
        await user.save();

        await logLoginAttempt({
          email,
          userId: user._id.toString(),
          success: true,
        });

        return {
          id: user._id.toString(),
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          section: user.section,
          occupation: user.occupation,
          avatar: user.avatar,
        };
      },
    }),
  ],
});
