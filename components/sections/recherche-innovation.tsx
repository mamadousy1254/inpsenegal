"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Sprout,
  Mountain,
  Droplets,
  Leaf,
  FlaskConical,
  BarChart3,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Research axes                                                      */
/* ------------------------------------------------------------------ */

interface Axis {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  stats: string;
  image: string;
  imageAlt: string;
}

const AXES: Axis[] = [
  {
    title: "Fertilité des sols",
    description:
      "Évaluation et préservation de la fertilité pour des rendements durables. Analyse de la matière organique, du phosphore et de l'azote.",
    icon: Sprout,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    stats: "800+ échantillons analysés",
    image: "/recherche/recherche-fertilite-sols.png",
    imageAlt:
      "Prélèvement et analyse de la fertilité d'un échantillon de sol au champ",
  },
  {
    title: "Dégradation & érosion",
    description:
      "Diagnostic et solutions pour limiter l'érosion et la dégradation des terres. Suivi des zones vulnérables sur le territoire national.",
    icon: Mountain,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    stats: "5 régions prioritaires",
    image: "/recherche/recherche-degradation-erosion.png",
    imageAlt:
      "Suivi de terrain dans une zone vulnérable à la dégradation des sols",
  },
  {
    title: "Salinisation & irrigation",
    description:
      "Gestion de l'eau et des sels pour des systèmes irrigués durables. Étude du delta du fleuve Sénégal et des Niayes.",
    icon: Droplets,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    stats: "3 ans de suivi piézométrique",
    image: "/recherche/recherche-salinisation-irrigation.png",
    imageAlt:
      "Prélèvement d'eau pour le suivi de la salinisation en système irrigué",
  },
  {
    title: "Analyse physico-chimique",
    description:
      "Caractérisation complète des propriétés des sols : granulométrie, pH, conductivité, capacité d'échange cationique.",
    icon: FlaskConical,
    color: "bg-violet-50 text-violet-600 border-violet-100",
    stats: "12 000+ analyses/an",
    image: "/recherche/recherche-analyse-physico-chimique.jpg",
    imageAlt: "Laboratoire d'analyses physico-chimiques des sols de l'INP",
  },
  {
    title: "Modélisation & SIG",
    description:
      "Cartographie numérique prédictive, intégration de données Sentinel-2 et SRTM. Base nationale géoréférencée.",
    icon: BarChart3,
    color: "bg-rose-50 text-rose-600 border-rose-100",
    stats: "45 000 points de données",
    image: "/recherche/recherche-modelisation-sig.png",
    imageAlt:
      "Équipe de l'INP en modélisation et cartographie SIG des sols du Sénégal",
  },
  {
    title: "Agriculture durable",
    description:
      "Pratiques agroécologiques, gestion intégrée des ressources, restauration des sols dégradés et agroforesterie.",
    icon: Leaf,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    stats: "6 projets en cours",
    image: "/recherche/recherche-agriculture-durable.png",
    imageAlt: "Champ-école de l'INP sur les pratiques d'agriculture durable",
  },
];

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function RechercheInnovation() {
  return (
    <section className="py-20 px-4" aria-labelledby="recherche-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="recherche-title"
          subtitle="Des thématiques au cœur des enjeux agricoles et environnementaux."
        >
          Recherche &amp; innovation
        </SectionTitle>

        {/* Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AXES.map((axis, i) => (
            <motion.div
              key={axis.title}
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
                    className={`absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm bg-white/90 shadow-sm ${axis.color}`}
                    aria-hidden
                  >
                    <axis.icon className="h-4 w-4" />
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
                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {axis.stats}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:text-[var(--inp-vert)] group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
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
