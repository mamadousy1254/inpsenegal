"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Director } from "@/types";

const DIRECTOR_PHOTO = "/images/director/photo-directeur-officielle-portrait.jpg";

const DEFAULT_DIRECTOR = {
  fullName: "Dr Alfred Kouly TINE",
  title: "Directeur Général",
  quote: "Le sol est la base de toute souveraineté alimentaire durable.",
  message: `Chères visiteuses, chers visiteurs,

C'est avec un réel plaisir que je vous souhaite la bienvenue sur le site de l'Institut national de Pédologie.

L'Institut national de Pédologie joue un rôle stratégique dans la connaissance, la gestion et la valorisation des ressources en sols de notre pays. À travers la recherche scientifique, la cartographie pédologique et l'appui technique aux politiques publiques, l'INP contribue activement au développement d'une agriculture durable et résiliente.

Nos sols, d'une grande diversité, font face à des dégradations multiples — érosion, acidification, salinisation et appauvrissement en matière organique. Y répondre est une urgence nationale : sans sols fertiles et sains, il ne peut y avoir ni rendements élevés, ni souveraineté alimentaire durable. C'est tout le sens du programme prioritaire « Santé des sols », que l'INP déploie sur le terrain aux côtés du ministère de l'Agriculture, à travers le chaulage, le phosphatage, les amendements organiques et la promotion d'engrais organo-minéraux.

Notre ambition est de positionner l'Institut comme une référence nationale et sous-régionale en matière de science des sols, en renforçant l'innovation, la coopération scientifique et la diffusion des connaissances.

Au quotidien, nos équipes restaurent la fertilité des terres, mettent à l'échelle des technologies éprouvées — compostage, agroforesterie, gestion intégrée de la fertilité — et forment producteurs, étudiants et techniciens, notamment grâce à des parcelles de démonstration installées au plus près des agriculteurs.

Je vous invite à explorer nos programmes, nos projets et nos ressources, et à rejoindre l'INP dans cette mission essentielle : préserver le sol, ce patrimoine vivant dont dépend l'avenir agricole et alimentaire du Sénégal.`,
};

interface MotDirecteurContentProps {
  director: Director | null;
}

export function MotDirecteurContent({ director }: MotDirecteurContentProps) {
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
      signatureUrl: undefined as string | undefined,
    };

  return (
    <section className="py-16 px-4 sm:py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:items-center">
          {/* Photo */}
          <motion.div
            className="order-2 lg:order-1 flex justify-center"
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-[400px]">
              <div
                className="absolute -inset-3 rounded-2xl opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, var(--inp-beige) 0%, transparent 50%, var(--inp-vert) 100%)",
                }}
                aria-hidden
              />
              <div className="relative rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={data.photoUrl}
                    alt={`${data.fullName}, ${data.title}`}
                    fill
                    sizes="(max-width: 768px) 80vw, 400px"
                    className="object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-2 rounded-lg bg-[var(--inp-vert)] px-4 py-3 text-center">
                  <p className="text-sm font-semibold tracking-wide text-white">
                    {data.fullName}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--inp-beige)]">
                    {data.title} — INP
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Texte */}
          <div className="order-1 lg:order-2 space-y-7">
            <motion.blockquote
              className="relative border-l-4 border-inp-marron py-1 pl-6"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span
                className="pointer-events-none absolute -left-1 -top-4 select-none text-6xl leading-none text-inp-beige/60"
                aria-hidden
              >
                «
              </span>
              <p
                className="text-xl italic leading-relaxed text-inp-marron sm:text-2xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {data.quote}&nbsp;»
              </p>
            </motion.blockquote>

            <motion.div
              className="space-y-4 text-[0.95rem] leading-[1.8] text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {data.message.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </motion.div>

            <motion.div
              className="flex items-end gap-5 pt-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div
                className="hidden h-px w-16 flex-shrink-0 bg-inp-beige sm:block"
                aria-hidden
              />
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
                <p className="text-lg font-semibold tracking-wide text-foreground">
                  {data.fullName}
                </p>
                <p className="font-medium text-inp-marron">{data.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Institut national de Pédologie
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-inp-marron">À lire</span> :{" "}
                  <Link
                    href="/actualites/interview-dg-sante-des-sols"
                    className="text-[#7B4F2A] underline underline-offset-2 hover:text-[#4A2F1A]"
                  >
                    l&apos;entretien du Directeur général à l&apos;occasion de la Journée mondiale des sols
                  </Link>
                  <span aria-hidden="true"> →</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
