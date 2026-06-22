"use client";

import type { LucideIcon } from "lucide-react";
import {
  ClockIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  LayoutGridIcon,
  TypeIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GedFilterId } from "@/lib/utils/ged-filters";
import { cn } from "@/lib/utils";

const GED_FILTER_STYLES: Record<
  GedFilterId,
  { active: string; inactive: string; icon: string }
> = {
  all: {
    active: "border-primary bg-primary text-primary-foreground shadow-sm",
    inactive:
      "border-primary/25 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/40",
    icon: "text-primary",
  },
  folder: {
    active: "border-amber-500 bg-amber-500 text-white shadow-sm",
    inactive:
      "border-amber-500/30 bg-amber-500/10 text-amber-800 hover:bg-amber-500/15 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400",
  },
  file: {
    active: "border-sky-500 bg-sky-500 text-white shadow-sm",
    inactive:
      "border-sky-500/30 bg-sky-500/10 text-sky-800 hover:bg-sky-500/15 dark:text-sky-300",
    icon: "text-sky-600 dark:text-sky-400",
  },
  pdf: {
    active: "border-rose-500 bg-rose-500 text-white shadow-sm",
    inactive:
      "border-rose-500/30 bg-rose-500/10 text-rose-800 hover:bg-rose-500/15 dark:text-rose-300",
    icon: "text-rose-600 dark:text-rose-400",
  },
  image: {
    active: "border-violet-500 bg-violet-500 text-white shadow-sm",
    inactive:
      "border-violet-500/30 bg-violet-500/10 text-violet-800 hover:bg-violet-500/15 dark:text-violet-300",
    icon: "text-violet-600 dark:text-violet-400",
  },
  word: {
    active: "border-blue-600 bg-blue-600 text-white shadow-sm",
    inactive:
      "border-blue-600/30 bg-blue-600/10 text-blue-800 hover:bg-blue-600/15 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
  },
  excel: {
    active: "border-emerald-600 bg-emerald-600 text-white shadow-sm",
    inactive:
      "border-emerald-600/30 bg-emerald-600/10 text-emerald-800 hover:bg-emerald-600/15 dark:text-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  text: {
    active: "border-zinc-500 bg-zinc-500 text-white shadow-sm",
    inactive:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 hover:bg-zinc-500/15 dark:text-zinc-300",
    icon: "text-zinc-600 dark:text-zinc-400",
  },
  recent: {
    active: "border-orange-500 bg-orange-500 text-white shadow-sm",
    inactive:
      "border-orange-500/30 bg-orange-500/10 text-orange-800 hover:bg-orange-500/15 dark:text-orange-300",
    icon: "text-orange-600 dark:text-orange-400",
  },
};

const GED_FILTERS: {
  id: GedFilterId;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "all", label: "Tous", icon: LayoutGridIcon },
  { id: "folder", label: "Dossiers", icon: FolderIcon },
  { id: "file", label: "Fichiers", icon: FileIcon },
  { id: "pdf", label: "PDF", icon: FileTextIcon },
  { id: "image", label: "Images", icon: ImageIcon },
  { id: "word", label: "Word", icon: FileTextIcon },
  { id: "excel", label: "Excel", icon: FileSpreadsheetIcon },
  { id: "text", label: "Texte", icon: TypeIcon },
  { id: "recent", label: "Récents", icon: ClockIcon },
];

export function GedFilterBar({
  value,
  onChange,
}: {
  value: GedFilterId;
  onChange: (value: GedFilterId) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {GED_FILTERS.map((filter) => {
        const Icon = filter.icon;
        const active = value === filter.id;
        const styles = GED_FILTER_STYLES[filter.id];

        return (
          <Button
            key={filter.id}
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "h-8 shrink-0 gap-1.5 border px-2.5 text-xs transition-colors",
              active ? styles.active : styles.inactive,
            )}
            onClick={() => onChange(filter.id)}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5",
                active ? "text-inherit" : styles.icon,
              )}
            />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
