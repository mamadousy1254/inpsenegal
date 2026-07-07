"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRight } from "lucide-react";
import type { Director } from "@/types";

/* ------------------------------------------------------------------ */
/*  Fallback static content                                            */
/* ------------------------------------------------------------------ */

const DIRECTOR_PHOTO = "/images/director/photo-directeur-officielle-portrait.jpg";

const DEFAULT_DIRECTOR: Omit<Director, "objectId" | "createdAt" | "updatedAt"> = {
  fullName: "Dr Alfred Kouly TINE",
  title: "Directeur Général",
  quote:
    "Le sol est la base de toute souveraineté alimentaire durable.",
  message: `L'Institut national de Pédologie joue un rôle stratégique dans la connaissance, la gestion et la valorisation des ressources en sols de notre pays. À travers la recherche scientifique, la cartographie pédologique et l'appui technique aux politiques publiques, l'INP contribue activement au développement d'une agriculture durable et résiliente.

Notre ambition est de positionner l'Institut comme une référence nationale et sous-régionale en matière de science des sols, en renforçant l'innovation, la coopération et la diffusion des connaissances.

Nous œuvrons chaque jour pour une meilleure compréhension des dynamiques des sols, afin de soutenir la sécurité alimentaire et la gestion durable des terres.`,
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface DirectorMessageProps {
  director: Director | null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DirectorMessage({ director }: DirectorMessageProps) {
  const data = director
    ? {
      fullName: director.fullName,
      title: director.title,
      quote: director.quote,
      message: director.message,
      photoUrl: director.photo?.url ?? DIRECTOR_PHOTO,
      signatureUrl: director.signature?.url,
    }
    : {
      ...DEFAULT_DIRECTOR,
      photoUrl: DIRECTOR_PHOTO,
      signatureUrl: undefined,
    };

  return (
    <section
      id="mot-du-directeur"
      className="section-texture py-20 px-4 sm:py-24 lg:py-28"
      aria-labelledby="director-title"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:items-center">
          {/* ─── Colonne gauche : photo premium ─── */}
          <motion.div
            className="order-2 lg:order-1 flex justify-center"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-[400px]">
              {/* Decorative accent behind the photo */}
              <div
                className="absolute -inset-3 rounded-2xl opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, var(--inp-beige) 0%, transparent 50%, #7B4F2A 100%)",
                }}
                aria-hidden
              />
              {/* Outer card frame */}
              <div className="relative rounded-2xl bg-white p-2 shadow-xl shadow-black/5 ring-1 ring-black/5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                {/* Photo container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={data.photoUrl}
                    alt={`${data.fullName}, ${data.title}`}
                    fill
                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.03]"
                    priority
                  />
                  {/* Subtle gradient overlay at bottom for polish */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(123,79,42,0.12), transparent)",
                    }}
                    aria-hidden
                  />
                </div>
                {/* Name plate beneath photo */}
                <div className="mt-2 rounded-lg bg-[#7B4F2A] px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-white tracking-wide">
                    {data.fullName}
                  </p>
                  <p className="text-xs text-[var(--inp-beige)] mt-0.5">
                    {data.title} — INP
                  </p>
                </div>
              </div>
              {/* Corner decorative element */}
              <div
                className="absolute -bottom-2 -right-2 h-12 w-12 rounded-br-2xl border-b-2 border-r-2 border-[var(--inp-beige)] opacity-50"
                aria-hidden
              />
              <div
                className="absolute -top-2 -left-2 h-12 w-12 rounded-tl-2xl border-t-2 border-l-2 border-[var(--inp-beige)] opacity-50"
                aria-hidden
              />
            </div>
          </motion.div>

          {/* ─── Colonne droite : texte ─── */}
          <div className="order-1 lg:order-2 space-y-7">
            {/* Title */}
            <SectionTitle
              id="director-title"
              label="Message institutionnel"
            >
              Mot du Directeur
            </SectionTitle>

            {/* Quote */}
            <motion.blockquote
              className="relative border-l-4 border-inp-marron pl-6 py-1"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Large decorative quote mark */}
              <span
                className="absolute -top-4 -left-1 text-6xl leading-none text-inp-beige/60 select-none pointer-events-none"
                aria-hidden
              >
                &ldquo;
              </span>
              <p
                className="text-xl italic text-inp-marron sm:text-2xl leading-relaxed"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {data.quote}
              </p>
            </motion.blockquote>

            {/* Body text */}
            <motion.div
              className="space-y-4 text-muted-foreground leading-[1.8] text-[0.95rem]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {data.message.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </motion.div>

            {/* Signature block */}
            <motion.div
              className="pt-5 flex items-end gap-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* Decorative line */}
              <div className="hidden sm:block flex-shrink-0 w-16 h-px bg-inp-beige" aria-hidden />
              <div>
                {data.signatureUrl ? (
                  <Image
                    src={data.signatureUrl}
                    alt=""
                    width={180}
                    height={60}
                    className="mb-3 object-contain object-left"
                    aria-hidden
                  />
                ) : null}
                <p
                  className={cn(
                    "text-lg font-semibold text-foreground",
                    "tracking-wide"
                  )}
                >
                  {data.fullName}
                </p>
                <p className="text-inp-marron font-medium">{data.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Institut national de Pédologie
                </p>

                {/* CTA */}
                <Link
                  href="/institut/mot-directeur"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] px-5 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/25 hover:scale-[1.02]"
                >
                  Lire le message complet
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
