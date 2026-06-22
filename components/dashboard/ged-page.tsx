"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import {
  ChevronRightIcon,
  FolderIcon,
  GridIcon,
  LayoutListIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import { toast } from "sonner";

import { GedFileUpload } from "@/components/dashboard/ged-file-upload";
import { GedFilterBar } from "@/components/dashboard/ged-filter-bar";
import { GedImagePreviewDialog } from "@/components/dashboard/ged-image-preview-dialog";
import { GedShareDialog } from "@/components/dashboard/ged-share-dialog";
import { GedGridView, GedListView } from "@/components/dashboard/ged-views";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  GedFileEntry,
  GedFolderEntry,
  GedItemEntry,
} from "@/lib/services/ged/serialize-ged";
import type { GedFilterId } from "@/lib/utils/ged-filters";
import { matchesGedFilter } from "@/lib/utils/ged-filters";
import { cn } from "@/lib/utils";

type CurrentFolder = {
  _id: string;
  name: string;
  path: string;
};

export function GedPage() {
  const [files, setFiles] = useState<GedFileEntry[]>([]);
  const [folders, setFolders] = useState<GedFolderEntry[]>([]);
  const [currentFolder, setCurrentFolder] = useState<CurrentFolder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<GedFilterId>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [breadcrumbPath, setBreadcrumbPath] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isRenaming, setIsRenaming] = useState(false);
  const [idEditingText, setIdEditingText] = useState("");
  const [nameEditing, setNameEditing] = useState("");
  const [shareFile, setShareFile] = useState<GedFileEntry | null>(null);
  const [previewFile, setPreviewFile] = useState<GedFileEntry | null>(null);

  const fetchFolderContents = useCallback(async (folderId?: string) => {
    setIsLoading(true);
    try {
      const params = folderId ? `?parentId=${folderId}` : "";
      const response = await fetch(`/api/ged/contents${params}`);
      if (!response.ok) {
        throw new Error("Erreur de chargement");
      }
      const data = await response.json();
      setFiles(data.files ?? []);
      setFolders(data.folders ?? []);
    } catch {
      toast.error("Erreur lors du chargement du dossier");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolderContents(currentFolder?._id);
  }, [currentFolder?._id, fetchFolderContents]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch("/api/ged/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentId: currentFolder?._id ?? null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      toast.success("Dossier créé avec succès");
      setIsFolderDialogOpen(false);
      setNewFolderName("");
      await fetchFolderContents(currentFolder?._id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    }
  };

  const handleUploadComplete = async () => {
    setIsUploadDialogOpen(false);
    await fetchFolderContents(currentFolder?._id);
  };

  const handleDownload = async (file: GedFileEntry) => {
    try {
      const response = await fetch(`/api/ged/files/${file._id}/download`);
      if (!response.ok) throw new Error("Erreur de téléchargement");
      const data = await response.json();
      window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleShare = (file: GedFileEntry) => {
    setShareFile(file);
  };

  const handlePreview = (file: GedFileEntry) => {
    setPreviewFile(file);
  };

  const handleDelete = async (item: GedItemEntry) => {
    try {
      const endpoint =
        item.itemType === "folder"
          ? `/api/ged/folders/${item._id}`
          : `/api/ged/files/${item._id}`;
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur");
      }

      if (item.itemType === "folder") {
        setFolders((prev) => prev.filter((f) => f._id !== item._id));
      } else {
        setFiles((prev) => prev.filter((f) => f._id !== item._id));
      }
      toast.success("Supprimé avec succès");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la suppression",
      );
    }
  };

  const handleRename = async (item: GedItemEntry) => {
    if (!nameEditing.trim() || nameEditing === item.name) {
      setIsRenaming(false);
      setIdEditingText("");
      return;
    }

    try {
      const endpoint =
        item.itemType === "folder"
          ? `/api/ged/folders/${item._id}`
          : `/api/ged/files/${item._id}`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameEditing.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur");
      }

      await fetchFolderContents(currentFolder?._id);
      setIsRenaming(false);
      setIdEditingText("");
      setNameEditing("");
      toast.success("Renommé avec succès");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors du renommage",
      );
    }
  };

  const openFolder = (folder: GedFolderEntry) => {
    setCurrentFolder({
      _id: folder._id,
      name: folder.name,
      path: folder.path,
    });
    setBreadcrumbPath((prev) => {
      const exists = prev.some((p) => p.id === folder._id);
      if (exists) return prev;
      return [...prev, { id: folder._id, name: folder.name }];
    });
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setBreadcrumbPath([]);
      return;
    }
    const target = breadcrumbPath[index];
    setBreadcrumbPath(breadcrumbPath.slice(0, index + 1));
    setCurrentFolder({
      _id: target.id,
      name: target.name,
      path: `/${target.name}`,
    });
  };

  const allItems: GedItemEntry[] = [...folders, ...files];
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch && matchesGedFilter(item, filter);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            GED — Documents
          </h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => navigateToBreadcrumb(-1)}
                >
                  Accueil
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbPath.map((item, index) => (
                <Fragment key={item.id}>
                  <BreadcrumbSeparator>
                    <ChevronRightIcon className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="cursor-pointer"
                      onClick={() => navigateToBreadcrumb(index)}
                    >
                      {item.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger render={<Button />}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un document</DialogTitle>
                <DialogDescription>
                  {currentFolder
                    ? `Dossier : ${currentFolder.name}`
                    : "Racine — Mes documents"}
                </DialogDescription>
              </DialogHeader>
              <GedFileUpload
                onUploadComplete={handleUploadComplete}
                parentId={currentFolder?._id}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
            <DialogTrigger render={<Button variant="outline" />}>
              <FolderIcon className="mr-2 h-4 w-4" />
              Nouveau dossier
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un dossier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="folderName">Nom du dossier</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Mon dossier"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFolder();
                    }}
                  />
                </div>
                <Button onClick={handleCreateFolder} className="w-full">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative max-w-sm">
          <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un fichier ou dossier…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8"
          />
        </div>
        <GedFilterBar value={filter} onChange={setFilter} />
      </div>

      <Card className="border-muted/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold">
            Mes documents
            {!isLoading && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredItems.length})
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-1 rounded-lg border border-muted/60 bg-muted/20 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              title="Vue grille"
              className={cn(
                "h-8 w-8 transition-colors",
                viewMode === "grid"
                  ? "bg-sky-500 text-white shadow-sm hover:bg-sky-600 hover:text-white"
                  : "text-sky-600 hover:bg-sky-500/10 hover:text-sky-700 dark:text-sky-400",
              )}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              title="Vue liste"
              className={cn(
                "h-8 w-8 transition-colors",
                viewMode === "list"
                  ? "bg-violet-500 text-white shadow-sm hover:bg-violet-600 hover:text-white"
                  : "text-violet-600 hover:bg-violet-500/10 hover:text-violet-700 dark:text-violet-400",
              )}
            >
              <LayoutListIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Aucun élément dans ce dossier
            </div>
          ) : viewMode === "grid" ? (
            <GedGridView
              items={filteredItems}
              onFolderClick={openFolder}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
              onRename={handleRename}
              isRenaming={isRenaming}
              idEditingText={idEditingText}
              setIsRenaming={setIsRenaming}
              setIdEditingText={setIdEditingText}
              nameEditing={nameEditing}
              setNameEditing={setNameEditing}
            />
          ) : (
            <GedListView
              items={filteredItems}
              onFolderClick={openFolder}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <GedImagePreviewDialog
        file={previewFile}
        open={previewFile !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewFile(null);
        }}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      <GedShareDialog
        file={shareFile}
        open={shareFile !== null}
        onOpenChange={(open) => {
          if (!open) setShareFile(null);
        }}
      />
    </div>
  );
}
