import type { UserRole } from "@/lib/permissions/roles";

/** Même niveau d'accès que admin et super_admin. */
export const DIRECTOR_ADMIN_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
];

const MANAGEMENT_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
];

export function isDirectorOrAdminRole(role: UserRole): boolean {
  return DIRECTOR_ADMIN_ROLES.includes(role);
}

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

const ADMIN_GUIDE_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
  "directeur_technique",
];

/** Accès au guide administrateur. */
export function canViewAdminGuide(role: UserRole): boolean {
  return ADMIN_GUIDE_ROLES.includes(role);
}

export function isAdminRole(role: UserRole): boolean {
  return isDirectorOrAdminRole(role);
}

const SITE_CONTENT_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
];

export function canManageSiteContent(role: UserRole): boolean {
  return SITE_CONTENT_ROLES.includes(role);
}

/** Activer / désactiver le mode maintenance du site public. */
export function canManageMaintenance(role: UserRole): boolean {
  return isDirectorOrAdminRole(role);
}

const ABSENCE_ADMIN_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
];

export function canViewAllAbsences(role: UserRole): boolean {
  return ABSENCE_ADMIN_ROLES.includes(role);
}

export function canManageLeaveSettings(role: UserRole): boolean {
  return ABSENCE_ADMIN_ROLES.includes(role);
}

export function canBypassAbsenceValidation(role: UserRole): boolean {
  return ABSENCE_ADMIN_ROLES.includes(role);
}

const GED_ADMIN_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
];

export function canManageGed(role: UserRole): boolean {
  return GED_ADMIN_ROLES.includes(role);
}

export function canAccessGed(_role: UserRole): boolean {
  return true;
}

const CONVOCATION_ADMIN_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
];

export function canManageConvocations(role: UserRole): boolean {
  return CONVOCATION_ADMIN_ROLES.includes(role);
}

export function canViewAllConvocations(role: UserRole): boolean {
  return CONVOCATION_ADMIN_ROLES.includes(role);
}

export function canManageLabRequests(role: UserRole): boolean {
  return MANAGEMENT_ROLES.includes(role);
}

const MISSION_ADMIN_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
  "pdcvr",
  "aat",
  "directeur_technique",
];

/** Direction générale / RH / PDCVR / AAT / DT : voit toutes les missions. */
export function canViewAllMissions(role: UserRole): boolean {
  return MISSION_ADMIN_ROLES.includes(role);
}

/** Création et gestion globale des missions. */
export function canManageAllMissions(role: UserRole): boolean {
  return MISSION_ADMIN_ROLES.includes(role);
}

/** Génération / téléchargement de l'ordre de mission (accès total missions). */
export function canGenerateOrdreMission(role: UserRole): boolean {
  return canManageAllMissions(role);
}

/** Chef de service : voit les missions de sa direction. */
export function isMissionManagerRole(role: UserRole): boolean {
  return role === "manager";
}

const MISSION_CREATE_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
  "manager",
  "pdcvr",
  "aat",
  "directeur_technique",
];

/** Création d'une nouvelle mission. */
export function canCreateMission(role: UserRole): boolean {
  return MISSION_CREATE_ROLES.includes(role);
}

const MISSION_DELETE_ROLES: UserRole[] = [
  "pdcvr",
  "aat",
  "directeur_technique",
];

/** Suppression de missions (admin / directeur / PDCVR / AAT / DT). */
export function canDeleteAnyMission(role: UserRole): boolean {
  return isDirectorOrAdminRole(role) || MISSION_DELETE_ROLES.includes(role);
}
