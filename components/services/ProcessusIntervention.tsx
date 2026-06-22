"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Send,
  Search,
  FlaskConical,
  FileCheck,
  HeartHandshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    number: 1,
    title: "Demande officielle",
    description:
      "Soumission de votre demande via formulaire, courrier ou contact direct avec nos équipes.",
    icon: Send,
  },
  {
    number: 2,
    title: "Étude préliminaire",
    description:
      "Analyse du contexte, cadrage des besoins et élaboration d'une proposition technique et financière.",
    icon: Search,
  },
  {
    number: 3,
    title: "Analyse technique",
    description:
      "Réalisation des travaux : prospection terrain, prélèvements, analyses en laboratoire, traitements SIG.",
    icon: FlaskConical,
  },
  {
    number: 4,
    title: "Rapport & recommandations",
    description:
      "Livraison d'un rapport complet avec résultats, interprétations et recommandations opérationnelles.",
    icon: FileCheck,
  },
  {
    number: 5,
    title: "Suivi & accompagnement",
    description:
      "Accompagnement post-livraison, formation des équipes et suivi de la mise en œuvre des recommandations.",
    icon: HeartHandshake,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProcessusIntervention() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="processus-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="processus-title"
          align="center"
          label="Notre démarche"
          subtitle="Un processus rigoureux en 5 étapes pour garantir la qualité de chaque intervention."
        >
          Processus d&apos;intervention
        </SectionTitle>

        {/* ── Desktop: horizontal timeline ── */}
        <div className="mt-16 hidden lg:block">
          {/* Connector line */}
          <div className="relative mx-auto max-w-5xl">
            <motion.div
              className="absolute left-0 right-0 top-6 h-[2px] bg-[var(--inp-vert)]/20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              style={{ originX: 0 }}
              aria-hidden
            />

            <div className="grid grid-cols-5 gap-4">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
                >
                  {/* Numbered dot */}
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--inp-vert)] text-white shadow-md ring-4 ring-white">
                    <step.icon className="h-5 w-5" />
                  </div>

                  <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-[var(--inp-vert)]">
                    Étape {step.number}
                  </span>
                  <h3 className="mt-1.5 text-sm font-semibold text-foreground leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile / Tablet: vertical timeline ── */}
        <div className="mt-12 lg:hidden">
          <div className="relative ml-6 border-l-2 border-[var(--inp-vert)]/20 pl-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative pb-10 last:pb-0"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                {/* Dot on line */}
                <div className="absolute -left-[calc(2rem+1px)] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--inp-vert)] text-white shadow ring-4 ring-white">
                  <step.icon className="h-4 w-4" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--inp-vert)]">
                  Étape {step.number}
                </span>
                <h3 className="mt-1 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
