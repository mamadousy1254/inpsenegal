"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRight } from "lucide-react";
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
      "Évaluation et préservation de la fertilité pour des rendements durables. Analyse de la matière organique, du phosphore et de l'azote.",
    icon: "sprout",
    color: "amber",
    stats: "800+ échantillons analysés",
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
      "Diagnostic et solutions pour limiter l'érosion et la dégradation des terres. Suivi des zones vulnérables sur le territoire national.",
    icon: "mountain",
    color: "amber",
    stats: "5 régions prioritaires",
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
      "Gestion de l'eau et des sels pour des systèmes irrigués durables. Étude du delta du fleuve Sénégal et des Niayes.",
    icon: "droplets",
    color: "blue",
    stats: "3 ans de suivi piézométrique",
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
      "Caractérisation complète des propriétés des sols : granulométrie, pH, conductivité, capacité d'échange cationique.",
    icon: "flask",
    color: "violet",
    stats: "12 000+ analyses/an",
    image: "/recherche/recherche-analyse-physico-chimique.jpg",
    imageAlt: "Laboratoire d'analyses physico-chimiques des sols de l'INP",
    order: 3,
    status: "publie",
  },
  {
    _id: "fallback-modelisation",
    title: "Modélisation & SIG",
    description:
      "Cartographie numérique prédictive, intégration de données Sentinel-2 et SRTM. Base nationale géoréférencée.",
    icon: "chart",
    color: "rose",
    stats: "45 000 points de données",
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
      "Pratiques agroécologiques, gestion intégrée des ressources, restauration des sols dégradés et agroforesterie.",
    icon: "leaf",
    color: "amber",
    stats: "6 projets en cours",
    image: "/recherche/recherche-agriculture-durable.png",
    imageAlt: "Champ-école de l'INP sur les pratiques d'agriculture durable",
    order: 5,
    status: "publie",
  },
];

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function RechercheInnovation({
  axes,
}: {
  axes?: SerializedResearchAxis[];
}) {
  const items = axes && axes.length > 0 ? axes : FALLBACK_AXES;

  return (
    <section className="py-20 px-4" aria-labelledby="recherche-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="recherche-title"
          align="center"
          subtitle="Des thématiques au cœur des enjeux agricoles et environnementaux."
        >
          Recherche &amp; innovation
        </SectionTitle>

        {/* Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((axis, i) => {
            const Icon = getResearchAxisIcon(axis.icon);
            return (
              <motion.div
                key={axis._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href="/recherche"
                  className="group flex h-full flex-col rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2"
                >
                  {/* Image header */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={axis.image}
                      alt={axis.imageAlt}
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
                    {/* Icon badge overlay */}
                    <div
                      className={`absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm bg-white/90 shadow-sm ${getResearchAxisColor(axis.color)}`}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Title */}
                    <h3 className="text-[15px] font-semibold text-foreground group-hover:text-[var(--inp-vert)] transition-colors duration-200">
                      {axis.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                      {axis.description}
                    </p>

                    {/* Stat badge */}
                    {axis.stats && (
                      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {axis.stats}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:text-[var(--inp-vert)] group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/recherche"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/25 hover:scale-[1.02]"
          >
            Découvrir toute la recherche
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
