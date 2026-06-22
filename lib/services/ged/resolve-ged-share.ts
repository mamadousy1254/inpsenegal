import GedFileModel from "@/lib/mongo/models/ged-file.model";
import GedShareModel from "@/lib/mongo/models/ged-share.model";
import UserModel from "@/lib/mongo/models/user.model";

export type GedShareResolveError =
  | "not_found"
  | "expired"
  | "unsupported"
  | "file_missing";

export type ResolvedGedShare = {
  share: {
    _id: string;
    accessToken: string;
    expiresAt: string | null;
    recipientName?: string;
  };
  file: {
    _id: string;
    name: string;
    size: number;
    mimeType: string;
    format: string;
    resourceType: string;
    cloudinaryId: string;
  };
  sharerName: string;
};

export function isGedShareExpired(expiresAt?: Date | null): boolean {
  return !!expiresAt && expiresAt.getTime() <= Date.now();
}

export async function resolveGedShareByToken(
  accessToken: string,
): Promise<
  { ok: true; data: ResolvedGedShare } | { ok: false; error: GedShareResolveError }
> {
  const share = await GedShareModel.findOne({ accessToken }).lean();
  if (!share) {
    return { ok: false, error: "not_found" };
  }

  if (isGedShareExpired(share.expiresAt)) {
    return { ok: false, error: "expired" };
  }

  if (share.itemType !== "file") {
    return { ok: false, error: "unsupported" };
  }

  const file = await GedFileModel.findById(share.itemId)
    .select("name size mimeType format resourceType cloudinaryId")
    .lean();

  if (!file) {
    return { ok: false, error: "file_missing" };
  }

  const sharer = await UserModel.findById(share.sharedBy)
    .select("firstname lastname email")
    .lean();

  const fullName = sharer
    ? `${sharer.firstname ?? ""} ${sharer.lastname ?? ""}`.trim()
    : "";
  const sharerName = fullName || sharer?.email || "Un collaborateur INP";

  return {
    ok: true,
    data: {
      share: {
        _id: share._id.toString(),
        accessToken: share.accessToken,
        expiresAt: share.expiresAt?.toISOString() ?? null,
        recipientName: share.recipientName,
      },
      file: {
        _id: file._id.toString(),
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        format: file.format,
        resourceType: file.resourceType,
        cloudinaryId: file.cloudinaryId,
      },
      sharerName,
    },
  };
}