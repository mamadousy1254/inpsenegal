"use client";

import { Badge } from "@/components/ui/badge";
import {
  MISSION_TYPE_BADGE_STYLES,
  MISSION_TYPE_LABELS,
  type MissionType,
} from "@/lib/constants/mission";
import { cn } from "@/lib/utils";

export function MissionTypeBadge({
  type,
  className,
}: {
  type: MissionType;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        MISSION_TYPE_BADGE_STYLES[type],
        className,
      )}
    >
      {MISSION_TYPE_LABELS[type]}
    </Badge>
  );
}
