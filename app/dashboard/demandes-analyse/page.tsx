import { AppSidebar } from "@/components/app-sidebar";
import { DemandesAnalysePage } from "@/components/dashboard/demandes-analyse-page";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { canManageLabRequests } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Demandes d'analyse — INP Intranet",
};

export default async function DashboardDemandesAnalyseRoutePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageLabRequests(session.user.role as UserRole)) {
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
        <SiteHeader title="Demandes d'analyse de sol" />
        <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
          <Suspense fallback={null}>
            <DemandesAnalysePage />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
