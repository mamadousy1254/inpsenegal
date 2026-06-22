"use client";

import {
  DownloadIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";

import { GedDocumentIcon } from "@/components/dashboard/ged-document-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type {
  GedFileEntry,
  GedFolderEntry,
  GedItemEntry,
} from "@/lib/services/ged/serialize-ged";
import { isGedImageFile } from "@/lib/utils/ged-images";
import { cn } from "@/lib/utils";

function formatBytes(bytes: number) {
  const sizes = ["o", "Ko", "Mo", "Go"];
  if (bytes === 0) return "0 o";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round((bytes / 1024 ** i) * 100) / 100} ${sizes[i]}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function GedItemVisual({
  item,
  size = "lg",
  onPreview,
}: {
  item: GedItemEntry;
  size?: "sm" | "lg";
  onPreview?: (file: GedFileEntry) => void;
}) {
  const isImage =
    item.itemType === "file" && isGedImageFile(item) && item.imageThumbnailUrl;

  if (isImage) {
    const thumbClass =
      size === "lg"
        ? "mx-auto h-8 w-8 shrink-0"
        : "size-7 shrink-0";
    return (
      <button
        type="button"
        title="Voir l'aperçu"
        onClick={(event) => {
          event.stopPropagation();
          onPreview?.(item as GedFileEntry);
        }}
        className={cn(
          "group/thumb overflow-hidden rounded-md ring-1 ring-sky-200/60 transition hover:ring-sky-400/80 dark:ring-sky-900/50",
          thumbClass,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageThumbnailUrl}
          alt={item.name}
          className="size-full object-cover transition group-hover/thumb:scale-105"
        />
      </button>
    );
  }

  return (
    <GedDocumentIcon
      itemType={item.itemType === "folder" ? "folder" : "file"}
      mimeType={item.itemType === "file" ? item.mimeType : undefined}
      name={item.name}
      size={size === "lg" ? "lg" : "sm"}
    />
  );
}

export function GedGridView({
  items,
  onFolderClick,
  onPreview,
  onDownload,
  onShare,
  onDelete,
  onRename,
  isRenaming,
  idEditingText,
  setIsRenaming,
  setIdEditingText,
  nameEditing,
  setNameEditing,
}: {
  items: GedItemEntry[];
  onFolderClick: (folder: GedFolderEntry) => void;
  onPreview: (file: GedFileEntry) => void;
  onDownload: (file: GedFileEntry) => void;
  onShare: (file: GedFileEntry) => void;
  onDelete: (item: GedItemEntry) => void;
  onRename: (item: GedItemEntry) => void;
  isRenaming: boolean;
  idEditingText: string;
  setIsRenaming: (value: boolean) => void;
  setIdEditingText: (value: string) => void;
  nameEditing: string;
  setNameEditing: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {items.map((item) => {
        const editing = isRenaming && idEditingText === item._id;
        const isImageFile =
          item.itemType === "file" && isGedImageFile(item as GedFileEntry);

        return (
          <div
            key={item._id}
            className={cn(
              "group relative flex flex-col items-center rounded-lg border bg-card p-2.5 transition hover:border-primary/30 hover:bg-muted/20",
              (item.itemType === "folder" || isImageFile) && "cursor-pointer",
              isImageFile && "hover:border-sky-300/60 hover:bg-sky-50/20 dark:hover:bg-sky-950/10",
            )}
            onClick={() => {
              if (editing) return;
              if (item.itemType === "folder") {
                onFolderClick(item as GedFolderEntry);
              } else if (isImageFile) {
                onPreview(item as GedFileEntry);
              }
            }}
          >
            <div className="mb-1.5 flex h-9 w-full items-center justify-center">
              <GedItemVisual item={item} size="lg" onPreview={onPreview} />
            </div>

            {editing ? (
              <Input
                autoFocus
                value={nameEditing}
                onChange={(e) => setNameEditing(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onRename(item);
                  if (e.key === "Escape") {
                    setIsRenaming(false);
                    setIdEditingText("");
                  }
                }}
                onBlur={() => onRename(item)}
                className="h-7 px-1.5 text-center text-[11px]"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="line-clamp-2 w-full text-center text-[11px] font-medium leading-tight">
                {item.name}
              </p>
            )}

            <p className="mt-0.5 text-[9px] text-muted-foreground">
              {item.itemType === "folder"
                ? "Dossier"
                : isImageFile
                  ? "Image"
                  : formatBytes((item as GedFileEntry).size)}
            </p>

            <div className="absolute right-1 top-1 opacity-0 transition group-hover:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                >
                  <MoreVerticalIcon className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {item.itemType === "folder" ? (
                    <DropdownMenuItem
                      onClick={() => onFolderClick(item as GedFolderEntry)}
                    >
                      Ouvrir
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {isImageFile ? (
                        <DropdownMenuItem
                          onClick={() => onPreview(item as GedFileEntry)}
                        >
                          <EyeIcon className="mr-2 h-4 w-4" />
                          Aperçu
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem
                        onClick={() => onDownload(item as GedFileEntry)}
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onShare(item as GedFileEntry)}
                      >
                        <Share2Icon className="mr-2 h-4 w-4" />
                        Partager
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      setIsRenaming(true);
                      setIdEditingText(item._id);
                      setNameEditing(item.name);
                    }}
                  >
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Renommer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(item)}
                    className="text-destructive"
                  >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function GedListView({
  items,
  onFolderClick,
  onPreview,
  onDownload,
  onShare,
  onDelete,
}: {
  items: GedItemEntry[];
  onFolderClick: (folder: GedFolderEntry) => void;
  onPreview: (file: GedFileEntry) => void;
  onDownload: (file: GedFileEntry) => void;
  onShare: (file: GedFileEntry) => void;
  onDelete: (item: GedItemEntry) => void;
}) {
  return (
    <div className="divide-y rounded-lg border">
      {items.map((item) => {
        const isImageFile =
          item.itemType === "file" && isGedImageFile(item as GedFileEntry);

        return (
          <div
            key={item._id}
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted/40",
              (item.itemType === "folder" || isImageFile) && "cursor-pointer",
            )}
            onClick={() => {
              if (item.itemType === "folder") {
                onFolderClick(item as GedFolderEntry);
              } else if (isImageFile) {
                onPreview(item as GedFileEntry);
              }
            }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <GedItemVisual item={item} size="sm" onPreview={onPreview} />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {item.itemType === "folder"
                    ? "Dossier"
                    : isImageFile
                      ? `Image · ${formatBytes((item as GedFileEntry).size)}`
                      : `${formatBytes((item as GedFileEntry).size)} · ${formatDate(item.createdAt)}`}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => e.stopPropagation()}
                  />
                }
              >
                <MoreVerticalIcon className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {item.itemType === "folder" ? (
                  <DropdownMenuItem
                    onClick={() => onFolderClick(item as GedFolderEntry)}
                  >
                    Ouvrir
                  </DropdownMenuItem>
                ) : (
                  <>
                    {isImageFile ? (
                      <DropdownMenuItem
                        onClick={() => onPreview(item as GedFileEntry)}
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Aperçu
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      onClick={() => onDownload(item as GedFileEntry)}
                    >
                      Télécharger
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onShare(item as GedFileEntry)}
                    >
                      Partager
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="text-destructive"
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
}

export { formatBytes, formatDate };
