"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { demoDirecteurs, getDirecteurEnPoste } from "@/lib/demoDirecteurs";

export default function HomeHistoryShort() {
  const dgActuel = getDirecteurEnPoste();
  const anneeCreation = Math.min(
    ...demoDirecteurs.map((d) => new Date(d.dateDebut).getFullYear())
  );
  const anneeDGActuel = dgActuel
    ? new Date(dgActuel.dateDebut).getFullYear()
    : null;

  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* En-tête (format drapeau unifié = SectionTitle) */}
        <SectionTitle
          align="center"
          className="mb-10"
          label="Notre histoire"
          subtitle="Depuis sa création, l'INP a été dirigé par des personnalités qui ont marqué son évolution institutionnelle et scientifique."
        >
          Une institution au service du Sénégal
        </SectionTitle>

        {/* 3 chiffres clés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {/* Année création */}
          <div className="text-center p-6 bg-[#F8F1E0] rounded-xl border border-[#E5DCC2]">
            <div className="text-4xl md:text-5xl font-bold text-[#7B4F2A] mb-2">
              {anneeCreation}
            </div>
            <p className="text-sm text-[#5A4733] font-medium">
              Année de création
            </p>
            <p className="text-xs text-[#8B7355] mt-1 italic">
              Décret n°2004-802
            </p>
          </div>

          {/* Nombre de DG */}
          <div className="text-center p-6 bg-[#F8F1E0] rounded-xl border border-[#E5DCC2]">
            <div className="text-4xl md:text-5xl font-bold text-[#7B4F2A] mb-2">
              {demoDirecteurs.length}
            </div>
            <p className="text-sm text-[#5A4733] font-medium">
              Directeurs Généraux successifs
            </p>
            <p className="text-xs text-[#8B7355] mt-1 italic">
              Depuis {anneeCreation}
            </p>
          </div>

          {/* DG actuel — carte distinctive */}
          <div className="text-center p-6 bg-[#7B4F2A] rounded-xl border-2 border-[#C9A574] relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[#FDEF42] text-lg" aria-hidden="true">
              ★
            </div>
            <div className="text-4xl md:text-5xl font-bold text-[#C9A574] mb-2">
              {anneeDGActuel}
            </div>
            <p className="text-sm text-white font-bold leading-tight">
              {dgActuel?.nom}
            </p>
            <p className="text-xs text-white/80 mt-1 italic">
              Directeur Général en exercice
            </p>
          </div>
        </div>

        {/* CTA vers la page Présentation (qui contient la timeline complète) */}
        <div className="text-center">
          <Link
            href="/institut/presentation"
            className="inline-flex items-center gap-2 bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Découvrir notre histoire complète
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
