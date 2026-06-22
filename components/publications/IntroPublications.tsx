"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BookOpen, Landmark, Microscope, Globe } from "lucide-react";

const PILLARS = [
  { icon: BookOpen, label: "Diffusion des connaissances" },
  { icon: Landmark, label: "Appui aux politiques publiques" },
  { icon: Microscope, label: "Recherche appliquée" },
  { icon: Globe, label: "Contribution scientifique nationale" },
];

export function IntroPublications() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="intro-pub-title"
    >
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          id="intro-pub-title"
          align="center"
          label="Bibliothèque scientifique"
        >
          Productions Scientifiques &amp; Techniques
        </SectionTitle>

        <motion.p
          className="mx-auto mt-8 max-w-3xl text-center text-lg leading-[1.9] text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          L&apos;INP publie chaque année des{" "}
          <strong className="text-foreground">rapports techniques</strong>,{" "}
          <strong className="text-foreground">articles scientifiques</strong>,{" "}
          <strong className="text-foreground">études nationales</strong> et{" "}
          <strong className="text-foreground">fiches de référence</strong> qui
          contribuent à la diffusion des savoirs pédologiques et à
          l&apos;élaboration de politiques agricoles fondées sur la science.
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
