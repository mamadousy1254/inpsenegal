"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Globe,
  Wheat,
  Landmark,
  Banknote,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface IntlPartner {
  name: string;
  acronym: string;
  description: string;
  icon: LucideIcon;
  website?: string;
}

const PARTNERS: IntlPartner[] = [
  {
    name: "Organisation des Nations Unies pour l'alimentation et l'agriculture",
    acronym: "FAO",
    description:
      "Partenariat stratégique pour le Programme mondial des sols, le Partenariat africain pour les sols et l'Initiative Sols Durables 2024-2028.",
    icon: Wheat,
    website: "https://www.fao.org",
  },
  {
    name: "Banque Mondiale — Programme de productivité agricole en Afrique de l'Ouest",
    acronym: "PPAAO / Banque Mondiale",
    description:
      "Financement de projets de recherche et d'équipement des laboratoires de l'INP dans le cadre du PPAAO.",
    icon: Banknote,
    website: "https://www.worldbank.org",
  },
  {
    name: "Union Africaine — Programme africain des sols",
    acronym: "AfSP / UA",
    description:
      "Contribution à la cartographie continentale des sols et au réseau des laboratoires de référence africains.",
    icon: Globe,
    website: "https://au.int",
  },
  {
    name: "Agence Française de Développement",
    acronym: "AFD",
    description:
      "Cofinancement de programmes de restauration des sols dégradés et de renforcement des capacités analytiques.",
    icon: Landmark,
    website: "https://www.afd.fr",
  },
  {
    name: "CEDEAO — Commission de la CEDEAO",
    acronym: "CEDEAO",
    description:
      "Harmonisation des politiques foncières et des référentiels pédologiques à l'échelle sous-régionale.",
    icon: Globe,
    website: "https://ecowas.int",
  },
  {
    name: "GIZ — Coopération technique allemande",
    acronym: "GIZ",
    description:
      "Appui technique dans le cadre du programme Gestion durable des terres et restauration des paysages.",
    icon: Landmark,
    website: "https://www.giz.de",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PartenairesInternationaux() {
  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="intl-partners-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="intl-partners-title"
          align="center"
          label="Coopération mondiale"
          subtitle="Organisations régionales et internationales collaborant avec l'INP."
        >
          Partenaires techniques &amp; internationaux
        </SectionTitle>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((p, i) => (
            <motion.article
              key={p.acronym}
              className="group relative overflow-hidden rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              {/* Top accent bar on hover */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] bg-[var(--inp-vert)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--inp-vert)]">
                    {p.acronym}
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold leading-snug text-foreground line-clamp-2">
                    {p.name}
                  </h3>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {p.description}
              </p>

              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--inp-vert)] transition-colors hover:text-[var(--inp-vert)]/80"
                >
                  Site officiel <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
