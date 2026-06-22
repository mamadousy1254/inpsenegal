export const GED_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

export const GED_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/plain",
] as const;

export const GED_CLOUDINARY_ROOT = "ged";

export const GED_ITEM_TYPES = ["file", "folder"] as const;
export type GedItemType = (typeof GED_ITEM_TYPES)[number];

export const GED_SHARE_PERMISSIONS = ["read", "write"] as const;
export type GedSharePermission = (typeof GED_SHARE_PERMISSIONS)[number];

export const GED_SHARE_LINK_DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 60, label: "1 heure" },
  { value: 360, label: "6 heures" },
  { value: 1440, label: "24 heures" },
  { value: 10080, label: "7 jours" },
] as const;

export type GedShareLinkDurationMinutes =
  (typeof GED_SHARE_LINK_DURATIONS)[number]["value"];

export const GED_DEFAULT_SHARE_LINK_MINUTES: GedShareLinkDurationMinutes = 15;

/** Durée du lien Cloudinary généré au clic « Télécharger » sur la page publique. */
export const GED_SHARE_DOWNLOAD_LINK_MINUTES = 15;

export function isValidGedShareLinkDuration(
  minutes: number,
): minutes is GedShareLinkDurationMinutes {
  return GED_SHARE_LINK_DURATIONS.some((option) => option.value === minutes);
}

export function formatGedShareDuration(minutes: number): string {
  const option = GED_SHARE_LINK_DURATIONS.find((item) => item.value === minutes);
  if (option) return option.label;
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes < 1440) {
    const hours = Math.round(minutes / 60);
    return hours === 1 ? "1 heure" : `${hours} heures`;
  }
  const days = Math.round(minutes / 1440);
  return days === 1 ? "1 jour" : `${days} jours`;
}
