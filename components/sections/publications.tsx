"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FileText, ArrowRight, Download, Users } from "lucide-react";
import {
  TYPE_LABELS,
  TYPE_COLORS,
  type PublicationItem,
} from "@/components/publications/publication-data";

interface PublicationsProps {
  publications: PublicationItem[];
}

/* ------------------------------------------------------------------ */
/*  Publication card                                                   */
/* ------------------------------------------------------------------ */

function PubCard({ item, index }: { item: PublicationItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        href={`/publications/${item.slug}`}
        className="group block h-full rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2"
      >
        <div className="p-6">
          {/* Top row: icon + type badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--inp-vert)]/8">
              <FileText className="h-5 w-5 text-[var(--inp-vert)]" />
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[item.type]}`}
            >
              {TYPE_LABELS[item.type]}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-4 text-[15px] font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-[var(--inp-vert)] transition-colors duration-200">
            {item.title}
          </h3>

          {/* Authors + Year */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Users className="h-3 w-3 flex-shrink-0" aria-hidden />
            <span className="truncate">{item.authors.join(", ")}</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="font-medium">{item.year}</span>
          </div>

          {/* Abstract */}
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
            {item.abstract}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--inp-vert)] transition-all duration-200 group-hover:gap-2">
              Voir le détail
              <ArrowRight className="h-3 w-3" />
            </span>
            {item.pdfUrl && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Download className="h-3 w-3" />
                PDF
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function Publications({ publications }: PublicationsProps) {
  const homepagePubs = publications.slice(0, 3);

  return (
    <section className="py-20 px-4" aria-labelledby="publications-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="publications-title"
          subtitle="Derniers rapports et études scientifiques."
        >
          Publications
        </SectionTitle>

        {/* Cards grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homepagePubs.map((item, i) => (
            <PubCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--inp-vert)]/20 bg-[var(--inp-vert)]/5 px-6 py-2.5 text-[13px] font-semibold text-[var(--inp-vert)] transition-all duration-200 hover:bg-[var(--inp-vert)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2"
          >
            Voir toutes les publications
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
