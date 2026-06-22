"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MapPinned, Wheat, TreePine, Landmark } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Wheat, label: "Planification agricole" },
  { icon: TreePine, label: "Gestion durable des terres" },
  { icon: MapPinned, label: "Aménagement du territoire" },
  { icon: Landmark, label: "Aide à la décision publique" },
];

export function IntroCartographie() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="intro-carto-title"
    >
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          id="intro-carto-title"
          align="center"
          label="Données territoriales"
        >
          Système National de Cartographie des Sols
        </SectionTitle>

        <motion.p
          className="mx-auto mt-8 max-w-3xl text-center text-lg leading-[1.9] text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          L&apos;INP opère le{" "}
          <strong className="text-foreground">
            système national de cartographie pédologique
          </strong>
          , un outil stratégique pour la connaissance des sols à l&apos;échelle du
          territoire sénégalais. Ces données constituent un{" "}
          <strong className="text-foreground">patrimoine scientifique national</strong>{" "}
          au service du développement.
        </motion.p>

        {/* Highlight badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.label}
              className="flex items-center gap-2.5 rounded-full border border-[var(--inp-vert)]/15 bg-white px-5 py-2.5 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: 0.15 + i * 0.07,
                ease: "easeOut" as const,
              }}
            >
              <h.icon className="h-4 w-4 text-[var(--inp-vert)]" />
              <span className="text-sm font-medium text-foreground">
                {h.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
