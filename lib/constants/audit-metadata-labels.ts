import { USER_ROLE_LABELS, type UserRole } from "@/lib/permissions/roles";
import {
  ABSENCE_TYPE_LABELS,
  VALIDATION_STATUS_LABELS,
  type AbsenceType,
  type ValidationStatus,
} from "@/lib/constants/leave";
import { formatGedShareDuration } from "@/lib/constants/ged";
import { CMS_STATUS_LABELS, type CmsStatus } from "@/lib/constants/cms";

const METADATA_LABELS: Record<string, string> = {
  targetEmail: "Personne concernée (e-mail)",
  targetFullname: "Personne concernée",
  targetRole: "Rôle attribué",
  targetSection: "Section / région",
  passwordUpdated: "Mot de passe modifié",
  validatorsUpdated: "Validateurs modifiés",
  validatorsCount: "Nombre de validateurs",
  requesterFullname: "Demandeur",
  requesterEmail: "E-mail du demandeur",
  dateDepart: "Date de départ",
  dateFin: "Date de fin",
  duree: "Durée (jours ouvrés)",
  raison: "Motif",
  absenceType: "Type d'absence",
  adminBypass: "Approbation directe",
  debtDays: "Dette de congés (jours)",
  onBehalfOf: "Déposée pour",
  statutValidation: "Statut",
  comment: "Commentaire",
  fileName: "Fichier",
  folderName: "Dossier",
  previousName: "Ancien nom",
  newName: "Nouveau nom",
  path: "Chemin",
  parentPath: "Dossier parent",
  mimeType: "Type de fichier",
  size: "Taille (octets)",
  expiresInMinutes: "Validité du lien",
  channel: "Canal de partage",
  recipientName: "Destinataire",
  recipientEmail: "E-mail du destinataire",
  recipientPhone: "Téléphone du destinataire",
  recipientMode: "Type de destinataire",
  recipientUserId: "Collaborateur INP",
  delegatorFullname: "Délégant",
  delegateFullname: "Délégué",
  delegatedValidation: "Validation déléguée",
  title: "Titre",
  status: "Statut",
  category: "Catégorie",
};

const RESOURCE_LABELS: Record<string, string> = {
  User: "Utilisateur",
  AbsenceRequest: "Demande d'absence",
  GedFile: "Document GED",
  GedFolder: "Dossier GED",
  ValidatorDelegation: "Délégation de validation",
  Session: "Session",
  // Contenu de site (CMS)
  Actualite: "Actualité",
  Publication: "Publication",
  Video: "Vidéo INP",
  ResearchAxis: "Axe de recherche",
  ResearchProject: "Projet de recherche",
  Partenaire: "Partenaire",
  MediaAsset: "Média (galerie)",
  Documentation: "Ressource documentaire",
  InstitutMembre: "Membre de l'équipe",
  InstitutDelegation: "Délégation (institut)",
  Recrutement: "Offre de recrutement",
  Mission: "Mission",
};

export function getResourceLabel(resource: string): string {
  return RESOURCE_LABELS[resource] ?? resource;
}

export function getMetadataLabel(key: string): string {
  return METADATA_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").trim();
}

export function formatMetadataValue(
  key: string,
  value: unknown,
): string {
  if (value === true) return "Oui";
  if (value === false) return "Non";

  if (key === "targetRole" && typeof value === "string") {
    return USER_ROLE_LABELS[value as UserRole] ?? value;
  }

  if (key === "absenceType" && typeof value === "string") {
    return ABSENCE_TYPE_LABELS[value as AbsenceType] ?? value;
  }

  if (key === "statutValidation" && typeof value === "string") {
    return VALIDATION_STATUS_LABELS[value as ValidationStatus] ?? value;
  }

  if (key === "status" && typeof value === "string") {
    return CMS_STATUS_LABELS[value as CmsStatus] ?? value;
  }

  if (key === "expiresInMinutes" && typeof value === "number") {
    return formatGedShareDuration(value);
  }

  if (key === "channel" && typeof value === "string") {
    return value === "email" ? "E-mail" : value === "sms" ? "SMS" : value;
  }

  if (key === "recipientMode" && typeof value === "string") {
    return value === "user" ? "Collaborateur INP" : "Saisie manuelle";
  }

  if ((key === "dateDepart" || key === "dateFin") && typeof value === "string") {
    const [y, m, d] = value.split("-");
    if (y && m && d) return `${d}/${m}/${y}`;
  }

  return String(value);
}

export type ReadableMetadataItem = {
  key: string;
  label: string;
  value: string;
};

export function toReadableMetadata(
  metadata?: Record<string, unknown>,
): ReadableMetadataItem[] {
  if (!metadata) return [];

  return Object.entries(metadata)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => ({
      key,
      label: getMetadataLabel(key),
      value: formatMetadataValue(key, value),
    }));
}
