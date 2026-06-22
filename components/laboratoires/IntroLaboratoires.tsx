"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FlaskConical, Sprout, Microscope, Landmark } from "lucide-react";

const ROLES = [
  { icon: FlaskConical, label: "Analyse physico-chimique" },
  { icon: Microscope, label: "Caractérisation des sols" },
  { icon: Sprout, label: "Recherche appliquée" },
  { icon: Landmark, label: "Appui aux politiques agricoles" },
];

export function IntroLaboratoires() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="intro-labos-title"
    >
      <div className="container mx-auto max-w-5xl">
        <SectionTitle id="intro-labos-title" align="center" label="Infrastructures scientifiques">
          Des laboratoires au service de la science des sols
        </SectionTitle>

        <motion.p
          className="mx-auto mt-8 max-w-3xl text-center text-lg leading-[1.9] text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Les laboratoires de l&apos;INP constituent le{" "}
          <strong className="text-foreground">socle technique</strong> de l&apos;ensemble
          des activités de recherche, de cartographie et d&apos;expertise de
          l&apos;Institut. Ils offrent des{" "}
          <strong className="text-foreground">capacités analytiques de référence</strong>{" "}
          pour l&apos;étude des sols du Sénégal.
        </motion.p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ROLES.map((r, i) => (
            <motion.div
              key={r.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-5 shadow-sm text-center"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease: "easeOut" as const }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
                <r.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-foreground leading-tight">{r.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
