"use client";

import { useRef, useState } from "react";
import { FileTextIcon, Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CmsPdfUploadProps = {
  value?: { url: string; publicId?: string; fileName?: string };
  onChange: (value: { url: string; publicId?: string; fileName?: string } | undefined) => void;
  className?: string;
};

export function CmsPdfUpload({ value, onChange, className }: CmsPdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cms/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      onChange({ url: data.url, publicId: data.publicId, fileName: data.fileName });
      toast.success("PDF téléversé");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">Document PDF</p>

      {value?.url ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <FileTextIcon className="size-4 shrink-0 text-[var(--inp-vert)]" />
            <span className="truncate text-sm">{value.fileName ?? "document.pdf"}</span>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onChange(undefined)}>
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            <UploadIcon className="size-5" />
          )}
          {uploading ? "Téléversement…" : "Cliquez pour ajouter un PDF"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
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
