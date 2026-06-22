"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatDate,
  type NewsItem,
} from "./actualites-data";

interface Props {
  items: NewsItem[];
}

export function ListeActualites({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Aucune actualité ne correspond à vos critères.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((article, i) => (
          <motion.article
            key={article.slug}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--inp-vert)]/15 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <Link href={`/actualites/${article.slug}`} className="flex flex-col flex-1">
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden />
                {/* Category badge */}
                <span
                  className={cn(
                    "absolute left-3 top-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm",
                    CATEGORY_COLORS[article.category]
                  )}
                >
                  {CATEGORY_LABELS[article.category]}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(article.publishedAt)}
                </p>

                <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-[var(--inp-vert)] transition-colors duration-200 line-clamp-2">
                  {article.title}
                </h3>

                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {article.excerpt}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--inp-vert)]">
                  Lire plus <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </AnimatePresence>
    </div>
  );
}
