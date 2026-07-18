import { AppSidebar } from "@/components/app-sidebar";
import { AdminGuidePage } from "@/components/dashboard/admin-guide-page";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { canAccessDashboard, canViewAdminGuide } from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Guide administrateur — INP Intranet",
};

export default async function GuideAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role as UserRole;

  if (!canAccessDashboard(role, true)) {
    redirect("/login");
  }

  if (!canViewAdminGuide(role)) {
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
        <SiteHeader title="Guide administrateur" />
        <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
          <AdminGuidePage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
