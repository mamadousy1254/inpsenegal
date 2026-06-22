"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FiltresRecherche, type Filters } from "./FiltresRecherche";
import { ListePublications } from "./ListePublications";
import { StatsPublications } from "./StatsPublications";
import type { PublicationItem } from "./publication-data";

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

const PER_PAGE = 5;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PublicationsClient({ publications }: { publications: PublicationItem[] }) {
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
  const [filters, setFilters] = useState<Filters>({
    query: "",
    year: null,
    type: null,
    axis: null,
  });
  const [page, setPage] = useState(1);

  /* ── filtering ── */
  const filtered = useMemo(() => {
    let list = [...publications];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.some((a) => a.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.abstract.toLowerCase().includes(q)
      );
    }
    if (filters.year) list = list.filter((p) => p.year === filters.year);
    if (filters.type) list = list.filter((p) => p.type === filters.type);
    if (filters.axis) list = list.filter((p) => p.researchAxis === filters.axis);

    return list;
  }, [filters, publications]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  /* reset page when filters change */
  function handleFilterChange(f: Filters) {
    setFilters(f);
    setPage(1);
  }

  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="pub-list-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="pub-list-title"
          label="Catalogue"
          subtitle={`${filtered.length} publication${filtered.length !== 1 ? "s" : ""} trouvée${filtered.length !== 1 ? "s" : ""}`}
        >
          Rechercher &amp; explorer
        </SectionTitle>

        <div className="mt-10">
          <FiltresRecherche filters={filters} onChange={handleFilterChange} years={years} />
        </div>

        {/* Layout: list + sidebar stats */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <div>
            <ListePublications items={paginated} />

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-center gap-1"
                aria-label="Pagination des publications"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
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
                  )
                )}
              </nav>
            )}
          </div>

          <StatsPublications publications={publications} />
        </div>
      </div>
    </section>
  );
}
