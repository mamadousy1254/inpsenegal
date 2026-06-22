"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatDate,
  type NewsItem,
} from "./actualites-data";

export function ActualiteUne({ article }: { article: NewsItem }) {
  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl border border-[var(--inp-vert)]/15 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/actualites/${article.slug}`} className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:w-[55%]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/20"
            aria-hidden
          />
          {/* Badge */}
          <span
            className={cn(
              "absolute left-4 top-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm",
              CATEGORY_COLORS[article.category]
            )}
          >
            {CATEGORY_LABELS[article.category]}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(article.publishedAt)}
          </p>

          <h2 className="text-xl font-bold leading-snug text-foreground group-hover:text-[var(--inp-vert)] transition-colors duration-200 sm:text-2xl">
            {article.title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {article.excerpt}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--inp-vert)]">
            Lire l&apos;article <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
