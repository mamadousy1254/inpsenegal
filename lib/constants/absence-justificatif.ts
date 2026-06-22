export const ABSENCE_JUSTIFICATIF_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export type AbsenceJustificatifMimeType =
  (typeof ABSENCE_JUSTIFICATIF_MIME_TYPES)[number];

export const ABSENCE_JUSTIFICATIF_MAX_BYTES = 10 * 1024 * 1024;

export const ABSENCE_JUSTIFICATIF_CLOUDINARY_FOLDER =
  "inp-intranet/absences/justificatifs";

export const ABSENCE_JUSTIFICATIF_ACCEPT = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
} as const;
