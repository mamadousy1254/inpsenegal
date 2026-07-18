import { resolveFreshSession } from "@/lib/auth/get-fresh-session";
import { signOut } from "@/lib/auth/auth";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { CurrentUserProvider } from "@/components/providers/current-user-provider";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const result = await resolveFreshSession();

  if (result.status === "inactive") {
    await signOut({ redirectTo: "/login" });
  }

  if (result.status !== "ok") {
    redirect("/login");
  }

  return (
    <AuthSessionProvider session={result.session}>
      <CurrentUserProvider>
        {children}
        <Toaster richColors position="top-right" />
      </CurrentUserProvider>
    </AuthSessionProvider>
  );
}
