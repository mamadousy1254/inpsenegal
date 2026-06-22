"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CheckCircle2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const OPERATIONS = [
  "Réalisation d'études pédologiques de terrain sur l'ensemble du territoire",
  "Analyses physico-chimiques et microbiologiques en laboratoire",
  "Classification et caractérisation des types de sols",
  "Élaboration de cartes agro-écologiques et de fertilité",
  "Production de rapports techniques et de fiches pédologiques",
  "Suivi de la qualité et de la dégradation des sols",
  "Assistance technique aux collectivités locales et partenaires",
  "Appui aux projets de développement agricole et environnemental",
];

const STATS = [
  { value: "14", label: "Régions couvertes" },
  { value: "12 000+", label: "Profils pédologiques" },
  { value: "5", label: "Laboratoires actifs" },
  { value: "200+", label: "Rapports produits" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MissionsOperationnelles() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="missions-op-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="missions-op-title"
          label="Sur le terrain"
        >
          Missions opérationnelles
        </SectionTitle>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:items-start">
          {/* ── Left: checklist ── */}
          <ul className="space-y-4">
            {OPERATIONS.map((op, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: "easeOut" as const,
                }}
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--inp-vert)]" />
                <span className="text-[0.95rem] leading-relaxed text-muted-foreground">
                  {op}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* ── Right: stats block ── */}
          <motion.div
            className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              En chiffres
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.08,
                    ease: "easeOut" as const,
                  }}
                >
                  <p className="text-2xl font-bold text-[var(--inp-vert)] sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
