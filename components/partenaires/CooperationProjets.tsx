"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CalendarDays, Users, Target } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type ProjectStatus = "En cours" | "Terminé" | "En préparation";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  "En cours": "bg-amber-50 text-amber-700 border-amber-200",
  Terminé: "bg-slate-100 text-slate-600 border-slate-200",
  "En préparation": "bg-amber-50 text-amber-700 border-amber-200",
};

interface CollabProject {
  title: string;
  partners: string[];
  duration: string;
  objective: string;
  status: ProjectStatus;
}

const PROJECTS: CollabProject[] = [
  {
    title: "Programme Sols Durables Sénégal (SDS)",
    partners: ["FAO", "INP", "Ministère de l'Agriculture"],
    duration: "2024 – 2028",
    objective:
      "Renforcer les capacités nationales en gestion durable des sols, mettre en place un réseau de surveillance et former 50 techniciens.",
    status: "En cours",
  },
  {
    title: "Cartographie numérique des sols de Casamance",
    partners: ["INP", "IRD", "ISRIC"],
    duration: "2022 – 2024",
    objective:
      "Production de cartes prédictives des propriétés des sols par apprentissage automatique et télédétection Sentinel-2.",
    status: "Terminé",
  },
  {
    title: "Restauration de la fertilité du bassin arachidier",
    partners: ["INP", "ISRA", "ANCAR", "Banque Mondiale"],
    duration: "2024 – 2027",
    objective:
      "Restauration de 15 000 ha de terres dégradées via l'agroforesterie et le compostage sur 500 exploitations pilotes.",
    status: "En cours",
  },
  {
    title: "Atlas pédologique du Sénégal — Édition 2024",
    partners: ["INP", "CSE", "UCAD"],
    duration: "2019 – 2024",
    objective:
      "Synthèse cartographique nationale des types de sols fondée sur 12 000 profils de référence.",
    status: "Terminé",
  },
  {
    title: "Réseau ouest-africain de surveillance des sols (ROASS)",
    partners: ["INP", "AfSP / UA", "CEDEAO", "GIZ"],
    duration: "2025 – 2029",
    objective:
      "Harmonisation des méthodologies de suivi de la qualité des sols dans 8 pays de la sous-région.",
    status: "En préparation",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CooperationProjets() {
  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "var(--inp-vert)" }}
      aria-labelledby="coop-title"
    >
      {/* Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="container relative mx-auto max-w-6xl">
        <SectionTitle
          id="coop-title"
          align="center"
          light
          label="Collaboration active"
          subtitle="Projets conjoints avec nos partenaires nationaux et internationaux."
        >
          Coopération &amp; projets conjoints
        </SectionTitle>

        <div className="mt-14 space-y-5">
          {PROJECTS.map((proj, i) => (
            <motion.article
              key={proj.title}
              className="group overflow-hidden rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 hover:bg-white/[0.12] sm:p-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  {/* Title + status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-white">
                      {proj.title}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                        STATUS_STYLES[proj.status]
                      )}
                    >
                      {proj.status}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" /> {proj.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {proj.partners.join(", ")}
                    </span>
                  </div>

                  {/* Objective */}
                  <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/75">
                    <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--inp-beige)]" />
                    {proj.objective}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
