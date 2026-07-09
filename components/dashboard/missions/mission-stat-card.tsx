"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MissionStatCard({
  label,
  value,
  hint,
  icon,
  iconClass,
  gradientClass,
  borderClass,
  delay = 0,
}: {
  label: string;
  value: number | string;
  hint: string;
  icon: React.ReactNode;
  iconClass: string;
  gradientClass: string;
  borderClass: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md",
        gradientClass,
        borderClass,
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl ring-1 ring-inset",
            iconClass,
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
