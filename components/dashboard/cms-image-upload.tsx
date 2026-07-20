"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CmsImageUploadProps = {
  value?: { url: string; publicId?: string };
  onChange: (value: { url: string; publicId?: string } | undefined) => void;
  folder?: string;
  label?: string;
  className?: string;
  /** Aperçu en contain (cartes) ou cover (photos). */
  previewFit?: "cover" | "contain";
  /** Limite la hauteur de la zone d’aperçu / dropzone. */
  previewClassName?: string;
  hint?: string;
  maxBytes?: number;
};

export function CmsImageUpload({
  value,
  onChange,
  folder = "actualites",
  label = "Image de couverture (16/9)",
  className,
  previewFit = "cover",
  previewClassName,
  hint,
  maxBytes = 5 * 1024 * 1024,
}: CmsImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > maxBytes) {
      const maxMo = maxBytes / (1024 * 1024);
      toast.error(`Le fichier ne doit pas dépasser ${maxMo} Mo`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/cms/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      onChange({ url: data.url, publicId: data.publicId });
      toast.success("Image téléversée");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  const previewBoxClass = cn(
    "relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-border bg-muted/20",
    previewClassName,
  );

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">{label}</p>
      {hint ? (
        <p className="text-xs text-muted-foreground leading-snug">{hint}</p>
      ) : null}

      {value?.url ? (
        <div className={previewBoxClass}>
          <Image
            src={value.url}
            alt="Aperçu"
            fill
            className={previewFit === "contain" ? "object-contain p-2" : "object-cover"}
            sizes="400px"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute right-2 top-2"
            onClick={() => onChange(undefined)}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex aspect-video w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-60",
            previewClassName,
          )}
        >
          {uploading ? (
            <Loader2Icon className="size-6 animate-spin" />
          ) : (
            <UploadIcon className="size-6" />
          )}
          {uploading ? "Téléversement…" : "Cliquez pour ajouter une image"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
