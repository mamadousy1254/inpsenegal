"use client";

import { Search, X, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DOC_TYPE_LABELS,
  RESEARCH_AXES,
  REGIONS,
  getDocYears,
  type DocType,
} from "./doc-data";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SortMode = "recent" | "downloads" | "title";

export interface DocFilters {
  query: string;
  year: number | null;
  type: DocType | null;
  axis: string | null;
  region: string | null;
  sort: SortMode;
}

interface Props {
  filters: DocFilters;
  onChange: (f: DocFilters) => void;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const selectBase =
  "h-10 rounded-xl border border-border bg-white px-3 text-sm text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--inp-vert)] focus:ring-offset-1 appearance-none cursor-pointer";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FiltresDocuments({ filters, onChange }: Props) {
  const years = getDocYears();
  const hasActive =
    filters.query || filters.year || filters.type || filters.axis || filters.region;

  function reset() {
    onChange({ ...filters, query: "", year: null, type: null, axis: null, region: null });
  }

  return (
    <div className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-5 shadow-sm sm:p-6">
      {/* Row 1 — Search + Sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="doc-search" className="mb-1.5 block text-xs font-medium text-foreground">
            Recherche
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="doc-search"
              type="text"
              value={filters.query}
              onChange={(e) => onChange({ ...filters, query: e.target.value })}
              placeholder="Titre, auteur, mot-clé…"
              className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--inp-vert)] focus:ring-offset-1"
            />
          </div>
        </div>

        <div className="sm:w-44">
          <label htmlFor="doc-sort" className="mb-1.5 flex items-center gap-1 text-xs font-medium text-foreground">
            <ArrowUpDown className="h-3 w-3" /> Trier par
          </label>
          <select
            id="doc-sort"
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as SortMode })}
            className={selectBase}
          >
            <option value="recent">Plus récent</option>
            <option value="downloads">Plus téléchargé</option>
            <option value="title">Titre (A → Z)</option>
          </select>
        </div>
      </div>

      {/* Row 2 — Filters */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Type */}
        <div>
          <label htmlFor="doc-type" className="mb-1.5 block text-xs font-medium text-foreground">Type</label>
          <select
            id="doc-type"
            value={filters.type ?? ""}
            onChange={(e) => onChange({ ...filters, type: (e.target.value as DocType) || null })}
            className={selectBase}
          >
            <option value="">Tous</option>
            {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="doc-year" className="mb-1.5 block text-xs font-medium text-foreground">Année</label>
          <select
            id="doc-year"
            value={filters.year ?? ""}
            onChange={(e) => onChange({ ...filters, year: e.target.value ? Number(e.target.value) : null })}
            className={selectBase}
          >
            <option value="">Toutes</option>
            {years.map((y) => (<option key={y} value={y}>{y}</option>))}
          </select>
        </div>

        {/* Axis */}
        <div>
          <label htmlFor="doc-axis" className="mb-1.5 block text-xs font-medium text-foreground">Axe</label>
          <select
            id="doc-axis"
            value={filters.axis ?? ""}
            onChange={(e) => onChange({ ...filters, axis: e.target.value || null })}
            className={selectBase}
          >
            <option value="">Tous</option>
            {RESEARCH_AXES.map((a) => (<option key={a} value={a}>{a}</option>))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label htmlFor="doc-region" className="mb-1.5 block text-xs font-medium text-foreground">Région</label>
          <select
            id="doc-region"
            value={filters.region ?? ""}
            onChange={(e) => onChange({ ...filters, region: e.target.value || null })}
            className={selectBase}
          >
            <option value="">Toutes</option>
            {REGIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
          </select>
        </div>
      </div>

      {/* Active badges */}
      {hasActive && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
          <span className="text-xs text-muted-foreground">Filtres actifs :</span>
          {filters.query && <Badge label={`"${filters.query}"`} onRemove={() => onChange({ ...filters, query: "" })} />}
          {filters.year && <Badge label={String(filters.year)} onRemove={() => onChange({ ...filters, year: null })} />}
          {filters.type && <Badge label={DOC_TYPE_LABELS[filters.type]} onRemove={() => onChange({ ...filters, type: null })} />}
          {filters.axis && <Badge label={filters.axis} onRemove={() => onChange({ ...filters, axis: null })} />}
          {filters.region && <Badge label={filters.region} onRemove={() => onChange({ ...filters, region: null })} />}
          <button onClick={reset} className="ml-auto text-xs font-medium text-[var(--inp-vert)] hover:underline">
            Tout effacer
          </button>
        </div>
      )}
    </div>
  );
}

function Badge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-[var(--inp-vert)]/20 bg-[var(--inp-vert)]/5 px-2.5 py-0.5 text-[11px] font-medium text-[var(--inp-vert)]")}>
      {label}
      <button onClick={onRemove} className="ml-0.5 rounded-full p-0.5 hover:bg-[var(--inp-vert)]/10 transition-colors" aria-label={`Retirer le filtre ${label}`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
