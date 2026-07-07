"use client";

import { useMemo, useState, type ReactNode } from "react";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CmsSortOrder = "date-desc" | "date-asc" | "title-asc";

const SORT_LABELS: Record<CmsSortOrder, string> = {
  "date-desc": "Plus récent",
  "date-asc": "Plus ancien",
  "title-asc": "Titre (A → Z)",
};

type FilterAccessors<T> = {
  /** Texte utilisé pour la recherche + le tri alphabétique. */
  getTitle: (item: T) => string;
  /** Date ISO utilisée pour le filtre par année + le tri par date. */
  getDate: (item: T) => string | undefined;
};

/**
 * Filtre/tri côté client réutilisable pour les listes du CMS :
 * recherche par titre, filtre par année de publication et tri par date.
 */
export function useCmsListFilters<T>(items: T[], accessors: FilterAccessors<T>) {
  const { getTitle, getDate } = accessors;
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<CmsSortOrder>("date-desc");

  const years = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      const raw = getDate(item);
      if (!raw) continue;
      const y = new Date(raw).getFullYear();
      if (!Number.isNaN(y)) set.add(String(y));
    }
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [items, getDate]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = items.filter((item) => {
      if (query && !getTitle(item).toLowerCase().includes(query)) return false;
      if (year !== "all") {
        const raw = getDate(item);
        if (!raw) return false;
        if (String(new Date(raw).getFullYear()) !== year) return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      if (sort === "title-asc") {
        return getTitle(a).localeCompare(getTitle(b), "fr");
      }
      const da = getDate(a) ? new Date(getDate(a)!).getTime() : 0;
      const db = getDate(b) ? new Date(getDate(b)!).getTime() : 0;
      return sort === "date-asc" ? da - db : db - da;
    });
  }, [items, search, year, sort, getTitle, getDate]);

  return { search, setSearch, year, setYear, sort, setSort, years, filtered };
}

type CmsListFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
  years: string[];
  sort: CmsSortOrder;
  onSortChange: (value: CmsSortOrder) => void;
  searchPlaceholder?: string;
  className?: string;
};

export function CmsListFilters({
  search,
  onSearchChange,
  year,
  onYearChange,
  years,
  sort,
  onSortChange,
  searchPlaceholder = "Rechercher par titre…",
  className,
}: CmsListFiltersProps) {
  const yearItems: Record<string, ReactNode> = {
    all: "Toutes les années",
    ...Object.fromEntries(years.map((y) => [y, y])),
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="relative w-full sm:w-[240px]">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8"
        />
      </div>

      <Select value={year} onValueChange={onYearChange} items={yearItems}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les années</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(value) => onSortChange(value as CmsSortOrder)}
        items={SORT_LABELS}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trier" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(SORT_LABELS) as CmsSortOrder[]).map((value) => (
            <SelectItem key={value} value={value}>
              {SORT_LABELS[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
