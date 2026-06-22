import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import DirecteursTimeline from "@/components/DirecteursTimeline";

import { Gouvernance } from "@/components/institut/Gouvernance";

export const metadata: Metadata = {
  title: "Présentation de l'INP",
  description:
    "Découvrez l'INP : établissement public scientifique et technologique, historique, organisation et gouvernance. Référence nationale en science des sols.",
};

export default function PresentationPage() {
  return (
    <>
      <PageHero
        label="L'Institut"
        title="Présentation de l'INP"
        subtitle="Institut parapublic à caractère scientifique et technologique — Historique, organisation et gouvernance."
      />

      {/* Bloc intro institutionnel */}
      <section className="py-16 px-4 sm:py-20 bg-gradient-to-br from-amber-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="relative bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm">
            {/* Accent vertical INP */}
            <div className="absolute left-0 top-0 h-full w-2 bg-[var(--inp-vert)] rounded-l-2xl" />

            <h2 className="text-3xl font-semibold text-amber-900 mb-8">
              Présentation de l&apos;Institut
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p>
                <span className="font-semibold text-amber-900">
                  L&apos;Institut national de Pédologie (INP)
                </span>{" "}
                est un établissement public à caractère scientifique et technologique,
                démembrement du MASAE.
              </p>

              <p>
                Créé par{" "}
                <span className="font-semibold text-amber-800">
                  décret n°2004-802 du 28 juin 2004
                </span>,
                il contribue au développement économique et social du Sénégal
                et au renforcement de la{" "}
                <span className="font-semibold text-[var(--inp-vert)]">
                  souveraineté alimentaire
                </span>.
              </p>

              <p>
                Référence nationale en science des sols,
                l&apos;INP assure des missions de recherche,
                de cartographie pédologique,
                d&apos;expertise et d&apos;appui aux politiques publiques agricoles.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DirecteursTimeline />
      <Gouvernance />
    </>
  );
}
