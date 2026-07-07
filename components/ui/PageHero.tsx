"use client";

import { motion } from "framer-motion";
import { FlagStar } from "@/components/FlagStar";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  label?: string;
}

export function PageHero({ title, subtitle, label }: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-[var(--inp-vert)] py-20 sm:py-24 lg:py-28"
    >
      {/* Geometric texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="container mx-auto max-w-6xl px-4 text-center">
        {label && (
          <motion.p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {label}
          </motion.p>
        )}
        <motion.h1
          className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        {/* Flag line + étoile centrée sur la bande jaune */}
        <span className="relative mx-auto mt-5 block w-24 sm:w-32">
          <motion.span
            className="block h-[3px] w-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #00853F 0%, #00853F 33%, #FDEF42 33%, #FDEF42 66%, #E31B23 66%, #E31B23 100%)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            aria-hidden
          />
          <FlagStar size={14} />
        </span>
        {subtitle && (
          <motion.p
            className="mx-auto mt-5 max-w-2xl text-base text-white/75 sm:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
