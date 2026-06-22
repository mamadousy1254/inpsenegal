import type { IAbsenceJustificatif } from "@/lib/mongo/models/absence-request.model";
import type { AbsenceJustificatifEntry } from "@/lib/types/absence";

export function parseAbsenceJustificatifInput(
  input: unknown,
): IAbsenceJustificatif | undefined {
  if (!input || typeof input !== "object") return undefined;

  const record = input as Record<string, unknown>;
  const cloudinaryId = String(record.cloudinaryId ?? "").trim();
  const url = String(record.url ?? "").trim();
  const filename = String(record.filename ?? "").trim();

  if (!cloudinaryId || !url || !filename) return undefined;

  return {
    url,
    cloudinaryId,
    filename,
    format: String(record.format ?? "").trim(),
    resourceType: String(record.resourceType ?? "raw").trim(),
    bytes: Math.max(0, Number(record.bytes ?? 0)),
  };
}

export function serializeAbsenceJustificatif(
  justificatif: IAbsenceJustificatif | undefined,
): AbsenceJustificatifEntry | undefined {
  if (!justificatif?.cloudinaryId) return undefined;

  return {
    url: justificatif.url,
    cloudinaryId: justificatif.cloudinaryId,
    filename: justificatif.filename,
    format: justificatif.format,
    resourceType: justificatif.resourceType,
    bytes: justificatif.bytes,
  };
}
