import { AppSidebar } from "@/components/app-sidebar";
import { RechercheDashboard } from "@/components/dashboard/recherche-dashboard";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { canManageSiteContent } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Recherche & innovation — INP Intranet",
};

export default async function DashboardRechercheRoutePage() {
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
        <SiteHeader title="Contenu site — Recherche & innovation" />
        <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
          <Suspense fallback={null}>
            <RechercheDashboard />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
