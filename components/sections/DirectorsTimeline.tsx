"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Directors data                                                     */
/* ------------------------------------------------------------------ */

interface Director {
    name: string;
    period: string;
    date: string;
    image: string;
    description: string;
    isCurrent?: boolean;
}

const DIRECTORS: Director[] = [
    {
        name: "Rokhoya Daba FALL",
        period: "1ère Directrice de l'INP",
        date: "28 Juin 2004 — 2 Déc. 2010",
        image: "/images/directeurs/rokhoya-daba-fall.jpg",
        description:
            "A posé les bases institutionnelles et scientifiques de l'étude des sols au Sénégal.",
    },
    {
        name: "Mame Ndene Lo",
        period: "2ème Directeur Général",
        date: "02 Déc. 2010 — 27 Mai 2015",
        image: "/images/directeurs/mame-ndene-lo.jpg",
        description:
            "A contribué à la structuration technique et au développement des capacités nationales.",
    },
    {
        name: "Mamadou Amadou SOW",
        period: "3ème Directeur Général",
        date: "27 Mai 2015 — 18 Juil. 2024",
        image: "/images/directeurs/mamadou-amadou-sow.jpg",
        description:
            "A renforcé les programmes de cartographie des sols et modernisé les laboratoires.",
    },
    {
        name: "Dr. Alfred Kouly TINE",
        period: "4ème Directeur Général",
        date: "18 Juil. 2024 — Présent",
        image: "/images/directeurs/alfred-kouly-tine.jpg",
        description:
            "Conduit la transformation numérique et le rayonnement sous-régional de l'INP.",
        isCurrent: true,
    },
];

/* ------------------------------------------------------------------ */
/*  Accent colors per position                                         */
/* ------------------------------------------------------------------ */

const ACCENT_COLORS = [
    {
        ring: "ring-[#B0824F]/40",
        badge: "bg-[#F7F1E6] text-[#7B4F2A]",
        dot: "bg-[#8B5E3C]",
    },
    {
        ring: "ring-amber-400/40",
        badge: "bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
    },
    {
        ring: "ring-rose-400/40",
        badge: "bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
    },
    {
        ring: "ring-[#5E3D20]/40",
        badge: "bg-[#F7F1E6] text-[#5E3D20]",
        dot: "bg-[#5E3D20]",
    },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DirectorsTimeline() {
    return (
        <section
            className="py-20 px-4 sm:py-24 lg:py-28"
            aria-labelledby="directors-timeline-title"
        >
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <SectionTitle
                    id="directors-timeline-title"
                    align="center"
                    label="Notre histoire"
                    subtitle="Depuis sa création, l'INP a été dirigé par des personnalités ayant marqué son évolution institutionnelle et scientifique au service de l'agriculture durable."
                >
                    Les Directeurs de l&apos;INP
                </SectionTitle>

                {/* Grille responsive — 4 (desktop) / 2 (tablette) / 1 (mobile).
                    Tout le monde est visible, aucune troncature. */}
                <div className="relative mt-14">
                    {/* Fil de frise — desktop uniquement, derrière les photos */}
                    <div
                        className="pointer-events-none absolute left-[12%] right-[12%] top-[52px] hidden h-[2px] rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] opacity-25 lg:block"
                        aria-hidden
                    />

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        {DIRECTORS.map((director, i) => {
                            const colors = ACCENT_COLORS[i];
                            const isCurrent = director.isCurrent;

                            return (
                                <motion.div
                                    key={director.name}
                                    className="flex h-full flex-col items-center"
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.1,
                                        ease: "easeOut",
                                    }}
                                >
                                    {/* Photo */}
                                    <div className="relative z-10 mb-5">
                                        <div
                                            className={`relative h-24 w-24 overflow-hidden rounded-full border-[3px] bg-white shadow-lg ring-4 transition-transform duration-300 hover:scale-105 ${isCurrent
                                                ? "border-[#7B4F2A] ring-[#7B4F2A]/25 shadow-xl"
                                                : `border-white ${colors.ring}`
                                                }`}
                                        >
                                            <Image
                                                src={director.image}
                                                alt={`${director.name}, ${director.period}`}
                                                width={96}
                                                height={96}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        {/* Étoile — DG en exercice */}
                                        {isCurrent && (
                                            <div
                                                className="absolute -right-1 -top-1 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#FDEF42] text-sm shadow"
                                                aria-hidden
                                            >
                                                ★
                                            </div>
                                        )}
                                    </div>

                                    {/* Carte — hauteur égale (flex-1) */}
                                    <div
                                        className={`relative z-10 flex w-full flex-1 flex-col rounded-2xl border p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isCurrent
                                            ? "border-2 border-[#7B4F2A] bg-[#FBF7EF] shadow-md"
                                            : "border-border/60 bg-white"
                                            }`}
                                    >
                                        {/* Badge de mandat (dates) */}
                                        <span
                                            className={`inline-block self-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${colors.badge}`}
                                        >
                                            {director.date}
                                        </span>

                                        {/* Nom */}
                                        <h3 className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
                                            {director.name}
                                        </h3>

                                        {/* Fonction */}
                                        <p
                                            className={`mt-1 text-xs font-medium ${isCurrent ? "text-[#7B4F2A]" : "text-muted-foreground"
                                                }`}
                                        >
                                            {director.period}
                                        </p>

                                        {/* Badge « En exercice » */}
                                        {isCurrent && (
                                            <span className="mt-2 inline-flex items-center gap-1 self-center rounded-full bg-[#7B4F2A] px-2.5 py-0.5 text-[10px] font-bold text-white">
                                                ★ En exercice
                                            </span>
                                        )}

                                        {/* Description */}
                                        <p className="mt-2.5 text-[12px] leading-relaxed text-muted-foreground">
                                            {director.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-10 text-center">
                    <Link
                        href="/institut/presentation"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/25 hover:scale-[1.02]"
                    >
                        Découvrir l&apos;histoire des Directeurs
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
