"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  User,
  HardDrive,
  Download,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DOC_TYPE_LABELS,
  DOC_TYPE_COLORS,
  type DocItem,
} from "./doc-data";

interface Props {
  items: DocItem[];
}

export function CatalogueDocuments({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <p className="mt-4 text-sm text-muted-foreground">
          Aucun document ne correspond à vos critères.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0 divide-y divide-border/60">
      <AnimatePresence mode="popLayout">
        {items.map((doc, i) => (
          <motion.article
            key={doc.slug}
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="group relative bg-white px-0 py-6 first:pt-0 last:pb-0 transition-colors duration-200 hover:bg-[var(--inp-vert)]/[0.015]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
              {/* Icon block */}
              <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
                <FileText className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Type + meta */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                      DOC_TYPE_COLORS[doc.type]
                    )}
                  >
                    {DOC_TYPE_LABELS[doc.type]}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {doc.year}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <HardDrive className="h-3 w-3" /> {doc.fileSize}
                  </span>
                  {doc.region !== "National" && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {doc.region}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground group-hover:text-[var(--inp-vert)] transition-colors duration-200 sm:text-base">
                  <Link href={`/documentation/${doc.slug}`} className="focus-visible:outline-none focus-visible:underline">
                    {doc.title}
                  </Link>
                </h3>

                {/* Author */}
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3 w-3 flex-shrink-0" aria-hidden />
                  {doc.author}
                </p>

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {doc.description}
                </p>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-4">
                  <Link
                    href={`/documentation/${doc.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--inp-vert)] transition-colors hover:text-[var(--inp-vert)]/80"
                  >
                    Voir détail <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Télécharger ${doc.title}`}
                  >
                    <Download className="h-3 w-3" /> Télécharger
                  </button>
                  <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                    {doc.downloads} téléchargements
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
    </div>
  );
}
