"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Microscope,
  Layers,
  MapPinned,
  Tent,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Lab {
  title: string;
  description: string;
  capabilities: string[];
  icon: LucideIcon;
}

const LABS: Lab[] = [
  {
    title: "Laboratoire d'analyse physico-chimique",
    description:
      "Analyses de texture, pH, matière organique, capacité d'échange cationique, éléments minéraux et oligo-éléments.",
    capabilities: ["Spectrométrie", "Granulométrie", "Chromatographie", "pH & conductivité"],
    icon: Microscope,
  },
  {
    title: "Laboratoire pédologique",
    description:
      "Classification des sols, études morphologiques, préparation des échantillons et archivage de la pédothèque nationale.",
    capabilities: ["Micromorphologie", "Classification WRB", "Pédothèque nationale", "Coupes minces"],
    icon: Layers,
  },
  {
    title: "Plateforme SIG & télédétection",
    description:
      "Traitement d'images satellites, cartographie numérique, modélisation spatiale et bases de données géoréférencées.",
    capabilities: ["Images Sentinel-2", "QGIS & ArcGIS", "Modélisation spatiale", "Bases géospatiales"],
    icon: MapPinned,
  },
  {
    title: "Unité de recherche terrain",
    description:
      "Équipes mobiles de prospection, sondages pédologiques, prélèvements et profils de référence sur l'ensemble du territoire.",
    capabilities: ["Sondages tarière", "Profils de sol", "GPS différentiel", "Prospection nationale"],
    icon: Tent,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function LaboratoiresSection() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      aria-labelledby="labos-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="labos-title"
          align="center"
          label="Infrastructures"
          subtitle="Des plateformes techniques de pointe au service de la recherche et de l'expertise."
        >
          Laboratoires &amp; plateformes
        </SectionTitle>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {LABS.map((lab, i) => (
            <motion.div
              key={lab.title}
              className="group rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.08,
                ease: "easeOut" as const,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)] transition-colors duration-300 group-hover:bg-[var(--inp-vert)] group-hover:text-white">
                <lab.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {lab.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {lab.description}
              </p>

              {/* Capabilities tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {lab.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-full bg-[var(--inp-vert)]/[0.07] px-3 py-1 text-[11px] font-medium text-[var(--inp-vert)]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
