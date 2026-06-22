"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CheckCircle2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const EQUIPMENTS = [
  "Spectromètre d'absorption atomique (AAS)",
  "Spectrophotomètre UV-Visible",
  "Analyseur granulométrique laser",
  "pH-mètre & conductimètre de précision",
  "Four à moufle & étuve de séchage",
  "Centrifugeuse haute vitesse",
  "Système Kjeldahl (azote total)",
  "Extracteur Soxhlet",
  "Microscope pétrographique",
  "Station GPS RTK différentiel",
];

interface Atout {
  value: string;
  label: string;
}

// Atouts qualitatifs (sans chiffre inventé). Les vrais volumes (échantillons/an,
// analyses/an…) pourront être réintroduits lorsque l'INP les communiquera.
const ATOUTS: Atout[] = [
  { value: "5", label: "Unités complémentaires" },
  { value: "Complète", label: "Chaîne analytique (de l'échantillon au rapport)" },
  { value: "Nationale", label: "Couverture du territoire" },
  { value: "De pointe", label: "Équipements scientifiques" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EquipementsCapacites() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="equip-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle id="equip-title" label="Moyens techniques">
          Équipements &amp; capacités
        </SectionTitle>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:items-start">
          {/* ── Left: equipment list ── */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-5">
              Équipements clés
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {EQUIPMENTS.map((eq, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" as const }}
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--inp-vert)]" />
                  <span className="text-sm text-muted-foreground">{eq}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── Right: counters ── */}
          <motion.div
            className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-base font-semibold text-foreground mb-6">
              Atouts de nos laboratoires
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {ATOUTS.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: "easeOut" as const }}
                >
                  <p className="text-2xl font-extrabold text-[var(--inp-vert)] sm:text-3xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
