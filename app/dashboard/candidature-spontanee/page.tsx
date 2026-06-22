import { AppSidebar } from "@/components/app-sidebar";
import { CandidatureSpontaneePage } from "@/components/dashboard/candidature-spontanee-page";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { canManageSiteContent } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Recrutement & candidatures — INP Intranet",
};

export default async function DashboardCandidatureSpontaneeRoutePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageSiteContent(session.user.role as UserRole)) {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Recrutement & candidatures" />
        <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
          <Suspense fallback={null}>
            <CandidatureSpontaneePage />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
