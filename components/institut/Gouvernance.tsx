"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  ShieldCheck,
  Users,
  Scale,
  FileText,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface GovCard {
  title: string;
  description: string;
  icon: LucideIcon;
  details: string[];
  accent?: boolean;
}

const GOV_CARDS: GovCard[] = [
  {
    title: "Tutelle ministérielle",
    description:
      "L'INP est placé sous la tutelle du Ministère de l'Agriculture, de l'Équipement Rural et de la Souveraineté Alimentaire.",
    icon: ShieldCheck,
    details: [
      "Supervision stratégique de l'État",
      "Alignement sur les politiques agricoles nationales",
      "Validation des orientations scientifiques",
      "Dotation budgétaire annuelle",
    ],
    accent: true,
  },
  {
    title: "Conseil d'Administration",
    description:
      "Organe délibérant composé de représentants de l'État, du secteur privé et de la communauté scientifique.",
    icon: Users,
    details: [
      "Approbation du budget et du plan d'action",
      "Nominations et orientations stratégiques",
      "Évaluation des performances",
      "Représentation multi-sectorielle",
    ],
  },
  {
    title: "Direction Générale",
    description:
      "Organe exécutif assurant la gestion quotidienne, la coordination des activités et la mise en œuvre des décisions du Conseil.",
    icon: Scale,
    details: [
      "Gestion administrative et financière",
      "Coordination des programmes de recherche",
      "Relations institutionnelles et partenariats",
      "Rapport annuel au Conseil d'Administration",
    ],
  },
  {
    title: "Cadre juridique",
    description:
      "L'INP est régi par un ensemble de textes législatifs et réglementaires qui définissent son statut, ses missions et son fonctionnement.",
    icon: FileText,
    details: [
      "Décret de création et d'organisation",
      "Statut d'établissement public scientifique",
      "Règlement intérieur",
      "Conventions de partenariat cadre",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Gouvernance() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      aria-labelledby="gouvernance-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="gouvernance-title"
          align="center"
          label="Cadre institutionnel"
          subtitle="Une gouvernance transparente au service de l'intérêt public et de l'excellence scientifique."
        >
          Gouvernance
        </SectionTitle>

        {/* Grid: 2 top + 2 bottom */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {GOV_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className={`group relative overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                card.accent
                  ? "border-[var(--inp-vert)]/30 bg-[var(--inp-vert)]/[0.03]"
                  : "border-border/60 bg-white"
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.08,
                ease: "easeOut" as const,
              }}
            >
              {/* Bande drapeau Sénégal en bordure haute (bandes égales + étoile verte centrée) */}
              {card.accent && (
                <div className="absolute inset-x-0 top-0 flex h-1.5" aria-hidden>
                  <span className="flex-1 bg-[#00853F]" />
                  <span className="relative flex-1 bg-[#FDEF42]">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00853F] text-[9px] leading-none">
                      ★
                    </span>
                  </span>
                  <span className="flex-1 bg-[#E31B23]" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  card.accent
                    ? "bg-[var(--inp-vert)] text-white"
                    : "bg-[var(--inp-vert)]/10 text-[var(--inp-vert)] group-hover:bg-[var(--inp-vert)] group-hover:text-white"
                }`}
              >
                <card.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>

              {/* Details list */}
              <ul className="mt-5 space-y-2 border-t border-border/50 pt-5">
                {card.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span
                      className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--inp-vert)]/10"
                      aria-hidden
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--inp-vert)]" />
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
