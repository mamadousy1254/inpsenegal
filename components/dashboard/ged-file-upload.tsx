"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircle2Icon,
  CloudUploadIcon,
  FileIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { GedDocumentIcon } from "@/components/dashboard/ged-document-icon";
import { Button } from "@/components/ui/button";
import { GED_MAX_FILE_SIZE_BYTES } from "@/lib/constants/ged";
import type { GedFileEntry } from "@/lib/services/ged/serialize-ged";
import { cn } from "@/lib/utils";

const ACCEPT = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "text/plain": [".txt"],
} as const;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`;
}

interface GedFileUploadProps {
  onUploadComplete: (file: GedFileEntry) => void;
  parentId?: string | null;
}

export function GedFileUpload({
  onUploadComplete,
  parentId,
}: GedFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setProgress(0);
      setIsDone(false);

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (parentId) formData.append("parentId", parentId);

        const interval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 12, 92));
        }, 350);

        const response = await fetch("/api/ged/files", {
          method: "POST",
          body: formData,
        });

        clearInterval(interval);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Erreur lors de l'upload");
        }

        const data = (await response.json()) as GedFileEntry;
        setProgress(100);
        setIsDone(true);
        toast.success("Fichier uploadé avec succès");
        onUploadComplete(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de l'upload",
        );
        setSelectedFile(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete, parentId],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setSelectedFile(file);
      void uploadFile(file);
    },
    [uploadFile],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      accept: ACCEPT,
      maxSize: GED_MAX_FILE_SIZE_BYTES,
      multiple: false,
      disabled: isUploading,
      noClick: isUploading,
      onDropRejected: (rejections) => {
        const err = rejections[0]?.errors[0];
        if (err?.code === "file-too-large") {
          toast.error("Le fichier ne doit pas dépasser 10 Mo");
        } else if (err?.code === "file-invalid-type") {
          toast.error("Type de fichier non autorisé");
        } else {
          toast.error("Fichier non accepté");
        }
      },
    });

  const reset = () => {
    setSelectedFile(null);
    setProgress(0);
    setIsDone(false);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          isUploading && "pointer-events-none opacity-80",
          !isDragActive &&
            !isDragReject &&
            "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30",
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex w-full max-w-xs flex-col items-center gap-3">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Envoi en cours…</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        ) : isDone && selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2Icon className="h-8 w-8 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700">
              Upload terminé
            </p>
            <p className="max-w-[240px] truncate text-xs text-muted-foreground">
              {selectedFile.name}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
            >
              Ajouter un autre fichier
            </Button>
          </div>
        ) : selectedFile ? (
          <div className="flex w-full max-w-sm items-center gap-3 rounded-lg border bg-background p-3">
            <GedDocumentIcon
              itemType="file"
              mimeType={selectedFile.type}
              name={selectedFile.name}
              size="md"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CloudUploadIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">
              {isDragActive
                ? "Déposez le fichier ici"
                : "Glissez-déposez un fichier"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ou{" "}
              <span className="font-medium text-primary underline-offset-2 hover:underline">
                parcourez vos fichiers
              </span>
            </p>
            <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <FileIcon className="h-3 w-3" />
              PDF, Word, Excel, images, TXT — max 10 Mo
            </p>
          </>
        )}
      </div>

      {!isUploading && !isDone && !selectedFile && (
        <Button type="button" variant="secondary" className="w-full" onClick={open}>
          Choisir un fichier
        </Button>
      )}
    </div>
  );
}
