"use client";

import { motion } from "framer-motion";
import { DOCUMENTS, DOC_TYPE_LABELS, getDocYears, type DocType } from "./doc-data";

function computeStats() {
  const years = getDocYears();
  const byYear = years.map((y) => ({
    year: y,
    count: DOCUMENTS.filter((d) => d.year === y).length,
  }));
  const byType = (Object.keys(DOC_TYPE_LABELS) as DocType[]).map((t) => ({
    type: t,
    label: DOC_TYPE_LABELS[t],
    count: DOCUMENTS.filter((d) => d.type === t).length,
  }));
  const totalDownloads = DOCUMENTS.reduce((s, d) => s + d.downloads, 0);
  const maxPerYear = Math.max(...byYear.map((y) => y.count), 1);
  return { byYear, byType, total: DOCUMENTS.length, totalDownloads, maxPerYear };
}

export function StatsDocuments() {
  const { byYear, byType, total, totalDownloads, maxPerYear } = computeStats();

  return (
    <motion.aside
      className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
    >
      {/* Totals */}
      <div className="flex gap-4">
        <div className="flex-1 text-center">
          <p className="text-2xl font-extrabold text-[var(--inp-vert)]">{total}</p>
          <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">Documents</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-2xl font-extrabold text-[var(--inp-vert)]">
            {totalDownloads.toLocaleString("fr-FR")}
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">Téléchargements</p>
        </div>
      </div>

      <hr className="my-5 border-border/50" />

      {/* Bar chart by year */}
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

      {/* By type */}
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
