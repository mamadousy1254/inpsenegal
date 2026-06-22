"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircle2Icon,
  CloudUploadIcon,
  FileIcon,
  ExternalLinkIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  ABSENCE_JUSTIFICATIF_ACCEPT,
  ABSENCE_JUSTIFICATIF_MAX_BYTES,
} from "@/lib/constants/absence-justificatif";
import type { AbsenceJustificatifEntry } from "@/lib/types/absence";
import { cn } from "@/lib/utils";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`;
}

type AbsenceJustificatifUploadProps = {
  value: AbsenceJustificatifEntry | null;
  onChange: (value: AbsenceJustificatifEntry | null) => void;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

export function AbsenceJustificatifUpload({
  value,
  onChange,
  disabled = false,
  onUploadingChange,
}: AbsenceJustificatifUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(
    async (file: File) => {
      onUploadingChange?.(true);
      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const interval = window.setInterval(() => {
          setProgress((prev) => Math.min(prev + 12, 92));
        }, 300);

        const response = await fetch("/api/absences/justificatif", {
          method: "POST",
          body: formData,
        });

        window.clearInterval(interval);

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de l'upload");
        }

        setProgress(100);
        onChange(data.justificatif);
        toast.success("Justificatif téléversé");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de l'upload",
        );
        onChange(null);
      } finally {
        setUploading(false);
        onUploadingChange?.(false);
      }
    },
    [onChange, onUploadingChange],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      void uploadFile(file);
    },
    [uploadFile],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      accept: ABSENCE_JUSTIFICATIF_ACCEPT,
      maxSize: ABSENCE_JUSTIFICATIF_MAX_BYTES,
      multiple: false,
      disabled: disabled || uploading || Boolean(value),
      noClick: Boolean(value),
      noKeyboard: Boolean(value),
    });

  if (value) {
    const openUrl = value.previewUrl || value.signedUrl;
    return (
      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {value.filename}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(value.bytes)} · {value.format.toUpperCase()}
            </p>
            {openUrl ? (
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--inp-vert)] hover:underline"
                onClick={() => window.open(openUrl, "_blank", "noopener,noreferrer")}
              >
                <ExternalLinkIcon className="size-3.5" />
                Voir le fichier
              </button>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-rose-600"
            onClick={() => onChange(null)}
            disabled={disabled || uploading}
            aria-label="Retirer le justificatif"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
        isDragActive && !isDragReject && "border-[var(--inp-vert)] bg-[var(--inp-vert)]/5",
        isDragReject && "border-destructive bg-destructive/5",
        !isDragActive && "border-border/80 bg-muted/20 hover:bg-muted/30",
        (disabled || uploading) && "pointer-events-none opacity-60",
      )}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <>
          <Loader2Icon className="size-8 animate-spin text-[var(--inp-vert)]" />
          <p className="text-sm font-medium">Téléversement… {progress}%</p>
        </>
      ) : (
        <>
          <div className="flex size-11 items-center justify-center rounded-full bg-muted">
            <CloudUploadIcon className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Glissez un fichier ou{" "}
            <button
              type="button"
              className="text-[var(--inp-vert)] underline-offset-2 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              parcourez
            </button>
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Certificat médical ou document justificatif — PDF, JPG ou PNG, max.
            10 Mo
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <FileIcon className="size-3.5" />
            Stockage sécurisé sur Cloudinary
          </div>
        </>
      )}
    </div>
  );
}
