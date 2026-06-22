"use client";

import { motion } from "framer-motion";
import {
  Database,
  Shield,
  GraduationCap,
  Settings,
  Scale,
  FileCheck,
  Users,
  Globe,
  type LucideIcon,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4, ease },
};

const MISSIONS: {
  num: number;
  icon: LucideIcon;
  content: React.ReactNode;
}[] = [
  {
    num: 1,
    icon: Database,
    content: (
      <>
        L&apos;<strong className="font-semibold text-amber-900">identification</strong> et la maîtrise des
        caractéristiques des ressources en sols.
      </>
    ),
  },
  {
    num: 2,
    icon: Shield,
    content: (
      <>
        La <strong className="font-semibold text-amber-900">sauvegarde</strong> du patrimoine foncier.
      </>
    ),
  },
  {
    num: 3,
    icon: GraduationCap,
    content: (
      <>
        La sensibilisation et la <strong className="font-semibold text-amber-900">formation</strong> des producteurs et
        autres acteurs sur le rôle de la science du sol.
      </>
    ),
  },
  {
    num: 4,
    icon: Settings,
    content: (
      <>
        La mise en œuvre de modules de formation relatifs à l&apos;exploitation et à la{" "}
        <strong className="font-semibold text-amber-900">gestion durable</strong> et rentable des activités rurales.
      </>
    ),
  },
  {
    num: 5,
    icon: Scale,
    content: (
      <>
        La coordination, la <strong className="font-semibold text-amber-900">réglementation</strong> et le contrôle des
        travaux pédologiques exécutés sur le territoire national.
      </>
    ),
  },
  {
    num: 6,
    icon: FileCheck,
    content: (
      <>
        L&apos;établissement de <strong className="font-semibold text-amber-900">normes</strong> en matière de sols et
        d&apos;eaux pour l&apos;agriculture.
      </>
    ),
  },
  {
    num: 7,
    icon: Users,
    content: (
      <>
        La mise en œuvre de <strong className="font-semibold text-amber-900">centres polyvalents</strong> de formation
        des producteurs, vitrines des techniques et méthodes d&apos;exploitation agricole durable et rentable.
      </>
    ),
  },
  {
    num: 8,
    icon: Globe,
    content: (
      <>
        La dynamisation et le développement de la{" "}
        <strong className="font-semibold text-amber-900">coopération sous-régionale, régionale et internationale</strong>{" "}
        en matière d&apos;agro-pédologie.
      </>
    ),
  },
];

export function MissionsContent() {
  return (
    <section
      className="bg-[#F6F5F2] py-16 px-4 sm:py-20 md:py-24"
      aria-labelledby="missions-title"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
        {/* Titre */}
        <motion.h1
          id="missions-title"
          className="text-center text-3xl font-bold tracking-wide text-[var(--inp-vert)] sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          MISSIONS DE L&apos;INP
        </motion.h1>
        <motion.span
          className="mx-auto mt-4 block h-1 w-24 rounded-full bg-gradient-to-r from-[var(--inp-vert)] via-[var(--inp-marron)] to-[var(--inp-beige)]"
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Bloc — La référence en matière de sols */}
        <motion.div
          className="mt-12 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-white via-amber-50/40 to-amber-100/30 shadow-md sm:mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="border-b border-[var(--inp-beige)] bg-gradient-to-r from-[var(--inp-vert)] via-[var(--inp-vert)] to-[var(--inp-marron)] px-6 py-4 sm:px-8">
            <h3 className="text-center text-lg font-bold tracking-wide text-white sm:text-xl">
              La référence en matière de sols
            </h3>
          </div>
          <div className="px-6 py-6 sm:px-10 sm:py-8">
            <p className="text-base leading-relaxed text-gray-700 sm:text-[17px]">
              Etablissement Public (EP) à caractère scientifique et technologique, l&apos;
              <strong className="font-semibold text-amber-900">Institut national de Pédologie (INP)</strong> contribue
              au développement économique et social du Sénégal par l&apos;amélioration de la base productive agricole
              qu&apos;est le sol et le renforcement des capacités des producteurs dans la gestion durable des terres.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-[17px]">
              Ainsi depuis sa création en juin 2004, l&apos;Institut national de Pédologie s&apos;investit dans la lutte
              contre la dégradation des terres. La{" "}
              <strong className="font-semibold text-amber-900">restauration des terres dégradées</strong>, leur{" "}
              <strong className="font-semibold text-amber-900">préservation</strong> et l&apos;augmentation de leur{" "}
              <strong className="font-semibold text-amber-900">productivité</strong> sont les piliers de son
              intervention sur le territoire national.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-[17px]">
              L&apos;avènement de l&apos;INP marque la prise en compte de la{" "}
              <strong className="font-semibold text-amber-900">dimension pédologique (sol)</strong> dans les politiques
              et les programmes de développement agricole.
            </p>
          </div>
        </motion.div>

        {/* Introduction — titre des missions */}
        <motion.div
          className="mt-12 flex items-center gap-4 sm:mt-14"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[var(--inp-beige)] to-[var(--inp-marron)]" aria-hidden />
          <h3 className="shrink-0 rounded-xl border-2 border-[var(--inp-marron)] bg-gradient-to-r from-[var(--inp-vert)] to-[var(--inp-marron)] px-6 py-3 text-center text-lg font-bold tracking-wide text-white shadow-md sm:px-8 sm:text-xl">
            Les missions assignées à l&apos;INP sont
          </h3>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-[var(--inp-beige)] to-[var(--inp-marron)]" aria-hidden />
        </motion.div>

        {/* Grille de cards premium */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2 md:gap-10">
          {MISSIONS.map((mission, i) => {
            const Icon = mission.icon;
            const cycle = i % 3;
            const barColor = cycle === 0
              ? "bg-[var(--inp-vert)]"
              : cycle === 1
                ? "bg-[var(--inp-marron)]"
                : "bg-[var(--inp-beige)]";
            const badgeColor = cycle === 0
              ? "bg-[var(--inp-vert)]"
              : cycle === 1
                ? "bg-[var(--inp-marron)]"
                : "bg-[var(--inp-vert)]";
            const haloColor = cycle === 0
              ? "bg-amber-200"
              : cycle === 1
                ? "bg-[var(--inp-beige)]"
                : "bg-[var(--inp-beige)]";
            const iconColor = cycle === 0
              ? "text-amber-100"
              : cycle === 1
                ? "text-[var(--inp-beige)]/30"
                : "text-amber-100";
            const bgCard = cycle === 0
              ? "bg-gradient-to-br from-white to-amber-50"
              : cycle === 1
                ? "bg-gradient-to-br from-white to-[#f5efe8]"
                : "bg-gradient-to-br from-[#faf7f2] to-amber-50/40";
            return (
              <motion.article
                key={mission.num}
                className={`
                  relative overflow-hidden rounded-3xl border border-gray-200 p-6 shadow-sm
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-lg
                  sm:p-8 md:p-10
                  ${bgCard}
                `}
                {...fadeUp}
                transition={{
                  duration: 0.4,
                  delay: 0.05 + i * 0.06,
                  ease,
                }}
              >
                {/* Barre accent verticale gauche */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl ${barColor}`}
                  aria-hidden
                />

                {/* Icône watermark (coin supérieur droit) */}
                <div
                  className={`absolute right-6 top-6 ${iconColor} sm:right-8 sm:top-8`}
                  aria-hidden
                >
                  <Icon className="h-10 w-10" />
                </div>

                <div className="flex items-start gap-5 pl-2 sm:gap-6 sm:pl-3">
                  {/* Badge numéro avec halo */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`absolute -inset-2 rounded-full ${haloColor} opacity-40 blur-md`}
                      aria-hidden
                    />
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full ${badgeColor} text-lg font-bold text-white shadow-md`}
                      aria-hidden
                    >
                      {mission.num}
                    </div>
                  </div>

                  {/* Texte */}
                  <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
                    {mission.content}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
