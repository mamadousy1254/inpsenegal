"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type NewsItem,
} from "@/components/actualites/actualites-data";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  News card                                                          */
/* ------------------------------------------------------------------ */

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        href={`/actualites/${item.slug}`}
        className="group block h-full rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={`absolute top-3 left-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[item.category]}`}
          >
            {CATEGORY_LABELS[item.category]}
          </span>
        </div>

        <div className="p-5">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" aria-hidden />
            {formatDate(item.publishedAt)}
          </p>
          <h3 className="mt-2 text-[15px] font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-[var(--inp-vert)] transition-colors duration-200">
            {item.title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
            {item.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--inp-vert)] transition-all duration-200 group-hover:gap-2">
            Lire l&apos;article
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

interface ActualitesProps {
  news: NewsItem[];
}

export function Actualites({ news }: ActualitesProps) {
  const homepageNews = news.slice(0, 3);
  return (
    <section
      className="py-20 px-4 bg-muted/40"
      aria-labelledby="actualites-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="actualites-title"
          align="center"
          subtitle="Les dernières nouvelles de l'Institut."
        >
          Actualités
        </SectionTitle>

        {/* News cards grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homepageNews.map((item, i) => (
            <NewsCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/25 hover:scale-[1.02]"
          >
            Voir toutes les actualités
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
