import { AppSidebar } from "@/components/app-sidebar";
import { AbsencesPage } from "@/components/dashboard/absences-page";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Absences & congés — INP Intranet",
};

export default async function AbsencesRoutePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canAccessDashboard(session.user.role as UserRole, true)) {
    redirect("/login");
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
        <SiteHeader title="Absences & congés" />
        <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
          <Suspense>
            <AbsencesPage />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
