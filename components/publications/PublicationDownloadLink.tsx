import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasCmsFile, resolveCmsPdfFileName } from "@/lib/services/cms/cms-file-download";
import type { PublicationItem } from "@/components/publications/publication-data";

type PublicationDownloadLinkProps = {
  publication: Pick<PublicationItem, "slug" | "title" | "pdfUrl" | "pdfFileName">;
  label?: string;
  className?: string;
  fullWidth?: boolean;
  showUnavailable?: boolean;
};

const baseClass =
  "inline-flex items-center gap-2 rounded-xl text-sm font-semibold transition-all";

export function PublicationDownloadLink({
  publication,
  label = "Télécharger le PDF",
  className,
  fullWidth = false,
  showUnavailable = true,
}: PublicationDownloadLinkProps) {
  const hasFile = hasCmsFile(publication.pdfUrl);

  if (!hasFile) {
    if (!showUnavailable) return null;

    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={cn(
          baseClass,
          "cursor-not-allowed bg-muted px-5 py-3 text-muted-foreground opacity-70",
          fullWidth && "w-full justify-center",
          className,
        )}
      >
        <Download className="h-4 w-4" />
        PDF non disponible
      </button>
    );
  }

  const fileName = resolveCmsPdfFileName({
    title: publication.title,
    pdfFileName: publication.pdfFileName,
  });

  return (
    <a
      href={`/api/publications/${publication.slug}/download`}
      download={fileName}
      className={cn(
        baseClass,
        "bg-[var(--inp-vert)] px-5 py-3 text-white shadow-md hover:shadow-lg hover:brightness-110",
        fullWidth && "w-full justify-center",
        className,
      )}
    >
      <Download className="h-4 w-4" />
      {label}
    </a>
  );
}
