import type { UserRole } from "@/lib/permissions/roles";

const MANAGEMENT_ROLES: UserRole[] = ["super_admin", "admin", "rh"];

export function canManageUsers(role: UserRole): boolean {
  return MANAGEMENT_ROLES.includes(role);
}

export function canAssignValidators(role: UserRole): boolean {
  return MANAGEMENT_ROLES.includes(role);
}

export function canAccessDashboard(role: UserRole, isActive: boolean): boolean {
  if (!isActive) return false;
  return role !== "partenaire";
}

export function isAdminRole(role: UserRole): boolean {
  return role === "super_admin" || role === "admin";
}

const SITE_CONTENT_ROLES: UserRole[] = ["super_admin", "admin", "rh"];

export function canManageSiteContent(role: UserRole): boolean {
  return SITE_CONTENT_ROLES.includes(role);
}

const ABSENCE_ADMIN_ROLES: UserRole[] = ["super_admin", "admin", "rh"];

export function canViewAllAbsences(role: UserRole): boolean {
  return ABSENCE_ADMIN_ROLES.includes(role);
}

export function canManageLeaveSettings(role: UserRole): boolean {
  return ABSENCE_ADMIN_ROLES.includes(role);
}

export function canBypassAbsenceValidation(role: UserRole): boolean {
  return ABSENCE_ADMIN_ROLES.includes(role);
}

const GED_ADMIN_ROLES: UserRole[] = ["super_admin", "admin", "rh"];

export function canManageGed(role: UserRole): boolean {
  return GED_ADMIN_ROLES.includes(role);
}

export function canAccessGed(_role: UserRole): boolean {
  return true;
}

const CONVOCATION_ADMIN_ROLES: UserRole[] = ["super_admin", "admin", "rh"];

export function canManageConvocations(role: UserRole): boolean {
  return CONVOCATION_ADMIN_ROLES.includes(role);
}

export function canViewAllConvocations(role: UserRole): boolean {
  return CONVOCATION_ADMIN_ROLES.includes(role);
}

export function canManageLabRequests(role: UserRole): boolean {
  return MANAGEMENT_ROLES.includes(role);
}
