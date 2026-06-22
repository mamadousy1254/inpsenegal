"use client";

import Link from "next/link";
import { demoDelegations } from "@/lib/demoDelegations";

export default function HomeDelegations() {
  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#C9A574] tracking-wider uppercase mb-3">
            Ancrage territorial
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A1F18] mb-4">
            Nos délégations pédoclimatiques
          </h2>
          <p className="text-base md:text-lg text-[#5A4733] max-w-3xl mx-auto leading-relaxed">
            La Direction Centrale de l&apos;INP est basée à Dakar, avec 8 délégations
            pédoclimatiques couvrant l&apos;ensemble du territoire national. Chaque
            délégation est spécialisée selon les enjeux pédologiques de sa zone.
          </p>
        </div>

        {/* Disposition : carte du Sénégal à gauche + grille des délégations à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Carte du Sénégal */}
          <div className="bg-[#F8F1E0] rounded-lg p-4 border border-[#E5DCC2] shadow-sm">
            <Link href="/institut/organigramme" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/institut/carte-senegal.png"
                alt="Carte des délégations pédoclimatiques de l'INP au Sénégal"
                className="w-full h-auto rounded"
              />
              <p className="text-center mt-3 text-sm text-[#7B4F2A] font-medium">
                Voir l&apos;organigramme complet →
              </p>
            </Link>
          </div>

          {/* Grille des 8 délégations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {demoDelegations.map((d) => (
              <Link
                key={d.slug}
                href={`/institut/delegations/${d.slug}`}
                className="group bg-white rounded-lg border border-[#E5DCC2] p-4 hover:shadow-md hover:border-[#C9A574] transition-all flex items-center gap-3"
              >
                <div
                  className="w-1.5 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2A1F18] group-hover:text-[#7B4F2A] transition-colors text-sm leading-tight">
                    {d.shortName}
                  </p>
                  <p className="text-xs text-[#5A4733] truncate">{d.chefLieu}</p>
                </div>
                <span
                  className="text-[#C9A574] group-hover:translate-x-1 transition-transform text-sm"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bouton voir plus */}
        <div className="text-center mt-10">
          <Link
            href="/institut/organigramme"
            className="inline-flex items-center gap-2 bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Découvrir l&apos;organigramme complet
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
