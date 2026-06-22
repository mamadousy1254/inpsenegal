import { AppSidebar } from "@/components/app-sidebar";
import { MySpacePage } from "@/components/dashboard/my-space-page";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { canAccessDashboard } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mon espace — INP Intranet",
};

export default async function MonEspaceRoutePage() {
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
        <SiteHeader title="Mon espace" />
        <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
          <MySpacePage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
