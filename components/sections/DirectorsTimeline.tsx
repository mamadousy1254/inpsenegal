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
        ring: "ring-emerald-400/40",
        badge: "bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
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
        ring: "ring-[#1F4D3A]/40",
        badge: "bg-emerald-50 text-[#1F4D3A]",
        dot: "bg-[#1F4D3A]",
    },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DirectorsTimeline() {
    return (
        <section
            className="py-20 px-4 sm:py-24 lg:py-28 overflow-hidden"
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

                {/* Horizontal timeline */}
                <div className="mt-14 relative">
                    {/* Scrollable container */}
                    <div className="overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                        <div className="relative flex gap-8 lg:gap-10 min-w-max px-4">
                            {/* Horizontal line */}
                            <div
                                className="absolute top-[48px] left-[48px] right-[48px] h-[2px] rounded-full bg-gradient-to-r from-[#1F4D3A] via-[#2F6B4F] to-[#8B5E3C] opacity-30"
                                aria-hidden
                            />

                            {DIRECTORS.map((director, i) => {
                                const colors = ACCENT_COLORS[i];
                                const isLast = director.isCurrent;

                                return (
                                    <motion.div
                                        key={director.name}
                                        className="flex flex-col items-center snap-center min-w-[280px] md:min-w-[300px] lg:min-w-[260px]"
                                        style={{ width: "clamp(280px, 22vw, 320px)" }}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-40px" }}
                                        transition={{
                                            duration: 0.5,
                                            delay: i * 0.12,
                                            ease: "easeOut",
                                        }}
                                    >
                                        {/* Timeline dot + photo */}
                                        <div className="relative z-10 mb-6">
                                            {/* Outer glow for current */}
                                            {isLast && (
                                                <div
                                                    className="absolute -inset-2 rounded-full opacity-60 animate-pulse"
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, #1F4D3A, #8B5E3C)",
                                                    }}
                                                    aria-hidden
                                                />
                                            )}
                                            <div
                                                className={`relative h-24 w-24 overflow-hidden rounded-full border-[3px] bg-white shadow-lg ring-4 transition-transform duration-300 hover:scale-110 ${isLast
                                                    ? "border-[#1F4D3A] ring-[#1F4D3A]/20 shadow-xl"
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
                                        </div>

                                        {/* Card */}
                                        <div
                                            className={`w-full rounded-2xl border bg-white p-6 lg:p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative z-10 ${isLast
                                                ? "border-l-[3px] border-l-[#1F4D3A] border-y border-r border-border/60 shadow-md"
                                                : "border-border/60"
                                                }`}
                                        >
                                            {/* Date badge */}
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${colors.badge}`}
                                            >
                                                {director.date}
                                            </span>

                                            {/* Name */}
                                            <h3 className="mt-3 text-[15px] font-semibold text-foreground leading-snug">
                                                {director.name}
                                            </h3>

                                            {/* Title */}
                                            <p
                                                className={`mt-1 text-xs font-medium ${isLast
                                                    ? "text-[var(--inp-vert)]"
                                                    : "text-muted-foreground"
                                                    }`}
                                            >
                                                {director.period}
                                                {isLast && (
                                                    <span className="ml-1.5 inline-flex items-center rounded-full bg-[var(--inp-vert)]/10 px-2 py-0.5 text-[9px] font-bold text-[var(--inp-vert)]">
                                                        Actuel
                                                    </span>
                                                )}
                                            </p>

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
                </div>

                {/* CTA */}
                <div className="mt-10 text-center">
                    <Link
                        href="/institut/presentation"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1F4D3A] via-[#2F6B4F] to-[#8B5E3C] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-emerald-900/15 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/25 hover:scale-[1.02]"
                    >
                        Découvrir l&apos;histoire des Directeurs
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
