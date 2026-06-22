"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  FileText,
  BookOpen,
  ClipboardList,
  FileBarChart,
  ArrowRight,
} from "lucide-react";
import {
  TYPE_LABELS,
  type PublicationItem,
  type PublicationType,
} from "@/components/publications/publication-data";
import { PublicationDownloadLink } from "@/components/publications/PublicationDownloadLink";

const TYPE_ICONS: Record<PublicationType, React.ReactNode> = {
  "rapport-technique": <FileBarChart className="h-5 w-5" />,
  "etude-nationale": <ClipboardList className="h-5 w-5" />,
  "article-scientifique": <BookOpen className="h-5 w-5" />,
  "fiche-technique": <FileText className="h-5 w-5" />,
};

export function PublicationsResultats({
  publications,
}: {
  publications: PublicationItem[];
}) {
  const items = publications.slice(0, 6);

  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "var(--inp-vert)" }}
      aria-labelledby="publi-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="container relative mx-auto max-w-6xl">
        <SectionTitle
          id="publi-title"
          align="center"
          light
          subtitle="Rapports techniques, articles scientifiques et fiches de référence produits par l'Institut."
        >
          Publications &amp; résultats
        </SectionTitle>

        {items.length === 0 ? (
          <p className="mt-14 text-center text-sm text-white/70">
            Aucune publication publiée pour le moment.
          </p>
        ) : (
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((pub, i) => (
              <motion.div
                key={pub.slug}
                className="group rounded-xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12] hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: "easeOut" as const,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/80">
                    {TYPE_ICONS[pub.type]}
                  </div>
                  <div>
                    <span className="text-xs font-medium text-white/50">
                      {TYPE_LABELS[pub.type]}
                    </span>
                    <span className="ml-2 text-xs text-white/35">{pub.year}</span>
                  </div>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-white leading-snug line-clamp-2">
                  {pub.title}
                </h3>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/publications/${pub.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 transition-all hover:gap-2"
                  >
                    Voir détail
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <PublicationDownloadLink
                    publication={pub}
                    label="Télécharger PDF"
                    className="rounded-lg border border-white/20 bg-transparent px-3 py-1.5 text-xs font-medium text-white/80 shadow-none hover:bg-white hover:text-[var(--inp-vert)] hover:brightness-100"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Voir toutes les publications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
