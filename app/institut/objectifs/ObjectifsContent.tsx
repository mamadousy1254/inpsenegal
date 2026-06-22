"use client";

import { motion } from "framer-motion";
import { Building2, Target } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export function ObjectifsContent() {
  return (
    <section
      className="bg-[#F6F5F2] py-16 px-4 sm:py-20 md:py-24"
      aria-labelledby="objectifs-title"
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
        {/* Titre page */}
        <motion.h2
          id="objectifs-title"
          className="text-center text-4xl font-bold tracking-wide text-amber-900 sm:text-4xl mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          OBJECTIFS DE L&apos;INP
        </motion.h2>
        <motion.div
          className="mx-auto mb-16 h-1 w-24 rounded-full bg-[var(--inp-vert)]"
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Bloc 1 — Statut institutionnel */}
        <motion.article
          className="relative bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          {/* Accent vertical INP */}
          <div className="absolute left-0 top-0 h-full w-2 bg-[var(--inp-vert)] rounded-l-2xl" />

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="bg-amber-50 p-4 rounded-xl shadow-sm shrink-0">
              <Building2
                className="h-10 w-10 text-amber-800"
                aria-hidden
              />
            </div>
            <p className="text-lg leading-relaxed text-gray-700">
              L&apos;INP est un{" "}
              <strong className="font-semibold text-amber-900">
                établissement public
              </strong>{" "}
              à caractère{" "}
              <strong className="font-semibold text-amber-800">
                scientifique et technologique
              </strong>
              , démembrement du MASAE, créé par{" "}
              <strong className="font-semibold text-[var(--inp-vert)]">
                décret n° 2004-802 du 28 juin 2004
              </strong>
              . Il élargit le cadre institutionnel de pilotage du développement
              rural.
            </p>
          </div>
        </motion.article>

        {/* Bloc 2 — Objectif principal */}
        <motion.article
          className="mt-8 relative bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-8 sm:p-10 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 sm:mt-10"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.25 }}
        >
          {/* Accent vertical INP */}
          <div className="absolute left-0 top-0 h-full w-2 bg-[var(--inp-vert)] rounded-l-2xl" />

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm shrink-0">
              <Target
                className="h-10 w-10 text-amber-800"
                aria-hidden
              />
            </div>
            <p className="text-lg leading-relaxed text-gray-800">
              L&apos;INP a pour objectif de contribuer au{" "}
              <strong className="font-semibold text-amber-900">
                développement économique et social
              </strong>{" "}
              à travers l&apos;
              <strong className="font-semibold text-amber-800">
                éradication de la pauvreté
              </strong>{" "}
              et l&apos;atteinte de la{" "}
              <strong className="font-semibold text-[var(--inp-vert)]">
                souveraineté alimentaire
              </strong>
              .
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
