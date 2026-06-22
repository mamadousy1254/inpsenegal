"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Handshake, Microscope, Landmark, Globe } from "lucide-react";

const PILLARS = [
  { icon: Handshake, label: "Collaboration interinstitutionnelle" },
  { icon: Microscope, label: "Synergie scientifique" },
  { icon: Landmark, label: "Appui aux politiques publiques" },
  { icon: Globe, label: "Coopération internationale" },
];

export function IntroPartenaires() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="intro-partenaires-title"
    >
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          id="intro-partenaires-title"
          align="center"
          label="Réseau stratégique"
        >
          Un Réseau de Coopération au Service de la Science des Sols
        </SectionTitle>

        <motion.p
          className="mx-auto mt-8 max-w-3xl text-center text-lg leading-[1.9] text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          L&apos;INP s&apos;appuie sur un{" "}
          <strong className="text-foreground">réseau solide d&apos;institutions</strong>,
          de{" "}
          <strong className="text-foreground">centres de recherche</strong>,
          d&apos;<strong className="text-foreground">universités</strong> et
          d&apos;<strong className="text-foreground">organisations internationales</strong>{" "}
          pour mener ses missions de recherche, de cartographie et d&apos;appui
          technique au service du développement agricole national.
        </motion.p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-5 text-center shadow-sm"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
                <p.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium leading-tight text-foreground">
                {p.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
