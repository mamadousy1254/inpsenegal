"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";

interface Director {
  name: string;
  period: string;
  date: string;
  image: string;
  description: string;
}

const DIRECTORS: Director[] = [
  {
    name: "Rokhoya Daba FALL",
    period: "1ère Directrice de l'INP",
    date: "28 Juin 2004 — 2 Décembre 2010",
    image: "/images/directeurs/rokhoya-daba-fall.jpg",
    description:
      "Première Directrice de l'INP, elle a posé les bases institutionnelles et scientifiques de l'étude des sols au Sénégal.",
  },
  {
    name: "Mame Ndene Lo",
    period: "2ème Directeur Général de l'INP",
    date: "02 Décembre 2010 — 27 Mai 2015",
    image: "/images/directeurs/mame-ndene-lo.jpg",
    description:
      "A contribué à la structuration technique et au développement des capacités nationales en pédologie.",
  },
  {
    name: "Mamadou Amadou SOW",
    period: "3ème Directeur Général de l'INP",
    date: "27 Mai 2015 — 18 Juillet 2024",
    image: "/images/directeurs/mamadou-amadou-sow.jpg",
    description:
      "A renforcé les programmes de cartographie des sols et modernisé les laboratoires techniques de l'Institut.",
  },
  {
    name: "Dr. Alfred Kouly TINE",
    period: "4ème Directeur Général — Directeur actuel",
    date: "18 Juillet 2024 — Présent",
    image: "/images/directeurs/alfred-kouly-tine.jpg",
    description:
      "Conduit la transformation numérique et le rayonnement sous-régional de l'INP, tout en renforçant la modernisation scientifique et institutionnelle.",
  },
];

const ACCENT_COLORS = [
  { border: "border-[var(--inp-vert)]", bg: "bg-[var(--inp-vert)]", badge: "bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]", glow: "shadow-[var(--inp-vert)]/20" },
  { border: "border-[var(--inp-marron)]", bg: "bg-[var(--inp-marron)]", badge: "bg-[var(--inp-marron)]/10 text-[var(--inp-marron)]", glow: "shadow-[var(--inp-marron)]/20" },
  { border: "border-[var(--inp-vert)]", bg: "bg-[var(--inp-vert)]", badge: "bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]", glow: "shadow-[var(--inp-vert)]/20" },
  { border: "border-[var(--inp-marron)]", bg: "bg-[var(--inp-marron)]", badge: "bg-[var(--inp-marron)]/10 text-[var(--inp-marron)]", glow: "shadow-[var(--inp-marron)]/20" },
];

export function Historique() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      aria-labelledby="historique-title"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Left: intro text */}
          <div>
            <SectionTitle id="historique-title" label="Notre histoire">
              Les Directeurs de l&apos;INP
            </SectionTitle>

            <motion.div
              className="mt-6 space-y-4 text-muted-foreground leading-[1.85] text-[0.95rem]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p>
                Depuis sa création, l&apos;Institut national de Pédologie a été
                dirigé par des personnalités qui ont marqué son{" "}
                <strong className="text-foreground">évolution institutionnelle</strong> et
                scientifique.
              </p>
              <p>
                Chaque directeur a contribué à renforcer la mission fondamentale
                de l&apos;INP : fournir les connaissances nécessaires à une{" "}
                <strong className="text-foreground">agriculture durable et résiliente</strong>{" "}
                au Sénégal.
              </p>
            </motion.div>
          </div>

          {/* Right: Directors timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[39px] top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-[var(--inp-vert)] via-[var(--inp-beige)] to-[var(--inp-marron)] opacity-40"
              aria-hidden
            />

            <div className="space-y-10">
              {DIRECTORS.map((director, i) => {
                const colors = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <motion.div
                    key={director.name}
                    className="relative flex gap-6 pl-0"
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: "easeOut" as const,
                    }}
                  >
                    {/* Photo circulaire */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`h-20 w-20 overflow-hidden rounded-full border-[3px] ${colors.border} bg-white shadow-lg ${colors.glow} transition-transform duration-300 hover:scale-110`}
                      >
                        <Image
                          src={director.image}
                          alt={director.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>

                    {/* Card contenu */}
                    <div className={`flex-1 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${i === DIRECTORS.length - 1 ? "border-l-[3px] border-l-[#5E3D20] shadow-md" : ""}`}>
                      {/* Badge date */}
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide ${colors.badge}`}
                      >
                        {director.date}
                      </span>

                      <h3 className="mt-2 text-lg font-semibold text-foreground sm:text-xl">
                        {director.name}
                      </h3>

                      <p className={`mt-0.5 text-sm font-medium ${i % 2 === 0 ? "text-[var(--inp-vert)]" : "text-[var(--inp-marron)]"}`}>
                        {director.period}
                      </p>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {director.description}
                      </p>

                      {/* Barre accent en bas */}
                      <div
                        className={`mt-4 h-[2px] w-16 rounded-full ${colors.bg} opacity-40`}
                        aria-hidden
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
