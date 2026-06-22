"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FiltresDocuments, type DocFilters } from "./FiltresDocuments";
import { CatalogueDocuments } from "./CatalogueDocuments";
import { StatsDocuments } from "./StatsDocuments";
import { DOCUMENTS } from "./doc-data";

const PER_PAGE = 6;

export function DocumentationClient() {
  const [filters, setFilters] = useState<DocFilters>({
    query: "",
    year: null,
    type: null,
    axis: null,
    region: null,
    sort: "recent",
  });
  const [page, setPage] = useState(1);

  /* ── filtering + sorting ── */
  const filtered = useMemo(() => {
    let list = [...DOCUMENTS];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.author.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.description.toLowerCase().includes(q)
      );
    }
    if (filters.year) list = list.filter((d) => d.year === filters.year);
    if (filters.type) list = list.filter((d) => d.type === filters.type);
    if (filters.axis) list = list.filter((d) => d.researchAxis === filters.axis);
    if (filters.region) list = list.filter((d) => d.region === filters.region);

    switch (filters.sort) {
      case "downloads":
        list.sort((a, b) => b.downloads - a.downloads);
        break;
      case "title":
        list.sort((a, b) => a.title.localeCompare(b.title, "fr"));
        break;
      default:
        list.sort((a, b) => b.year - a.year);
    }

    return list;
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function handleFilterChange(f: DocFilters) {
    setFilters(f);
    setPage(1);
  }

  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="doc-catalogue-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="doc-catalogue-title"
          label="Catalogue"
          subtitle={`${filtered.length} document${filtered.length !== 1 ? "s" : ""} disponible${filtered.length !== 1 ? "s" : ""}`}
        >
          Rechercher &amp; télécharger
        </SectionTitle>

        <div className="mt-10">
          <FiltresDocuments filters={filters} onChange={handleFilterChange} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <div>
            <CatalogueDocuments items={paginated} />

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
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

          <StatsDocuments />
        </div>
      </div>
    </section>
  );
}
