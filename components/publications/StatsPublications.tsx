"use client";

import { motion } from "framer-motion";
import { TYPE_LABELS, type PublicationItem, type PublicationType } from "./publication-data";

function computeStats(publications: PublicationItem[]) {
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
  const byYear = years.map((y) => ({
    year: y,
    count: publications.filter((p) => p.year === y).length,
  }));
  const byType = (Object.keys(TYPE_LABELS) as PublicationType[]).map((t) => ({
    type: t,
    label: TYPE_LABELS[t],
    count: publications.filter((p) => p.type === t).length,
  }));
  const maxPerYear = Math.max(...byYear.map((y) => y.count), 1);
  return { byYear, byType, total: publications.length, maxPerYear };
}

export function StatsPublications({ publications }: { publications: PublicationItem[] }) {
  const { byYear, byType, total, maxPerYear } = computeStats(publications);

  return (
    <motion.aside
      className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
    >
      {/* Total */}
      <div className="text-center">
        <p className="text-3xl font-extrabold text-[var(--inp-vert)]">{total}</p>
        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
          Publications référencées
        </p>
      </div>

      <hr className="my-5 border-border/50" />

      {/* Bar chart — publications by year */}
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Par année
      </h4>
      <div className="space-y-2.5">
        {byYear.map((y, i) => (
          <div key={y.year} className="flex items-center gap-3">
            <span className="w-10 text-right text-xs font-medium text-foreground tabular-nums">
              {y.year}
            </span>
            <div className="relative flex-1 h-3 overflow-hidden rounded-full bg-muted/50">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--inp-vert)]"
                initial={{ width: 0 }}
                whileInView={{ width: `${(y.count / maxPerYear) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
              />
            </div>
            <span className="w-5 text-xs text-muted-foreground tabular-nums">{y.count}</span>
          </div>
        ))}
      </div>

      <hr className="my-5 border-border/50" />

      {/* Breakdown by type */}
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Par type
      </h4>
      <ul className="space-y-2">
        {byType.map((t) => (
          <li key={t.type} className="flex items-center justify-between text-xs">
            <span className="text-foreground">{t.label}</span>
            <span className="ml-2 rounded-full bg-[var(--inp-vert)]/10 px-2 py-0.5 font-semibold text-[var(--inp-vert)]">
              {t.count}
            </span>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
