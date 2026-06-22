"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Newspaper, CalendarDays, Handshake, Lightbulb } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Newspaper, label: "Communications officielles" },
  { icon: CalendarDays, label: "Événements & ateliers" },
  { icon: Handshake, label: "Partenariats stratégiques" },
  { icon: Lightbulb, label: "Projets & innovations" },
];

export function IntroActualites() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="intro-actu-title"
    >
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          id="intro-actu-title"
          align="center"
          label="Vie institutionnelle"
        >
          Actualités &amp; Événements
        </SectionTitle>

        <motion.p
          className="mx-auto mt-8 max-w-3xl text-center text-lg leading-[1.9] text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Suivez les{" "}
          <strong className="text-foreground">activités</strong>,{" "}
          <strong className="text-foreground">événements</strong>,{" "}
          <strong className="text-foreground">projets</strong> et{" "}
          <strong className="text-foreground">
            communications officielles
          </strong>{" "}
          de l&apos;Institut national de Pédologie.
        </motion.p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-5 text-center shadow-sm"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
                <h.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium leading-tight text-foreground">
                {h.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
