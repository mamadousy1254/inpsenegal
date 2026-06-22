"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/** Ligne verte horizontale entre deux blocs */
function LineConnector() {
  return (
    <div
      className="hidden h-[2px] w-4 flex-shrink-0 self-center bg-amber-700 md:block lg:w-6"
      aria-hidden
    />
  );
}

export function Axe1ProcessSection() {
  return (
    <div className="space-y-10 pt-4">
      {/* Titre principal AXE 1 */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-red-700 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white shadow-md">
            AXE 1
          </span>
          <h3 className="text-3xl font-semibold leading-tight text-amber-900 md:text-4xl">
            Amélioration de la connaissance des caractéristiques des sols
          </h3>
        </div>
        <div className="mt-4 h-1 w-24 bg-amber-700" aria-hidden />
      </div>

      {/* Sous-titre Terrain */}
      <p
        className="border-l-4 border-amber-700 pl-4 text-sm font-semibold uppercase tracking-wide text-amber-800"
        aria-hidden
      >
        Terrain
      </p>

      {/* Processus : 4 étapes uniquement (sans Prélèvement ni Échantillons séparés) */}
      <div className="relative">
        {/* Rangée 1 : Prospection → Délimitation → Plan d'échantillonnage */}
        <div className="relative z-10 flex flex-wrap items-stretch justify-center gap-y-6 md:flex-nowrap md:gap-x-0">
          <StepCard
            title="Prospection"
            image="/images/institut/axe1/prospection.png"
            alt="Prospection terrain"
          />
          <LineConnector />
          <StepCard
            title="Délimitation"
            image="/images/institut/axe1/delimitation.png"
            alt="Délimitation GPS"
          />
          <LineConnector />
          <StepCard
            title="Plan d'échantillonnage"
            image="/images/institut/axe1/echantillonnage.png"
            alt="Localités d'échantillonnage et contour parcelle"
          />
        </div>

        {/* Ligne verte descendante : Plan d'échantillonnage → Plan géomètre */}
        <div className="relative z-10 flex justify-center">
          <div
            className="hidden h-10 w-[2px] bg-amber-700 md:block"
            aria-hidden
          />
        </div>

        {/* Rangée 2 : Plan géomètre uniquement (image sacs + données officielles) */}
        <div className="relative z-10 mt-6 flex justify-center md:mt-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <h4 className="mb-3 text-base font-semibold text-amber-900">
              Plan géomètre
            </h4>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
              <Image
                src="/images/institut/axe1/echantillons.png"
                alt="Échantillons de sols"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
                unoptimized
              />
            </div>
            <div className="mt-3 space-y-1 text-xs text-gray-700">
              <p><strong>République du Sénégal</strong></p>
              <p>Région de Diourbel — Département de Touba — Commune de Médina Ndiath</p>
              <p>Superficie : 1 ha. 95 a. 23 m² — Propriétaire : Melle Ndiaye</p>
              <p>Surface parcelle : 19 523 m²</p>
              <p>Voisinage : Ferme Cheikh Diène, Ferme Ndiaye, Saada, Non identifié</p>
              <p>Daté le 16/09/2025</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  title,
  image,
  alt,
}: {
  title: string;
  image: string;
  alt: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex w-full max-w-[280px] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md md:max-w-none"
    >
      <h4 className="border-b border-gray-100 px-4 py-2 text-center text-sm font-semibold text-amber-900 md:text-base">
        {title}
      </h4>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
          unoptimized
        />
      </div>
      {title === "Plan d'échantillonnage" && (
        <p className="px-2 py-1 text-center text-xs text-gray-500">
          Localités d&apos;échantillonnage — Contour parcelle
        </p>
      )}
    </motion.article>
  );
}
