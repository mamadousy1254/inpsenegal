"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import TricolorUnderline from "@/components/TricolorUnderline";
import {
  INSTITUT_DG_SLUG,
  INSTITUT_POLE_COLORS,
  INSTITUT_POLE_DESCRIPTIONS,
  INSTITUT_POLE_LABELS,
  INSTITUT_POLES_ORDER,
  getInitialesInstitut,
  type InstitutPoleType,
} from "@/lib/constants/institut";
import type { PublicInstitutMembre } from "@/lib/services/institut/serialize-institut-membre";

type EquipePageClientProps = {
  membres: PublicInstitutMembre[];
};

export function EquipePageClient({ membres }: EquipePageClientProps) {
  const [search, setSearch] = useState("");
  const [poleFilter, setPoleFilter] = useState<InstitutPoleType | "all">("all");

  const stats = useMemo(() => {
    const zones = new Set(
      membres.filter((m) => m.zone && m.pole === "delegations").map((m) => m.zone),
    );
    return { total: membres.length, poles: INSTITUT_POLES_ORDER.length, zones: zones.size };
  }, [membres]);

  const filtered = useMemo(() => {
    return membres.filter((m) => {
      const matchSearch = search
        ? m.nom.toLowerCase().includes(search.toLowerCase()) ||
          m.fonction.toLowerCase().includes(search.toLowerCase()) ||
          (m.zone || "").toLowerCase().includes(search.toLowerCase())
        : true;
      const matchPole = poleFilter === "all" ? true : m.pole === poleFilter;
      return matchSearch && matchPole;
    });
  }, [membres, search, poleFilter]);

  const isSearching = search.trim().length > 0 || poleFilter !== "all";

  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="bg-white border-b border-[#E5DCC2]">
        <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
          <Link
            href="/"
            className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-6 font-medium text-sm"
          >
            ← Retour à l&apos;accueil
          </Link>

          <p className="text-sm font-semibold text-[#C9A574] tracking-wider uppercase mb-3">
            Notre équipe
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[#2A1F18] mb-4">
            Les femmes et les hommes de l&apos;INP
          </h1>
          <TricolorUnderline className="mb-6 mt-2 mx-auto" />
          <p className="text-base md:text-lg text-[#5A4733] max-w-3xl mx-auto leading-relaxed">
            L&apos;Institut national de Pédologie réunit des compétences variées — scientifiques,
            techniques, administratives et territoriales — au service de la science des sols et de
            la souveraineté alimentaire du Sénégal.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-10 max-w-6xl">
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
          <div className="bg-white rounded-xl border border-[#E5DCC2] p-5 text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#7B4F2A]">{stats.total}</div>
            <p className="text-xs md:text-sm text-[#5A4733] mt-1">Collaborateurs</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5DCC2] p-5 text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#7B4F2A]">{stats.poles}</div>
            <p className="text-xs md:text-sm text-[#5A4733] mt-1">Pôles d&apos;expertise</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5DCC2] p-5 text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#7B4F2A]">{stats.zones}</div>
            <p className="text-xs md:text-sm text-[#5A4733] mt-1">Zones couvertes</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5DCC2] p-5 mb-8">
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B4F2A]" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, fonction ou zone..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5DCC2] rounded-full focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPoleFilter("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                poleFilter === "all"
                  ? "bg-[#7B4F2A] text-white"
                  : "bg-[#F8F1E0] text-[#5A4733] hover:bg-[#E5DCC2]"
              }`}
            >
              Tous ({membres.length})
            </button>
            {INSTITUT_POLES_ORDER.map((pole) => {
              const count = membres.filter((m) => m.pole === pole).length;
              return (
                <button
                  key={pole}
                  onClick={() => setPoleFilter(pole)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    poleFilter === pole
                      ? "bg-[#7B4F2A] text-white"
                      : "bg-[#F8F1E0] text-[#5A4733] hover:bg-[#E5DCC2]"
                  }`}
                >
                  {INSTITUT_POLE_LABELS[pole]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 max-w-6xl">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#5A4733] text-lg mb-2">Aucun résultat</p>
            <p className="text-[#8B7355] text-sm">Essayez avec d&apos;autres mots-clés.</p>
          </div>
        ) : isSearching ? (
          (() => {
            const onlyDirection =
              poleFilter === "direction" &&
              filtered.length > 0 &&
              filtered.every((m) => m.pole === "direction");

            if (onlyDirection) {
              return <DirectionGeneraleSection membres={filtered} showHeader={false} />;
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((m) => (
                  <MembreCard key={m.id} membre={m} />
                ))}
              </div>
            );
          })()
        ) : (
          INSTITUT_POLES_ORDER.map((pole) => {
            const poleMembres = membres.filter((m) => m.pole === pole);
            if (poleMembres.length === 0) return null;

            if (pole === "direction") {
              return <DirectionGeneraleSection key={pole} membres={poleMembres} />;
            }

            return (
              <section key={pole} className="mb-12">
                <div className="mb-5 pb-3 border-b-2 border-[#C9A574]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-[#7B4F2A]">
                      {INSTITUT_POLE_LABELS[pole]}
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F8F1E0] text-[#7B4F2A]">
                      {poleMembres.length}
                    </span>
                  </div>
                  <p className="text-sm text-[#5A4733] mt-1">{INSTITUT_POLE_DESCRIPTIONS[pole]}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {poleMembres.map((m) => (
                    <MembreCard key={m.id} membre={m} />
                  ))}
                </div>
              </section>
            );
          })
        )}

        <div className="mt-12 p-4 bg-[#FBF3E2] border-l-4 border-[#C9A574] rounded text-sm text-[#7B4F2A]">
          <strong>Note :</strong> Effectif officiel de l&apos;INP (liste à jour mai 2026). Les
          photographies individuelles seront ajoutées progressivement par les services de
          l&apos;Institut.
        </div>
      </div>
    </main>
  );
}

function DirectionGeneraleSection({
  membres,
  showHeader = true,
}: {
  membres: PublicInstitutMembre[];
  showHeader?: boolean;
}) {
  const dg = membres.find((m) => m.id === INSTITUT_DG_SLUG);
  const autres = membres.filter((m) => m.id !== INSTITUT_DG_SLUG);

  return (
    <section className="mb-12">
      {showHeader && (
        <div className="mb-5 pb-3 border-b-2 border-[#C9A574]">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-[#7B4F2A]">
              {INSTITUT_POLE_LABELS.direction}
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F8F1E0] text-[#7B4F2A]">
              {membres.length}
            </span>
          </div>
          <p className="text-sm text-[#5A4733] mt-1">{INSTITUT_POLE_DESCRIPTIONS.direction}</p>
        </div>
      )}

      {dg && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-sm">
            <MembreCard membre={dg} featured />
          </div>
        </div>
      )}

      {dg && autres.length > 0 && (
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div className="w-px h-6 bg-[#C9A574]" />
        </div>
      )}

      {autres.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {autres.map((m) => (
            <MembreCard key={m.id} membre={m} />
          ))}
        </div>
      )}
    </section>
  );
}

function MembreCard({
  membre,
  featured = false,
}: {
  membre: PublicInstitutMembre;
  featured?: boolean;
}) {
  const initiales = getInitialesInstitut(membre.nom);
  const accent = INSTITUT_POLE_COLORS[membre.pole];

  return (
    <article
      className={`group bg-white rounded-xl border overflow-hidden flex flex-col items-center text-center p-6 cursor-default
        transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl
        ${
          featured
            ? "border-[#C9A574] ring-1 ring-[#C9A574]/30 shadow-md"
            : "border-[#E5DCC2] shadow-sm hover:border-[#C9A574]"
        }`}
    >
      <div
        className={`relative rounded-full overflow-hidden flex-shrink-0 border-2 mb-4
          transition-transform duration-300 ease-out group-hover:scale-110
          ${
            featured
              ? "w-28 h-28 border-[#C9A574] ring-4 ring-[#C9A574]/20"
              : "w-20 h-20 border-[#E5DCC2] group-hover:border-[#C9A574]"
          }`}
      >
        {membre.photo ? (
          <Image
            src={membre.photo}
            alt={membre.nom}
            fill
            className="object-cover"
            sizes={featured ? "112px" : "80px"}
          />
        ) : (
          <div
            className={`absolute inset-0 ${accent} flex items-center justify-center transition-transform duration-300`}
          >
            <span className={`font-bold text-white ${featured ? "text-3xl" : "text-xl"}`}>
              {initiales}
            </span>
          </div>
        )}
      </div>

      <h3
        className={`font-bold text-[#2A1F18] leading-tight transition-colors duration-300 group-hover:text-[#7B4F2A]
          ${featured ? "text-xl" : "text-base"}`}
      >
        {membre.nom}
      </h3>

      <p
        className={`text-[#7B4F2A] font-semibold mt-1 leading-snug ${featured ? "text-base" : "text-sm"}`}
      >
        {membre.fonction}
      </p>

      {membre.zone && (
        <span className="inline-flex items-center gap-1 mt-3 text-xs text-[#5A4733] bg-[#F8F1E0] px-2.5 py-1 rounded-full transition-colors duration-300 group-hover:bg-[#C9A574]/20">
          <span aria-hidden="true">📍</span> {membre.zone}
        </span>
      )}
    </article>
  );
}
