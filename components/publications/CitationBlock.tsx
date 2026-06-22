"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicationItem } from "./publication-data";

/* ------------------------------------------------------------------ */
/*  Formats                                                            */
/* ------------------------------------------------------------------ */

type CitationFormat = "apa" | "mla" | "institutionnel";

const FORMAT_LABELS: Record<CitationFormat, string> = {
  apa: "APA 7",
  mla: "MLA 9",
  institutionnel: "Format INP",
};

function formatAPA(p: PublicationItem): string {
  const authorsStr = p.authors
    .map((a) => {
      const parts = a.replace(/^(Dr\.|Pr\.)\s*/, "").trim().split(" ");
      const last = parts.pop() ?? "";
      const initials = parts.map((n) => n.charAt(0) + ".").join(" ");
      return `${last}, ${initials}`;
    })
    .join(", ");
  return `${authorsStr} (${p.year}). ${p.title}. Institut national de Pédologie.${p.doi ? ` https://doi.org/${p.doi}` : ""}`;
}

function formatMLA(p: PublicationItem): string {
  const authorsStr =
    p.authors.length === 1
      ? p.authors[0].replace(/^(Dr\.|Pr\.)\s*/, "")
      : p.authors
          .map((a) => a.replace(/^(Dr\.|Pr\.)\s*/, ""))
          .join(", ");
  return `${authorsStr}. "${p.title}." Institut national de Pédologie, ${p.year}.`;
}

function formatINP(p: PublicationItem): string {
  return `INP (${p.year}). ${p.title}. Auteurs : ${p.authors.join(", ")}. Dakar : Institut national de Pédologie.${p.doi ? ` DOI : ${p.doi}.` : ""}`;
}

const FORMATTERS: Record<CitationFormat, (p: PublicationItem) => string> = {
  apa: formatAPA,
  mla: formatMLA,
  institutionnel: formatINP,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CitationBlock({
  publication,
}: {
  publication: PublicationItem;
}) {
  const [format, setFormat] = useState<CitationFormat>("apa");
  const [copied, setCopied] = useState(false);

  const citation = FORMATTERS[format](publication);

  async function handleCopy() {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="rounded-2xl border border-[var(--inp-vert)]/15 bg-[#F8F1E0] p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Comment citer cette publication
      </h3>

      {/* Format tabs */}
      <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm">
        {(Object.keys(FORMAT_LABELS) as CitationFormat[]).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
              f === format
                ? "bg-[var(--inp-vert)] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {FORMAT_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Citation text */}
      <div className="mt-4 rounded-xl bg-white p-4 text-sm leading-relaxed text-foreground/90 font-mono border border-border/50">
        {citation}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--inp-vert)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copié !
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copier la citation
          </>
        )}
      </button>
    </div>
  );
}
