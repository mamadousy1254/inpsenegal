"use client";

import Link from "next/link";
import { demoPartenaires } from "@/lib/demoPartenaires";

export default function PartnersMarquee() {
  // Liste triplée pour un défilement continu sans saut visible
  const tripled = [...demoPartenaires, ...demoPartenaires, ...demoPartenaires];

  return (
    <section
      className="w-full bg-[#F8F1E0] border-y border-[#E5DCC2] py-10 overflow-hidden"
      aria-label="Partenaires de l'Institut national de Pédologie"
    >
      <div className="container mx-auto px-4 mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#7B4F2A] mb-2">
          Ils nous font confiance
        </h2>
        <p className="text-[#5A4733] text-sm md:text-base">
          Institutions partenaires, organismes techniques et universités collaborant avec l&apos;INP.
        </p>
      </div>

      {/* Conteneur de défilement */}
      <div className="partners-marquee-container" style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <div
          className="partners-marquee-track"
          style={{ display: "flex", alignItems: "center", gap: "32px", width: "max-content", willChange: "transform" }}
        >
          {tripled.map((p, idx) => (
            <Link
              key={`${p.id}-${idx}`}
              href="/partenaires"
              className="group"
              style={{ flexShrink: 0 }}
              aria-label={`En savoir plus sur les partenariats — ${p.nom}`}
            >
              <div className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] flex items-center justify-center w-40 h-24 p-4 transition-all duration-300 group-hover:shadow-md group-hover:border-[#C9A574]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.logo}
                  alt={`Logo ${p.acronyme}`}
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 text-center">
        <Link
          href="/partenaires"
          className="inline-flex items-center gap-2 text-[#7B4F2A] hover:text-[#4A2F1A] font-medium border-b-2 border-[#C9A574] hover:border-[#7B4F2A] pb-0.5 transition-colors"
        >
          Voir tous nos partenaires
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
