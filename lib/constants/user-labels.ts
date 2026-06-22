import {
  CONTRACT_TYPES,
  GENDERS,
  MARITAL_STATUSES,
} from "@/lib/permissions/roles";

export const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  homme: "Homme",
  femme: "Femme",
};

export const MARITAL_LABELS: Record<(typeof MARITAL_STATUSES)[number], string> =
  {
    celibataire: "Célibataire",
    marie: "Marié(e)",
    divorce: "Divorcé(e)",
    veuf: "Veuf(ve)",
  };

export const CONTRACT_LABELS: Record<(typeof CONTRACT_TYPES)[number], string> =
  {
    cdi: "CDI",
    cdd: "CDD",
    stage: "Stage",
    consultant: "Consultant",
    autre: "Autre",
  };
