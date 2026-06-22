"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Users,
  Calendar,
  Tag,
  ArrowRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TYPE_LABELS,
  TYPE_COLORS,
  type PublicationItem,
} from "./publication-data";
import { PublicationDownloadLink } from "./PublicationDownloadLink";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ListePublicationsProps {
  items: PublicationItem[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ListePublications({ items }: ListePublicationsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <p className="mt-4 text-sm text-muted-foreground">
          Aucune publication ne correspond à vos critères.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0 divide-y divide-border/60">
      <AnimatePresence mode="popLayout">
        {items.map((pub, i) => (
          <motion.article
            key={pub.slug}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="group relative bg-white px-0 py-7 first:pt-0 last:pb-0 transition-colors duration-200 hover:bg-[var(--inp-vert)]/[0.015]"
          >
            {/* Featured star */}
            {pub.isFeatured && (
              <span
                className="absolute right-0 top-7 flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700"
                title="Publication mise en avant"
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Mise en avant
              </span>
            )}

            {/* Type badge + year */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  TYPE_COLORS[pub.type]
                )}
              >
                <FileText className="h-3 w-3" />
                {TYPE_LABELS[pub.type]}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {pub.year}
              </span>
              {pub.doi && (
                <span className="text-[10px] font-mono text-muted-foreground/70">
                  DOI: {pub.doi}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="mt-3 text-base font-semibold leading-snug text-foreground group-hover:text-[var(--inp-vert)] transition-colors duration-200 sm:text-lg">
              <Link href={`/publications/${pub.slug}`} className="focus-visible:outline-none focus-visible:underline">
                {pub.title}
              </Link>
            </h3>

            {/* Authors */}
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
              {pub.authors.join(", ")}
            </p>

            {/* Abstract */}
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {pub.abstract}
            </p>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Tag className="h-3 w-3 text-muted-foreground/50" aria-hidden />
              {pub.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-4">
              <Link
                href={`/publications/${pub.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--inp-vert)] transition-colors hover:text-[var(--inp-vert)]/80"
              >
                Voir détail <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <PublicationDownloadLink
                publication={pub}
                label="PDF"
                showUnavailable={false}
                className="bg-transparent px-0 py-0 text-sm font-medium text-muted-foreground shadow-none hover:brightness-100 hover:text-foreground"
              />
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
    </div>
  );
}
