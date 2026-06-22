"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  ShieldCheck,
  Globe,
  ClipboardCheck,
  Award,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Standard {
  title: string;
  description: string;
  icon: LucideIcon;
  badges: string[];
}

const STANDARDS: Standard[] = [
  {
    title: "Normes nationales",
    description:
      "Conformité aux normes sénégalaises en vigueur pour l'analyse et la classification des sols, intégrant les directives du Ministère de l'Agriculture.",
    icon: ShieldCheck,
    badges: ["Normes ISRA/INP", "Référentiel national"],
  },
  {
    title: "Référentiels internationaux",
    description:
      "Alignement sur les standards FAO, WRB (World Reference Base) et les méthodologies USDA Soil Taxonomy pour la caractérisation pédologique.",
    icon: Globe,
    badges: ["FAO/WRB", "USDA Soil Taxonomy", "ISO 11464"],
  },
  {
    title: "Procédures qualité",
    description:
      "Protocoles analytiques documentés, double vérification des résultats, calibration régulière des instruments et traçabilité complète des échantillons.",
    icon: ClipboardCheck,
    badges: ["Traçabilité intégrale", "Double vérification", "Étalonnage régulier des instruments"],
  },
  {
    title: "Assurance qualité",
    description:
      "L'INP met en place une démarche qualité — protocoles documentés, double vérification des résultats, étalonnage régulier et traçabilité complète des échantillons — inspirée des principes ISO/IEC 17025.",
    icon: Award,
    badges: ["Contrôles qualité internes", "Principes ISO/IEC 17025", "Audit régulier"],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MethodologiesNormes() {
  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="normes-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="normes-title"
          align="center"
          label="Rigueur scientifique"
          subtitle="Les laboratoires de l'INP s'appuient sur des méthodologies éprouvées et des normes reconnues."
        >
          Méthodologies &amp; normes
        </SectionTitle>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {STANDARDS.map((std, i) => (
            <motion.article
              key={std.title}
              className="group relative overflow-hidden rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" as const }}
            >
              {/* Accent top bar */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, #00853F 0%, #00853F 33%, #FDEF42 33%, #FDEF42 66%, #E31B23 66%, #E31B23 100%)",
                }}
                aria-hidden
              />

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)] transition-colors duration-300 group-hover:bg-[var(--inp-vert)] group-hover:text-white">
                  <std.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">{std.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {std.description}
                  </p>

                  {/* Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {std.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--inp-vert)]/20 bg-[var(--inp-vert)]/5 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--inp-vert)]"
                      >
                        <ShieldCheck className="h-3 w-3" aria-hidden />
                        {b}
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
