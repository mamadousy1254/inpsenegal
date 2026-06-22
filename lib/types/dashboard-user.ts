import type { UserRole } from "@/lib/permissions/roles";

export type DashboardUser = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  section: string;
  role: UserRole;
  occupation: string;
  service?: string;
  isActive: boolean;
};
