"use client";

import { Badge } from "@/components/ui/badge";
import {
  MISSION_STATUS_BADGE_STYLES,
  MISSION_STATUS_LABELS,
  type MissionStatus,
} from "@/lib/constants/mission";
import { cn } from "@/lib/utils";

export function MissionStatusBadge({
  status,
  className,
}: {
  status: MissionStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        MISSION_STATUS_BADGE_STYLES[status],
        className,
      )}
    >
      {MISSION_STATUS_LABELS[status]}
    </Badge>
  );
}
