"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ActualiteUne } from "./ActualiteUne";
import { FiltresActualites, type NewsFilters } from "./FiltresActualites";
import { ListeActualites } from "./ListeActualites";
import type { NewsItem } from "./actualites-data";

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

const PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ActualitesClientProps {
  news: NewsItem[];
}

function getYearsFromNews(news: NewsItem[]): number[] {
  return [...new Set(news.map((n) => new Date(n.publishedAt).getFullYear()))].sort(
    (a, b) => b - a,
  );
}

export function ActualitesClient({ news }: ActualitesClientProps) {
  const featured = news.find((item) => item.isFeatured) ?? null;
  const years = getYearsFromNews(news);

  const [filters, setFilters] = useState<NewsFilters>({
    query: "",
    year: null,
    category: null,
  });
  const [page, setPage] = useState(1);

  /* ── filtering (exclude featured) ── */
  const filtered = useMemo(() => {
    let list = news.filter((n) => !n.isFeatured);

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.year)
      list = list.filter(
        (n) => new Date(n.publishedAt).getFullYear() === filters.year
      );
    if (filters.category)
      list = list.filter((n) => n.category === filters.category);

    return list;
  }, [filters, news]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  function handleFilterChange(f: NewsFilters) {
    setFilters(f);
    setPage(1);
  }

  return (
    <>
      {/* ── Featured article ── */}
      {featured && (
        <section className="py-16 px-4 sm:py-20" aria-label="Actualité à la une">
          <div className="container mx-auto max-w-6xl">
            <SectionTitle label="À la une" className="mb-8">
              Actualité mise en avant
            </SectionTitle>
            <ActualiteUne article={featured} />
          </div>
        </section>
      )}

      {/* ── All articles with filters ── */}
      <section className="py-16 px-4 sm:py-20" aria-labelledby="all-actu-title">
        <div className="container mx-auto max-w-6xl">
          <SectionTitle
            id="all-actu-title"
            label="Toutes les actualités"
            subtitle={`${filtered.length} article${filtered.length !== 1 ? "s" : ""}`}
          >
            Explorer les actualités
          </SectionTitle>

          <div className="mt-8">
            <FiltresActualites filters={filters} onChange={handleFilterChange} years={years} />
          </div>

          <div className="mt-10">
            <ListeActualites items={paginated} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-1"
              aria-label="Pagination des actualités"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <motion.button
                  key={p}
                  onClick={() => setPage(p)}
                  whileTap={{ scale: 0.95 }}
                  className={
                    p === safePage
                      ? "h-9 min-w-[2.25rem] rounded-xl bg-[var(--inp-vert)] px-3 text-sm font-semibold text-white shadow-sm"
                      : "h-9 min-w-[2.25rem] rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                  }
                  aria-current={p === safePage ? "page" : undefined}
                >
                  {p}
                </motion.button>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
