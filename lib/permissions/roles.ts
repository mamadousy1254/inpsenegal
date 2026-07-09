export const USER_ROLES = [
  "super_admin",
  "admin",
  "directeur",
  "rh",
  "manager",
  "employe",
  "redacteur",
  "chercheur",
  "partenaire",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super administrateur",
  admin: "Administrateur",
  directeur: "Directeur",
  rh: "Ressources humaines",
  manager: "Responsable / Manager",
  employe: "Employé",
  redacteur: "Rédacteur",
  chercheur: "Chercheur",
  partenaire: "Partenaire",
};

export const GENDERS = ["homme", "femme"] as const;
export type Gender = (typeof GENDERS)[number];

export const MARITAL_STATUSES = [
  "celibataire",
  "marie",
  "divorce",
  "veuf",
] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

export const CONTRACT_TYPES = [
  "cdi",
  "cdd",
  "stage",
  "consultant",
  "autre",
] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

export const VALIDATOR_ROLES = ["superieur", "rh"] as const;
export type ValidatorRole = (typeof VALIDATOR_ROLES)[number];

export const VALIDATOR_ROLE_LABELS: Record<ValidatorRole, string> = {
  superieur: "Supérieur hiérarchique",
  rh: "Ressources humaines",
};
