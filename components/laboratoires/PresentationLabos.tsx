"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  FlaskConical,
  Sprout,
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
  icon: LucideIcon;
  specialties: string[];
}

const LABS: Lab[] = [
  {
    title: "Laboratoire d'Analyse Physico-Chimique",
    description:
      "Analyses de texture, pH, capacité d'échange cationique, matière organique, éléments majeurs et traces. Capacité de traitement de plus de 3 000 échantillons par an.",
    icon: FlaskConical,
    specialties: ["Spectrométrie", "Granulométrie", "Conductivité", "Chromatographie"],
  },
  {
    title: "Laboratoire de Fertilité des Sols",
    description:
      "Évaluation de la fertilité chimique et biologique, recommandations de fertilisation, suivi des parcelles expérimentales et appui aux producteurs.",
    icon: Sprout,
    specialties: ["Azote total", "Phosphore assimilable", "Potassium", "Oligo-éléments"],
  },
  {
    title: "Laboratoire de Caractérisation Pédologique",
    description:
      "Classification des sols, micromorphologie, analyses minéralogiques et gestion de la pédothèque nationale de référence.",
    icon: Layers,
    specialties: ["Micromorphologie", "Classification WRB", "Minéralogie", "Coupes minces"],
  },
  {
    title: "Plateforme SIG & Data",
    description:
      "Systèmes d'information géographique, télédétection, cartographie numérique et gestion des bases de données pédologiques nationales.",
    icon: MapPinned,
    specialties: ["QGIS / ArcGIS", "Sentinel-2", "Bases géospatiales", "Modélisation"],
  },
  {
    title: "Unité de Recherche Terrain",
    description:
      "Équipes mobiles de prospection pédologique, sondages, profils de référence et prélèvements systématiques sur le territoire national.",
    icon: Tent,
    specialties: ["Sondages tarière", "Profils de sol", "GPS RTK", "Échantillonnage"],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PresentationLabos() {
  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="labos-list-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="labos-list-title"
          align="center"
          label="Nos unités"
          subtitle="Cinq entités techniques complémentaires couvrant l'ensemble de la chaîne analytique."
        >
          Présentation des laboratoires
        </SectionTitle>

        <div className="mt-14 space-y-6">
          {LABS.map((lab, i) => (
            <motion.article
              key={lab.title}
              className="group overflow-hidden rounded-2xl border border-[var(--inp-vert)]/15 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" as const }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Icon panel */}
                <div className="flex items-center justify-center bg-[var(--inp-vert)]/[0.05] p-6 sm:w-36 sm:flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)] transition-colors duration-300 group-hover:bg-[var(--inp-vert)] group-hover:text-white">
                    <lab.icon className="h-7 w-7" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 sm:p-7">
                  <h3 className="text-lg font-semibold text-foreground">{lab.title}</h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {lab.description}
                  </p>

                  {/* Specialties */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lab.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-[var(--inp-vert)]/[0.07] px-3 py-1 text-[11px] font-medium text-[var(--inp-vert)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
