"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function VisionScientifique() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="vision-title"
    >
      <div className="container mx-auto max-w-4xl text-center">
        <SectionTitle id="vision-title" align="center" label="Stratégie">
          Notre Vision Scientifique
        </SectionTitle>

        <motion.div
          className="mt-8 space-y-5 text-lg leading-[1.9] text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p>
            L&apos;INP développe une{" "}
            <strong className="text-foreground">stratégie de recherche intégrée</strong>{" "}
            qui couvre l&apos;ensemble des problématiques liées aux sols : de la{" "}
            <strong className="text-foreground">caractérisation fondamentale</strong>{" "}
            à l&apos;application sur le terrain, en passant par la modélisation
            spatiale et le{" "}
            <strong className="text-foreground">suivi environnemental</strong>.
          </p>
          <p>
            Notre ambition est de fournir les bases scientifiques nécessaires
            à une gestion durable des ressources en sols, au service de la{" "}
            <strong className="text-foreground">souveraineté alimentaire</strong>{" "}
            et de la résilience des écosystèmes agricoles sénégalais.
          </p>
        </motion.div>

        {/* Citation */}
        <motion.blockquote
          className="relative mx-auto mt-12 max-w-2xl rounded-2xl border border-[var(--inp-vert)]/15 bg-white px-8 py-7 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span
            className="absolute -top-4 left-6 text-5xl leading-none text-[var(--inp-beige)] select-none"
            aria-hidden
          >
            &ldquo;
          </span>
          <p
            className="text-xl italic text-[var(--inp-marron)] sm:text-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            La connaissance des sols est le fondement d&apos;une agriculture durable.
          </p>
          <footer className="mt-4 text-sm font-medium text-muted-foreground">
            — Institut national de Pédologie
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
