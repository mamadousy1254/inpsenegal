"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRight, Calendar, User } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Status = "en_cours" | "termine" | "partenariat";

interface Project {
  title: string;
  lead: string;
  year: string;
  status: Status;
  description: string;
}

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string }> = {
  en_cours: { label: "En cours", bg: "bg-amber-100", text: "text-amber-800" },
  termine: { label: "Terminé", bg: "bg-gray-100", text: "text-gray-700" },
  partenariat: { label: "En partenariat", bg: "bg-amber-100", text: "text-amber-800" },
};

const PROJECTS: Project[] = [
  {
    title: "Cartographie numérique des sols de la Casamance",
    lead: "Dr. Amadou Diallo",
    year: "2024 – 2026",
    status: "en_cours",
    description:
      "Réalisation d'une carte pédologique à l'échelle 1/50 000 de la région de la Casamance, intégrant télédétection et relevés de terrain.",
  },
  {
    title: "Impact du changement climatique sur la salinisation des sols",
    lead: "Dr. Fatou Sow",
    year: "2023 – 2025",
    status: "en_cours",
    description:
      "Évaluation de l'évolution de la salinisation dans le bassin arachidier et les Niayes, et proposition de mesures d'adaptation.",
  },
  {
    title: "Référentiel national de fertilité des sols",
    lead: "Pr. Moussa Ndiaye",
    year: "2022 – 2024",
    status: "termine",
    description:
      "Élaboration d'un référentiel national de fertilité basé sur l'analyse de plus de 5 000 échantillons couvrant les 14 régions.",
  },
  {
    title: "SIG participatif pour l'agriculture familiale",
    lead: "Dr. Ibrahima Fall",
    year: "2024 – 2027",
    status: "partenariat",
    description:
      "Développement d'une plateforme SIG collaborative avec la FAO pour appuyer les exploitations familiales dans la gestion de la fertilité.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProjetsEnCours() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="projets-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="projets-title"
          align="center"
          label="Programmes actifs"
          subtitle="Des projets de recherche concrets, structurés et orientés vers l'impact national."
        >
          Projets en cours
        </SectionTitle>

        <div className="mt-14 space-y-5">
          {PROJECTS.map((project, i) => {
            const st = STATUS_CONFIG[project.status];
            return (
              <motion.article
                key={project.title}
                className="group rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.08,
                  ease: "easeOut" as const,
                }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}
                      >
                        {st.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" aria-hidden />
                        {project.year}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-foreground leading-snug">
                      {project.title}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
                      {project.lead}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  </div>

                  {/* Right CTA */}
                  <Link
                    href="/recherche"
                    className="mt-2 inline-flex flex-shrink-0 items-center gap-1.5 self-start rounded-lg border border-[var(--inp-vert)]/20 px-4 py-2 text-sm font-medium text-[var(--inp-vert)] transition-all hover:bg-[var(--inp-vert)] hover:text-white sm:mt-0"
                  >
                    Voir détail
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
