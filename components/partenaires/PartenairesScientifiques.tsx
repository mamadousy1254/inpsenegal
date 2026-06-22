"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  GraduationCap,
  Microscope,
  Server,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type PartnerType = "Académique" | "Recherche" | "Technique";

const TYPE_STYLES: Record<PartnerType, string> = {
  Académique: "bg-blue-50 text-blue-700 border-blue-200",
  Recherche: "bg-amber-50 text-amber-700 border-amber-200",
  Technique: "bg-violet-50 text-violet-700 border-violet-200",
};

interface SciPartner {
  name: string;
  description: string;
  type: PartnerType;
  icon: LucideIcon;
  website?: string;
}

const PARTNERS: SciPartner[] = [
  {
    name: "Institut de Recherche pour le Développement (IRD)",
    description:
      "Collaboration de longue date en pédologie tropicale, co-encadrement de thèses et accès aux bases de données AMMA-CATCH.",
    type: "Recherche",
    icon: Microscope,
    website: "https://www.ird.fr",
  },
  {
    name: "CIRAD — Centre de coopération internationale en recherche agronomique",
    description:
      "Partenariat sur l'agroécologie, la modélisation de la fertilité des sols et les systèmes de culture durables en zone sahélienne.",
    type: "Recherche",
    icon: Microscope,
    website: "https://www.cirad.fr",
  },
  {
    name: "Université de Wageningen (WUR)",
    description:
      "Échanges scientifiques, programmes de formation en Digital Soil Mapping et accueil de chercheurs sénégalais.",
    type: "Académique",
    icon: GraduationCap,
    website: "https://www.wur.nl",
  },
  {
    name: "ISRIC — World Soil Information",
    description:
      "Référencement des données pédologiques sénégalaises dans le World Soil Information Service (WoSIS) et harmonisation WRB.",
    type: "Technique",
    icon: Server,
    website: "https://www.isric.org",
  },
  {
    name: "Université Polytechnique de Thiès (UPT)",
    description:
      "Formation d'ingénieurs en science du sol, co-supervision de mémoires et stages de terrain au sein des laboratoires INP.",
    type: "Académique",
    icon: GraduationCap,
  },
  {
    name: "INRAE — Institut national de recherche pour l'agriculture",
    description:
      "Collaboration sur les indicateurs biologiques de qualité des sols et le suivi à long terme des sites de référence.",
    type: "Recherche",
    icon: Microscope,
    website: "https://www.inrae.fr",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PartenairesScientifiques() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="sci-partners-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="sci-partners-title"
          align="center"
          label="Recherche & universités"
          subtitle="Institutions scientifiques et académiques contribuant aux programmes de recherche de l'INP."
        >
          Partenaires scientifiques &amp; académiques
        </SectionTitle>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((p, i) => (
            <motion.article
              key={p.name}
              className="group flex flex-col rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)] transition-colors duration-300 group-hover:bg-[var(--inp-vert)] group-hover:text-white">
                  <p.icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                    TYPE_STYLES[p.type]
                  )}
                >
                  {p.type}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-semibold leading-snug text-foreground">
                {p.name}
              </h3>

              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                {p.description}
              </p>

              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--inp-vert)] transition-colors hover:text-[var(--inp-vert)]/80"
                >
                  Visiter le site <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
