import mongoose from "mongoose";
import type { UserRole } from "@/lib/permissions/roles";
import { canManageGed } from "@/lib/permissions/can";

type GedAccessItem = {
  owner: { _id: { toString(): string } };
  isPublic: boolean;
  sharedWith: { toString(): string }[];
};

export function buildGedAccessFilter(
  userId: string,
  role: UserRole,
): Record<string, unknown> {
  if (canManageGed(role)) {
    return {};
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  return {
    $or: [
      { "owner._id": userObjectId },
      { isPublic: true },
      { sharedWith: userObjectId },
    ],
  };
}

export function canAccessGedItem(
  userId: string,
  role: UserRole,
  item: GedAccessItem,
): boolean {
  if (canManageGed(role)) return true;
  if (item.owner._id.toString() === userId) return true;
  if (item.isPublic) return true;
  return item.sharedWith.some((id) => id.toString() === userId);
}

export function canModifyGedItem(
  userId: string,
  role: UserRole,
  item: GedAccessItem,
): boolean {
  if (canManageGed(role)) return true;
  return item.owner._id.toString() === userId;
}

export function buildFolderPath(parentPath: string | null, name: string): string {
  const slug = name.trim();
  if (!parentPath || parentPath === "/") {
    return `/${slug}`;
  }
  return `${parentPath}/${slug}`;
}

export function toCloudinaryFolder(logicalPath: string): string {
  const normalized = logicalPath
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase(),
    )
    .join("/");

  return normalized ? `ged/${normalized}` : "ged/general";
}
