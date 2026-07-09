"use client";

import { useRef, useState } from "react";
import { FileIcon, Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MISSION_ATTACHMENT_TYPES,
  MISSION_ATTACHMENT_TYPE_LABELS,
  type MissionAttachmentType,
} from "@/lib/constants/mission";
import {
  MISSION_ATTACHMENT_ACCEPT,
  MISSION_ATTACHMENT_MAX_BYTES,
} from "@/lib/constants/mission-attachments";

export type MissionAttachmentDraft = {
  type: MissionAttachmentType;
  name: string;
  url: string;
  publicId?: string;
  mimeType?: string;
  bytes?: number;
};

type MissionAttachmentUploadProps = {
  attachments: MissionAttachmentDraft[];
  onChange: (attachments: MissionAttachmentDraft[]) => void;
  disabled?: boolean;
};

const SELECT_IN_DIALOG = {
  side: "bottom" as const,
  alignItemWithTrigger: false,
  className: "z-[200] max-h-64",
};

export function MissionAttachmentUpload({
  attachments,
  onChange,
  disabled = false,
}: MissionAttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [attachmentType, setAttachmentType] =
    useState<MissionAttachmentType>("ordre_mission");

  const handleFile = async (file: File) => {
    if (file.size > MISSION_ATTACHMENT_MAX_BYTES) {
      toast.error("Le fichier ne doit pas dépasser 10 Mo");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/missions/attachments", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload");

      onChange([
        ...attachments,
        {
          type: attachmentType,
          name: data.attachment?.name ?? file.name,
          url: data.attachment.url,
          publicId: data.attachment.publicId,
          mimeType: data.attachment.mimeType ?? file.type,
          bytes: data.attachment.bytes ?? file.size,
        },
      ]);
      toast.success("Pièce jointe ajoutée");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
        <div className="space-y-2">
          <Label>Type de document</Label>
          <Select
            value={attachmentType}
            onValueChange={(value) =>
              setAttachmentType((value ?? "ordre_mission") as MissionAttachmentType)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent {...SELECT_IN_DIALOG}>
              {MISSION_ATTACHMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {MISSION_ATTACHMENT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fichier</Label>
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-5 text-sm text-muted-foreground transition-colors hover:bg-muted/35 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              <UploadIcon className="size-5" />
            )}
            {uploading ? "Téléversement…" : "PDF, Word ou image — max. 10 Mo"}
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={Object.keys(MISSION_ATTACHMENT_ACCEPT).join(",")}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((attachment, index) => (
            <li
              key={`${attachment.url}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileIcon className="size-4 shrink-0 text-[var(--inp-vert)]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {MISSION_ATTACHMENT_TYPE_LABELS[attachment.type]}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled}
                onClick={() => onChange(attachments.filter((_, i) => i !== index))}
              >
                <XIcon className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
