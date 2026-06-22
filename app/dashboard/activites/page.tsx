import { AppSidebar } from "@/components/app-sidebar";
import { ActivitiesPage } from "@/components/dashboard/activities-page";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { canManageUsers } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Activités — INP Intranet",
  description: "Historique des actions et des connexions sur la plateforme INP",
};

export default async function ActivitesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageUsers(session.user.role as UserRole)) {
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
        <SiteHeader title="Activités" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
              <ActivitiesPage />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
