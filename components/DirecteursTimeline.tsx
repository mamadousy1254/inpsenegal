"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getDirecteursParOrdre, type Directeur } from "@/lib/demoDirecteurs";

export default function DirecteursTimeline() {
  const directeurs = getDirecteursParOrdre();

  return (
    <section className="w-full bg-[#F8F1E0] py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* En-tête de section (format drapeau unifié = SectionTitle) */}
        <SectionTitle
          align="center"
          className="mb-12"
          label="Notre histoire"
          subtitle="Depuis sa création, l'Institut national de Pédologie a été dirigé par des personnalités qui ont marqué son évolution institutionnelle et scientifique au service de l'agriculture durable du Sénégal."
        >
          Les Directeurs de l&apos;INP
        </SectionTitle>

        {/* Timeline verticale */}
        <div className="relative pt-4">
          {/* Ligne verticale tricolore décorative */}
          <div
            className="absolute left-10 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, #00853F 0%, #00853F 28%, #FDEF42 28%, #FDEF42 62%, #E31B23 62%, #E31B23 100%)",
            }}
            aria-hidden="true"
          />

          {/* Étapes de la timeline */}
          <div className="space-y-14 md:space-y-20">
            {directeurs.map((directeur, idx) => (
              <DirecteurTimelineItem
                key={directeur.id}
                directeur={directeur}
                isEven={idx % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* Note disclaimer */}
        <div className="mt-16 p-4 bg-[#FBF3E2] border-l-4 border-[#C9A574] rounded text-sm text-[#7B4F2A] max-w-3xl mx-auto">
          <strong>Note :</strong> Les éléments biographiques sont une présentation
          synthétique. Les contenus officiels seront enrichis par les services de
          l&apos;INP via le back-office.
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────
// Sous-composant : item de timeline
// ──────────────────────────────────────────────────
function DirecteurTimelineItem({
  directeur,
  isEven,
}: {
  directeur: Directeur;
  isEven: boolean;
}) {
  const annee = new Date(directeur.dateDebut).getFullYear();

  return (
    <div className="relative">
      {/* Cercle photo aligné sur la ligne verticale */}
      <div className="absolute left-10 md:left-1/2 -translate-x-1/2 z-10">
        <div
          className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 shadow-lg ${
            directeur.enPoste
              ? "border-[#C9A574] ring-4 ring-[#C9A574]/30"
              : "border-white"
          }`}
        >
          {/* Fallback initiales (en dessous de l'image) */}
          <div className="absolute inset-0 bg-[#7B4F2A] flex items-center justify-center">
            <span className="text-xl md:text-2xl font-bold text-white">
              {directeur.nom
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>

          <Image
            src={directeur.photo}
            alt={directeur.nom}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, 112px"
          />

          {/* Étoile pour le DG en exercice */}
          {directeur.enPoste && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#FDEF42] border-2 border-white flex items-center justify-center shadow-md z-20">
              <span className="text-xs md:text-sm">★</span>
            </div>
          )}
        </div>
        {/* Année sous le cercle */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#7B4F2A] text-white text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow">
          {annee}
        </div>
      </div>

      {/* Carte d'information — alternée gauche/droite sur desktop */}
      <div
        className={`pl-28 md:pl-0 md:flex ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        <div
          className={`w-full md:w-1/2 ${
            isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
          }`}
        >
          <article
            className={`bg-white rounded-xl shadow-md border overflow-hidden ${
              directeur.enPoste
                ? "border-[#C9A574] ring-1 ring-[#C9A574]/30"
                : "border-[#E5DCC2]"
            }`}
          >
            {/* Bande supérieure colorée */}
            <div
              className="h-2 w-full"
              style={{
                backgroundColor: directeur.enPoste ? "#C9A574" : "#7B4F2A",
              }}
              aria-hidden="true"
            />

            <div className="p-5 md:p-6 text-left">
              {/* Badge "En poste" si applicable */}
              {directeur.enPoste && (
                <span className="inline-block bg-[#C9A574] text-[#2A1F18] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  ★ EN POSTE
                </span>
              )}

              {/* Titre */}
              <p className="text-xs font-semibold text-[#C9A574] tracking-wider uppercase mb-1">
                {directeur.titre}
              </p>

              {/* Nom */}
              <h3 className="text-xl md:text-2xl font-bold text-[#2A1F18] mb-2 leading-tight">
                {directeur.nom}
              </h3>

              {/* Période */}
              <p className="text-sm text-[#5A4733] mb-4 font-medium">
                {directeur.periode}
              </p>

              {/* Contribution */}
              <p className="text-sm text-[#2A1F18] leading-relaxed">
                {directeur.contributionLongue || directeur.contributionCourte}
              </p>

              {/* Citation (si présente) */}
              {directeur.citation && (
                <blockquote className="border-l-2 border-[#C9A574] pl-4 italic text-sm text-[#5A4733] mt-4">
                  « {directeur.citation} »
                </blockquote>
              )}
            </div>
          </article>
        </div>
        {/* Espace de l'autre côté sur desktop */}
        <div className="hidden md:block md:w-1/2" />
      </div>
    </div>
  );
}
