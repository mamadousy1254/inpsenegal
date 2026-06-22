"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  FlaskConical,
  Map,
  BarChart3,
  Sprout,
  Handshake,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface StrategicMission {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
}

const MISSIONS: StrategicMission[] = [
  {
    title: "Recherche scientifique",
    description:
      "Conduire des programmes de recherche fondamentale et appliquée sur la fertilité, la dégradation et la dynamique des sols.",
    icon: FlaskConical,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    image: "/missions/mission-recherche-scientifique.jpg",
    imageAlt:
      "Agent de l'INP réalisant un prélèvement de sol à la tarière en milieu rural",
  },
  {
    title: "Cartographie nationale des sols",
    description:
      "Élaborer et actualiser la carte pédologique du Sénégal à différentes échelles, pour un aménagement éclairé du territoire.",
    icon: Map,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    image: "/missions/mission-cartographie-sols.png",
    imageAlt:
      "Carte pédologique des délégations du Sénégal réalisée par l'INP",
    imageFit: "contain",
  },
  {
    title: "Production de données pédologiques",
    description:
      "Collecter, structurer et diffuser les données scientifiques sur les sols, constituant un patrimoine national de référence.",
    icon: BarChart3,
    color: "bg-violet-50 text-violet-600 border-violet-100",
    image: "/missions/mission-analyse-laboratoire.jpg",
    imageAlt:
      "Analyse d'échantillons de sol au laboratoire de l'INP",
  },
  {
    title: "Appui aux politiques agricoles",
    description:
      "Fournir l'expertise technique nécessaire aux décideurs pour orienter les stratégies agricoles et environnementales.",
    icon: Sprout,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    image: "/missions/mission-cooperation-partenariats.jpg",
    imageAlt:
      "Restitution avec les partenaires institutionnels de l'INP",
  },
  {
    title: "Conseil technique et expertise",
    description:
      "Accompagner les acteurs publics et privés dans la gestion durable des ressources en sols et la planification agricole.",
    icon: Handshake,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    image: "/missions/mission-appui-technique.jpg",
    imageAlt:
      "Démonstration technique de préparation des sols auprès de producteurs",
  },
  {
    title: "Formation et diffusion",
    description:
      "Contribuer au renforcement des capacités nationales et à la diffusion des connaissances sur la science des sols.",
    icon: BookOpen,
    color: "bg-rose-50 text-rose-600 border-rose-100",
    image: "/missions/mission-formation-diffusion.jpg",
    imageAlt:
      "Séance de formation et de diffusion des connaissances en milieu communautaire",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MissionsStrategiques() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      aria-labelledby="missions-strategiques-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="missions-strategiques-title"
          align="center"
          label="Axes prioritaires"
          subtitle="Six missions stratégiques au cœur du mandat de l'INP."
        >
          Missions stratégiques
        </SectionTitle>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((m, i) => (
            <motion.div
              key={m.title}
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
              <div
                className={`relative aspect-[4/3] overflow-hidden ${
                  m.imageFit === "contain" ? "bg-[#F4EFE3]" : "bg-muted"
                }`}
              >
                <Image
                  src={m.image}
                  alt={m.imageAlt}
                  fill
                  className={`${
                    m.imageFit === "contain" ? "object-contain" : "object-cover"
                  } transition-transform duration-500 group-hover:scale-105`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                {/* Gradient overlay (masqué pour la carte en object-contain afin de préserver la lisibilité de la légende) */}
                {m.imageFit !== "contain" && (
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
                    aria-hidden
                  />
                )}
                {/* Icon badge */}
                <div
                  className={`absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm bg-white/90 shadow-sm ${m.color}`}
                  aria-hidden
                >
                  <m.icon className="h-4 w-4" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-[var(--inp-vert)] transition-colors duration-200">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
              </div>

              {/* Subtle corner accent */}
              <div
                className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-[var(--inp-vert)]/[0.03] transition-transform duration-500 group-hover:scale-150"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
