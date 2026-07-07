"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { SerializedResearchAxis } from "@/lib/services/cms/serialize-research-axis";
import {
  getResearchAxisColor,
  getResearchAxisIcon,
} from "@/components/recherche/research-axis-ui";

/* ------------------------------------------------------------------ */
/*  Fallback statique (si aucun axe publié en base)                    */
/* ------------------------------------------------------------------ */

const FALLBACK_AXES: SerializedResearchAxis[] = [
  {
    _id: "fallback-fertilite",
    title: "Fertilité des sols",
    description:
      "Évaluation de la fertilité, dynamique de la matière organique et cycles des nutriments pour optimiser les rendements agricoles.",
    icon: "sprout",
    color: "amber",
    image: "/recherche/recherche-fertilite-sols.png",
    imageAlt:
      "Prélèvement et analyse de la fertilité d'un échantillon de sol au champ",
    order: 0,
    status: "publie",
  },
  {
    _id: "fallback-degradation",
    title: "Dégradation & érosion",
    description:
      "Diagnostic des processus d'érosion hydrique et éolienne, suivi de la dégradation et stratégies de restauration des terres.",
    icon: "mountain",
    color: "amber",
    image: "/recherche/recherche-degradation-erosion.png",
    imageAlt:
      "Suivi de terrain dans une zone vulnérable à la dégradation des sols",
    order: 1,
    status: "publie",
  },
  {
    _id: "fallback-salinisation",
    title: "Salinisation & irrigation",
    description:
      "Étude de la salinisation des sols en zones irriguées, gestion de l'eau et préservation de la qualité des sols.",
    icon: "droplets",
    color: "blue",
    image: "/recherche/recherche-salinisation-irrigation.png",
    imageAlt:
      "Prélèvement d'eau pour le suivi de la salinisation en système irrigué",
    order: 2,
    status: "publie",
  },
  {
    _id: "fallback-analyse",
    title: "Analyse physico-chimique",
    description:
      "Caractérisation des propriétés physiques, chimiques et minéralogiques des sols par des méthodes analytiques de référence.",
    icon: "flask",
    color: "violet",
    image: "/recherche/recherche-analyse-physico-chimique.jpg",
    imageAlt: "Laboratoire d'analyses physico-chimiques des sols de l'INP",
    order: 3,
    status: "publie",
  },
  {
    _id: "fallback-modelisation",
    title: "Modélisation & SIG",
    description:
      "Modélisation spatiale, télédétection et systèmes d'information géographique pour la cartographie prédictive des sols.",
    icon: "chart",
    color: "rose",
    image: "/recherche/recherche-modelisation-sig.png",
    imageAlt:
      "Équipe de l'INP en modélisation et cartographie SIG des sols du Sénégal",
    order: 4,
    status: "publie",
  },
  {
    _id: "fallback-agriculture",
    title: "Agriculture durable",
    description:
      "Pratiques agroécologiques, agriculture de conservation et gestion intégrée des ressources sol-eau-plante.",
    icon: "leaf",
    color: "amber",
    image: "/recherche/recherche-agriculture-durable.png",
    imageAlt: "Champ-école de l'INP sur les pratiques d'agriculture durable",
    order: 5,
    status: "publie",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AxesRecherche({ axes }: { axes?: SerializedResearchAxis[] }) {
  const items = axes && axes.length > 0 ? axes : FALLBACK_AXES;

  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      aria-labelledby="axes-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="axes-title"
          align="center"
          label="Thématiques"
          subtitle="Six axes structurants guident l'ensemble des programmes de recherche de l'Institut."
        >
          Axes de recherche
        </SectionTitle>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((axe, i) => {
            const Icon = getResearchAxisIcon(axe.icon);
            return (
              <motion.div
                key={axe._id}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.07,
                  ease: "easeOut" as const,
                }}
              >
                {/* Image header */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={axe.image}
                    alt={axe.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
                    aria-hidden
                  />
                  {/* Icon badge */}
                  <div
                    className={`absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm bg-white/90 shadow-sm ${getResearchAxisColor(axe.color)}`}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-[var(--inp-vert)] transition-colors duration-200">
                    {axe.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {axe.description}
                  </p>
                </div>

                {/* Subtle corner accent */}
                <div
                  className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-[var(--inp-vert)]/[0.03] transition-transform duration-500 group-hover:scale-150"
                  aria-hidden
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
