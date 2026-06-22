import { getFreshSession } from "@/lib/auth/get-fresh-session";
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
  const session = await getFreshSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AuthSessionProvider session={session}>
      <CurrentUserProvider>
        {children}
        <Toaster richColors position="top-right" />
      </CurrentUserProvider>
    </AuthSessionProvider>
  );
}
