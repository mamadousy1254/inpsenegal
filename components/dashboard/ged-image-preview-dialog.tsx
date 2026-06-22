"use client";

import { useEffect, useState } from "react";
import {
  DownloadIcon,
  ImageIcon,
  Loader2Icon,
  Share2Icon,
  ZoomInIcon,
} from "lucide-react";

import { formatBytes } from "@/components/dashboard/ged-views";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GedFileEntry } from "@/lib/services/ged/serialize-ged";
import { cn } from "@/lib/utils";

type GedImagePreviewDialogProps = {
  file: GedFileEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (file: GedFileEntry) => void;
  onShare: (file: GedFileEntry) => void;
};

export function GedImagePreviewDialog({
  file,
  open,
  onOpenChange,
  onDownload,
  onShare,
}: GedImagePreviewDialogProps) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!open || !file) {
      setPreviewUrl("");
      setImageLoaded(false);
      setImageError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setImageLoaded(false);
    setImageError(false);

    async function loadPreview() {
      if (file?.imagePreviewUrl && !cancelled) {
        setPreviewUrl(file.imagePreviewUrl);
        setLoading(false);
      }

      try {
        const response = await fetch(`/api/ged/files/${file?._id}/preview`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (!cancelled && data.previewUrl) setPreviewUrl(data.previewUrl);
      } catch {
        if (!cancelled && !file?.imagePreviewUrl) setImageError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [open, file]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(680px,92dvh)] max-w-3xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-sky-200/40 bg-gradient-to-r from-sky-50/80 to-background px-5 py-4 dark:border-sky-900/40 dark:from-sky-950/30">
          <div className="flex items-center gap-3 pr-8">
            <span className="flex size-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm shadow-sky-500/25">
              <ImageIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="truncate text-base">{file?.name}</DialogTitle>
              <DialogDescription className="mt-0.5 flex items-center gap-2 text-xs">
                <ZoomInIcon className="size-3.5" />
                Aperçu image
                {file ? (
                  <span className="text-muted-foreground">
                    · {formatBytes(file.size)}
                  </span>
                ) : null}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden bg-muted/20 p-4">
          {loading && !previewUrl ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2Icon className="size-8 animate-spin text-sky-600" />
              <p className="text-sm">Chargement de l&apos;aperçu…</p>
            </div>
          ) : imageError ? (
            <p className="text-sm text-muted-foreground">
              Impossible d&apos;afficher l&apos;aperçu
            </p>
          ) : previewUrl ? (
            <>
              {!imageLoaded && (
                <Loader2Icon className="absolute size-8 animate-spin text-sky-600" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={file?.name ?? "Aperçu"}
                className={cn(
                  "max-h-[min(52vh,520px)] max-w-full rounded-lg object-contain shadow-md transition-opacity",
                  imageLoaded ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : null}
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t bg-muted/15 px-5 py-3 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
          {file ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => onDownload(file)}
              >
                <DownloadIcon className="size-4" />
                Télécharger
              </Button>
              <Button
                type="button"
                className="gap-2 bg-sky-600 hover:bg-sky-700"
                onClick={() => {
                  onOpenChange(false);
                  onShare(file);
                }}
              >
                <Share2Icon className="size-4" />
                Partager
              </Button>
            </div>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
