"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Building2,
  Microscope,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface OrgUnit {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
}

const UNITS: OrgUnit[] = [
  {
    title: "Direction Générale",
    description:
      "Pilotage stratégique, coordination interinstitutionnelle et représentation de l'INP auprès des ministères et partenaires.",
    icon: Building2,
    items: [
      "Cabinet du Directeur Général",
      "Secrétariat Général",
      "Cellule de communication",
      "Cellule de planification",
    ],
  },
  {
    title: "Directions Techniques",
    description:
      "Conduite des activités scientifiques, cartographiques et d'appui technique aux politiques publiques.",
    icon: Settings,
    items: [
      "Direction de la Recherche",
      "Direction de la Cartographie",
      "Direction de l'Appui Technique",
      "Direction des Projets",
    ],
  },
  {
    title: "Laboratoires",
    description:
      "Analyses scientifiques de pointe pour l'étude des sols, leur composition et leur dynamique.",
    icon: Microscope,
    items: [
      "Analyses physico-chimiques",
      "Microbiologie des sols",
      "Fertilité & nutrition",
      "Télédétection & SIG",
      "Minéralogie",
    ],
  },
  {
    title: "Services Administratifs",
    description:
      "Gestion des ressources humaines, financières et logistiques de l'Institut.",
    icon: Users,
    items: [
      "Ressources humaines",
      "Finances & comptabilité",
      "Logistique & patrimoine",
      "Système d'information",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Organisation() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="organisation-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="organisation-title"
          align="center"
          label="Structure"
          subtitle="L'INP est organisé en directions et services complémentaires pour couvrir l'ensemble de ses missions."
        >
          Organisation
        </SectionTitle>

        {/* Cards grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {UNITS.map((unit, i) => (
            <motion.div
              key={unit.title}
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
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)] transition-colors group-hover:bg-[var(--inp-vert)] group-hover:text-white">
                <unit.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {unit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {unit.description}
              </p>

              {/* Items list */}
              <ul className="mt-4 space-y-1.5">
                {unit.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--inp-vert)]/40"
                      aria-hidden
                    />
                    {item}
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
