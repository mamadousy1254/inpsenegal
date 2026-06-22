import { Download } from "lucide-react";

import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";
import {
  getDocumentationDownloadProps,
  hasDocumentationFile,
} from "@/lib/services/documentation/documentation-download";
import { cn } from "@/lib/utils";

type DocumentationDownloadLinkProps = {
  item: SerializedDocumentationResource;
  label?: string;
  unavailableLabel?: string;
  className?: string;
  fullWidth?: boolean;
  /** Affiche un bouton désactivé lorsqu'aucun fichier n'est disponible (défaut: true) */
  showUnavailable?: boolean;
};

const baseButtonClass =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-sm";

export function DocumentationDownloadLink({
  item,
  label = "Télécharger",
  unavailableLabel,
  className,
  fullWidth = false,
  showUnavailable = true,
}: DocumentationDownloadLinkProps) {
  const hasFile = hasDocumentationFile(item);

  if (!hasFile) {
    if (!showUnavailable) return null;

    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="Aucun fichier disponible pour le moment"
        className={cn(
          baseButtonClass,
          "cursor-not-allowed bg-gray-200 text-gray-500 opacity-70",
          fullWidth && "w-full justify-center",
          className,
        )}
      >
        <Download size={16} />
        {unavailableLabel ?? label}
      </button>
    );
  }

  const download = getDocumentationDownloadProps(item);
  if (!download) return null;

  return (
    <a
      href={download.href}
      download={download.fileName}
      className={cn(
        baseButtonClass,
        "bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] text-white transition hover:brightness-110",
        fullWidth && "w-full justify-center",
        className,
      )}
    >
      <Download size={16} />
      {label}
    </a>
  );
}
