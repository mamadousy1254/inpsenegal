import type { IGedFile } from "@/lib/mongo/models/ged-file.model";
import type { IGedFolder } from "@/lib/mongo/models/ged-folder.model";

export type GedFolderEntry = {
  _id: string;
  name: string;
  path: string;
  itemType: "folder";
  owner: {
    _id: string;
    name: string;
    avatar?: string;
  };
  parent?: string | null;
  isPublic: boolean;
  sharedWith: string[];
  color?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type GedFileEntry = {
  _id: string;
  name: string;
  size: number;
  mimeType: string;
  itemType: "file";
  path: string;
  owner: {
    _id: string;
    name: string;
    avatar?: string;
  };
  parent?: string | null;
  isPublic: boolean;
  sharedWith: string[];
  tags: string[];
  cloudinaryId: string;
  cloudinaryFolder?: string;
  format: string;
  resourceType: string;
  secureUrl: string;
  thumbnailUrl?: string;
  imageThumbnailUrl?: string;
  imagePreviewUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type GedItemEntry = GedFolderEntry | GedFileEntry;

export function serializeGedFolder(folder: IGedFolder): GedFolderEntry {
  return {
    _id: folder._id.toString(),
    name: folder.name,
    path: folder.path,
    itemType: "folder",
    owner: {
      _id: folder.owner._id.toString(),
      name: folder.owner.name,
      avatar: folder.owner.avatar,
    },
    parent: folder.parent?.toString() ?? null,
    isPublic: folder.isPublic,
    sharedWith: folder.sharedWith.map((id) => id.toString()),
    color: folder.color,
    description: folder.description,
    createdAt: folder.createdAt.toISOString(),
    updatedAt: folder.updatedAt.toISOString(),
  };
}

export function serializeGedFile(file: IGedFile): GedFileEntry {
  return {
    _id: file._id.toString(),
    name: file.name,
    size: file.size,
    mimeType: file.mimeType,
    itemType: "file",
    path: file.path,
    owner: {
      _id: file.owner._id.toString(),
      name: file.owner.name,
      avatar: file.owner.avatar,
    },
    parent: file.parent?.toString() ?? null,
    isPublic: file.isPublic,
    sharedWith: file.sharedWith.map((id) => id.toString()),
    tags: file.tags,
    cloudinaryId: file.cloudinaryId,
    cloudinaryFolder: file.cloudinaryFolder,
    format: file.format,
    resourceType: file.resourceType,
    secureUrl: file.secureUrl,
    thumbnailUrl: file.thumbnailUrl,
    createdAt: file.createdAt.toISOString(),
    updatedAt: file.updatedAt.toISOString(),
  };
}
