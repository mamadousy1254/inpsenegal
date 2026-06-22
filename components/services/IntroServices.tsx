"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FlaskConical, Map, FileBarChart, Handshake } from "lucide-react";

const PILLARS = [
  { icon: FlaskConical, label: "Analyse des sols" },
  { icon: Map, label: "Cartographie pédologique" },
  { icon: FileBarChart, label: "Études & rapports" },
  { icon: Handshake, label: "Appui technique" },
];

export function IntroServices() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="intro-services-title"
    >
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          id="intro-services-title"
          align="center"
          label="Offre institutionnelle"
        >
          Une expertise scientifique au service du développement agricole
        </SectionTitle>

        <motion.p
          className="mx-auto mt-8 max-w-3xl text-center text-lg leading-[1.9] text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          L&apos;INP met à disposition des{" "}
          <strong className="text-foreground">institutions publiques</strong>,{" "}
          <strong className="text-foreground">collectivités</strong>,{" "}
          <strong className="text-foreground">partenaires internationaux</strong> et{" "}
          <strong className="text-foreground">acteurs agricoles</strong> un catalogue
          complet de prestations scientifiques et techniques couvrant l&apos;ensemble
          de la chaîne de valeur pédologique.
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
