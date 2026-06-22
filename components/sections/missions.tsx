"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  FlaskConical,
  Map,
  FileCheck,
  GraduationCap,
  Handshake,
  Database,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Missions data                                                      */
/* ------------------------------------------------------------------ */

interface Mission {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  highlight: string;
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
}

const MISSIONS: Mission[] = [
  {
    title: "Recherche scientifique",
    description:
      "Études approfondies sur la fertilité, la dégradation des sols et les pratiques agricoles durables pour orienter les politiques publiques nationales.",
    icon: FlaskConical,
    href: "/recherche",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    highlight: "6 axes de recherche actifs",
    image: "/missions/mission-recherche-scientifique.jpg",
    imageAlt:
      "Agent de l'INP réalisant un prélèvement de sol à la tarière en milieu rural",
  },
  {
    title: "Cartographie nationale des sols",
    description:
      "Inventaire et cartographie pédologique à l'échelle du territoire. Production de données géoréférencées pour la planification agricole.",
    icon: Map,
    href: "/cartographie",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    highlight: "14 régions cartographiées",
    image: "/missions/mission-cartographie-sols.png",
    imageAlt:
      "Carte pédologique des délégations du Sénégal réalisée par l'INP",
    imageFit: "contain",
  },
  {
    title: "Appui technique & expertise",
    description:
      "Conseil scientifique et recommandations aux décideurs, collectivités et acteurs du monde agricole pour une gestion durable des terres.",
    icon: FileCheck,
    href: "/services",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    highlight: "8 services disponibles",
    image: "/missions/mission-appui-technique.jpg",
    imageAlt:
      "Démonstration technique de préparation des sols auprès de producteurs",
  },
  {
    title: "Analyse en laboratoire",
    description:
      "Caractérisation physico-chimique des sols, tests de fertilité, analyses granulométriques et diagnostics de salinité dans nos 5 laboratoires.",
    icon: Database,
    href: "/laboratoires",
    color: "bg-violet-50 text-violet-600 border-violet-100",
    highlight: "12 000+ analyses / an",
    image: "/missions/mission-analyse-laboratoire.jpg",
    imageAlt:
      "Analyse d'échantillons de sol au laboratoire de l'INP",
  },
  {
    title: "Formation & diffusion",
    description:
      "Transfert de connaissances, publications scientifiques, formation continue des techniciens et sensibilisation des communautés rurales.",
    icon: GraduationCap,
    href: "/publications",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    highlight: "150+ publications",
    image: "/missions/mission-formation-diffusion.jpg",
    imageAlt:
      "Séance de formation et de diffusion des connaissances en milieu communautaire",
  },
  {
    title: "Coopération & partenariats",
    description:
      "Collaboration avec les institutions nationales, universités, organismes internationaux et programmes régionaux de recherche sur les sols.",
    icon: Handshake,
    href: "/partenaires",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    highlight: "20+ partenaires actifs",
    image: "/missions/mission-cooperation-partenariats.jpg",
    imageAlt:
      "Restitution avec les partenaires institutionnels de l'INP",
  },
];

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function Missions() {
  return (
    <section
      className="py-20 px-4 bg-muted/40"
      aria-labelledby="missions-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="missions-title"
          align="center"
          subtitle="L'INP assure des missions stratégiques au service de l'agriculture, de la recherche et de l'environnement."
        >
          Nos missions
        </SectionTitle>

        {/* Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2"
              >
                {/* Image header */}
                <div
                  className={`relative aspect-[4/3] overflow-hidden ${
                    item.imageFit === "contain" ? "bg-[#F4EFE3]" : "bg-muted"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className={`${
                      item.imageFit === "contain" ? "object-contain" : "object-cover"
                    } transition-transform duration-500 group-hover:scale-105`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                  {/* Gradient overlay (masqué pour la carte en object-contain afin de préserver la lisibilité de la légende) */}
                  {item.imageFit !== "contain" && (
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
                      aria-hidden
                    />
                  )}
                  {/* Icon badge overlay */}
                  <div
                    className={`absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-sm bg-white/90 shadow-sm ${item.color}`}
                    aria-hidden
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Title */}
                  <h3 className="text-[15px] font-semibold text-foreground group-hover:text-[var(--inp-vert)] transition-colors duration-200">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  {/* Bottom: highlight + arrow */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {item.highlight}
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
            href="/missions"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/25 hover:scale-[1.02]"
          >
            Découvrir toutes nos missions
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
