import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { MaintenanceModeCard } from "@/components/dashboard/maintenance-mode-card";
import {
  UsersTable,
} from "@/components/dashboard/users-table";
import type { DashboardUser } from "@/lib/types/dashboard-user";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { connectDB } from "@/lib/mongo/db";
import UserModel from "@/lib/mongo/models/user.model";
import { getDashboardStats } from "@/lib/services/dashboard/get-dashboard-stats";
import type { UserRole } from "@/lib/permissions/roles";

export default async function Page() {
  await connectDB();

  const [users, dashboardStats] = await Promise.all([
    UserModel.find()
      .select("-password -notes")
      .sort({ lastname: 1, firstname: 1 })
      .lean(),
    getDashboardStats(),
  ]);

  const dashboardUsers: DashboardUser[] = users.map((user) => ({
    _id: user._id.toString(),
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    section: user.section,
    role: user.role as UserRole,
    occupation: user.occupation,
    service: user.service,
    isActive: user.isActive,
  }));

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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <MaintenanceModeCard />
              <SectionCards stats={dashboardStats.cards} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={dashboardStats.chart} />
              </div>
              <UsersTable data={dashboardUsers} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
