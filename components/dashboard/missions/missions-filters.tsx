"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MISSION_STATUSES,
  MISSION_STATUS_LABELS,
  MISSION_TYPES,
  MISSION_TYPE_LABELS,
} from "@/lib/constants/mission";

export type MissionsFiltersState = {
  search: string;
  status: string;
  type: string;
  region: string;
  direction: string;
  dateFrom: string;
  dateTo: string;
};

type MissionsFiltersProps = {
  filters: MissionsFiltersState;
  onChange: (patch: Partial<MissionsFiltersState>) => void;
  showDirectionFilter?: boolean;
  hideDateFilters?: boolean;
};

export function MissionsFilters({
  filters,
  onChange,
  showDirectionFilter = false,
  hideDateFilters = false,
}: MissionsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:min-w-[200px] sm:flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Rechercher numéro, objet, lieu, agent…"
          className="pl-9"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ status: value ?? "all" })}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {MISSION_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {MISSION_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) => onChange({ type: value ?? "all" })}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          {MISSION_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {MISSION_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={filters.region}
        onChange={(e) => onChange({ region: e.target.value })}
        placeholder="Région"
        className="w-full sm:w-40"
      />

      {showDirectionFilter && (
        <Input
          value={filters.direction}
          onChange={(e) => onChange({ direction: e.target.value })}
          placeholder="Direction"
          className="w-full sm:w-44"
        />
      )}

      {!hideDateFilters && (
        <>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            className="w-full sm:w-44"
            aria-label="Date de départ à partir du"
          />

          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            className="w-full sm:w-44"
            aria-label="Date de départ jusqu'au"
          />
        </>
      )}
    </div>
  );
}
