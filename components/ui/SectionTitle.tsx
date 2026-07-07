"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FlagStar } from "@/components/FlagStar";

/* ------------------------------------------------------------------ */
/*  Reusable animated section title with underline                     */
/* ------------------------------------------------------------------ */

interface SectionTitleProps {
  /** The title text */
  children: React.ReactNode;
  /** HTML id for aria-labelledby */
  id?: string;
  /** Optional small label above the title */
  label?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Center or left-aligned */
  align?: "center" | "left";
  /** Light text variant (for dark backgrounds) */
  light?: boolean;
  /** Additional className on the wrapper */
  className?: string;
  /** Heading level tag — defaults to h2 */
  as?: "h1" | "h2" | "h3";
}

export function SectionTitle({
  children,
  id,
  label,
  subtitle,
  align = "left",
  light = false,
  className,
  as: Tag = "h2",
}: SectionTitleProps) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "text-center", className)}>
      {/* Small label */}
      {label && (
        <motion.p
          className={cn(
            "text-sm font-medium uppercase tracking-widest mb-2",
            light ? "text-white/60" : "text-inp-marron"
          )}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
        >
          {label}
        </motion.p>
      )}

      {/* Title + animated underline */}
      <motion.div
        className={cn("relative inline-block", centered && "mx-auto")}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <Tag
          id={id}
          className={cn(
            "text-3xl font-bold tracking-tight sm:text-4xl",
            light ? "text-white" : "text-primary"
          )}
        >
          {children}
        </Tag>

        {/* Animated underline — Senegal flag colors + shimmer + étoile */}
        <span className="relative mt-3 block">
          <motion.span
            className="block h-[3px] rounded-full relative overflow-hidden section-title-line"
            style={{
              background: "linear-gradient(90deg, #00853F 0%, #00853F 33%, #FDEF42 33%, #FDEF42 66%, #E31B23 66%, #E31B23 100%)",
              originX: centered ? 0.5 : 0,
            } as React.CSSProperties}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            aria-hidden
          >
            {/* Shimmer sweep */}
            <span className="section-title-shimmer" aria-hidden />
          </motion.span>
          {/* Étoile verte du drapeau, centrée sur la bande jaune */}
          <FlagStar size={13} />
        </span>
      </motion.div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className={cn(
            "mt-4 max-w-2xl text-base",
            centered && "mx-auto",
            light ? "text-white/80" : "text-muted-foreground"
          )}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
