"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Globe2,
  GraduationCap,
  Handshake,
  Microscope,
  Search,
  ExternalLink,
} from "lucide-react";

import TricolorUnderline from "@/components/TricolorUnderline";
import {
  PARTENAIRE_CATEGORIES_ORDER,
  PARTENAIRE_CATEGORY_ACCENT,
  PARTENAIRE_CATEGORY_COLORS,
  PARTENAIRE_CATEGORY_LABELS,
  type PartenaireCategory,
} from "@/lib/constants/partenaires";
import type { PublicPartenaire } from "@/lib/services/partenaires/serialize-partenaire";

const PARTNER_GRID =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

const LOGO_SIZES = "(max-width: 640px) 72px, (max-width: 1024px) 64px, 72px";

const CATEGORY_ICONS: Record<PartenaireCategory, React.ReactNode> = {
  gouvernement: <Building2 className="size-5" />,
  international: <Globe2 className="size-5" />,
  universite: <GraduationCap className="size-5" />,
  "societe-civile": <Handshake className="size-5" />,
  recherche: <Microscope className="size-5" />,
};

type PartenairesPageClientProps = {
  partenaires: PublicPartenaire[];
};

export function PartenairesPageClient({ partenaires }: PartenairesPageClientProps) {
  const [filter, setFilter] = useState<PartenaireCategory | "all">("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    return PARTENAIRE_CATEGORIES_ORDER.reduce(
      (acc, cat) => {
        acc[cat] = partenaires.filter((p) => p.category === cat).length;
        return acc;
      },
      {} as Record<PartenaireCategory, number>,
    );
  }, [partenaires]);

  const filtered = useMemo(() => {
    return partenaires.filter((p) => {
      const matchCategory = filter === "all" ? true : p.category === filter;
      const q = search.trim().toLowerCase();
      const matchSearch = q
        ? p.acronyme.toLowerCase().includes(q) ||
          p.nom.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.pays || "").toLowerCase().includes(q)
        : true;
      return matchCategory && matchSearch;
    });
  }, [partenaires, filter, search]);

  const isFiltered = filter !== "all" || search.trim().length > 0;

  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E5DCC2] bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #C9A57433 0%, transparent 50%), radial-gradient(circle at 80% 0%, #7B4F2A22 0%, transparent 40%)",
          }}
          aria-hidden
        />
        <div className="container relative mx-auto max-w-5xl px-4 py-14 text-center md:py-16">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm font-medium text-[#7B4F2A] transition-colors hover:text-[#4A2F1A]"
          >
            ← Retour à l&apos;accueil
          </Link>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#C9A574]">
            Réseau institutionnel
          </p>
          <h1 className="mb-4 text-3xl font-bold text-[#2A1F18] md:text-5xl">Nos partenaires</h1>
          <TricolorUnderline className="mx-auto mb-6 mt-2" />
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-[#5A4733] md:text-lg">
            L&apos;Institut national de Pédologie collabore avec un réseau de{" "}
            <strong className="text-[#7B4F2A]">{partenaires.length} partenaires</strong>{" "}
            institutionnels — gouvernement, organisations internationales, universités, société
            civile et centres de recherche — au service de la science des sols.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="container mx-auto max-w-6xl px-4 pt-10">
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {PARTENAIRE_CATEGORIES_ORDER.map((cat, i) => (
            <motion.button
              key={cat}
              type="button"
              onClick={() => setFilter(filter === cat ? "all" : cat)}
              className={`group rounded-2xl border p-4 text-center transition-all duration-300 ${
                filter === cat
                  ? "border-[#7B4F2A] bg-white shadow-md ring-2 ring-[#7B4F2A]/20"
                  : "border-[#E5DCC2] bg-white hover:border-[#C9A574] hover:shadow-sm"
              }`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className="mx-auto mb-2 flex size-9 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110"
                style={{ backgroundColor: PARTENAIRE_CATEGORY_ACCENT[cat] }}
              >
                {CATEGORY_ICONS[cat]}
              </div>
              <div className="text-2xl font-bold text-[#7B4F2A] md:text-3xl">{stats[cat]}</div>
              <p className="mt-1 text-[11px] leading-tight text-[#5A4733] md:text-xs">
                {PARTENAIRE_CATEGORY_LABELS[cat]}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Recherche + filtres */}
        <div className="mb-8 rounded-2xl border border-[#E5DCC2] bg-white p-5 shadow-sm">
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7B4F2A]"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un partenaire…"
              className="w-full rounded-full border border-[#E5DCC2] py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#7B4F2A] focus:ring-2 focus:ring-[#7B4F2A]/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label={`Tous (${partenaires.length})`}
            />
            {PARTENAIRE_CATEGORIES_ORDER.map((cat) => (
              <FilterPill
                key={cat}
                active={filter === cat}
                onClick={() => setFilter(cat)}
                label={`${PARTENAIRE_CATEGORY_LABELS[cat]} (${stats[cat]})`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="container mx-auto max-w-6xl px-4 pb-16">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center"
            >
              <p className="text-lg text-[#5A4733]">Aucun partenaire trouvé</p>
              <p className="mt-1 text-sm text-[#8B7355]">Essayez un autre filtre ou mot-clé.</p>
            </motion.div>
          ) : isFiltered ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={PARTNER_GRID}
            >
              {filtered.map((p, i) => (
                <PartenaireCard key={p.id} partenaire={p} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="sections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {PARTENAIRE_CATEGORIES_ORDER.map((cat) => {
                const catPartenaires = partenaires.filter((p) => p.category === cat);
                if (catPartenaires.length === 0) return null;
                return (
                  <CategorySection
                    key={cat}
                    category={cat}
                    label={PARTENAIRE_CATEGORY_LABELS[cat]}
                    partenaires={catPartenaires}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 rounded-xl border-l-4 border-[#C9A574] bg-[#FBF3E2] p-4 text-sm text-[#7B4F2A]">
          <strong>Note :</strong> Cette liste rassemble les partenaires institutionnels actifs de
          l&apos;INP. Les logos sont la propriété de leurs organisations respectives.
        </div>
      </div>
    </main>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
        active
          ? "bg-[#7B4F2A] text-white shadow-sm"
          : "bg-[#F8F1E0] text-[#5A4733] hover:bg-[#E5DCC2]"
      }`}
    >
      {label}
    </button>
  );
}

function CategorySection({
  category,
  label,
  partenaires,
}: {
  category: PartenaireCategory;
  label: string;
  partenaires: PublicPartenaire[];
}) {
  const accent = PARTENAIRE_CATEGORY_ACCENT[category];

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2.5 border-b border-[#C9A574]/60 pb-2.5">
        <div
          className="flex size-8 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: accent }}
        >
          {CATEGORY_ICONS[category]}
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-[#7B4F2A] md:text-xl">{label}</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PARTENAIRE_CATEGORY_COLORS[category]}`}
          >
            {partenaires.length}
          </span>
        </div>
      </div>

      <div className={PARTNER_GRID}>
        {partenaires.map((p, i) => (
          <PartenaireCard key={p.id} partenaire={p} index={i} accent={accent} />
        ))}
      </div>
    </section>
  );
}

function PartenaireCard({
  partenaire,
  index,
  accent,
}: {
  partenaire: PublicPartenaire;
  index: number;
  accent?: string;
}) {
  const borderColor = accent ?? PARTENAIRE_CATEGORY_ACCENT[partenaire.category];
  const CardWrapper = partenaire.siteWeb ? "a" : "div";
  const cardProps = partenaire.siteWeb
    ? {
        href: partenaire.siteWeb,
        target: "_blank" as const,
        rel: "noopener noreferrer" as const,
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.25 }}
    >
      <CardWrapper
        {...cardProps}
        className={`group relative flex h-full gap-3 overflow-hidden rounded-xl border border-[#E5DCC2]/90 bg-white p-3 shadow-sm transition-all duration-200 ${
          partenaire.siteWeb ? "hover:border-[#C9A574] hover:shadow-md" : ""
        }`}
      >
        <div
          className="absolute left-0 top-0 h-full w-0.5"
          style={{ backgroundColor: borderColor }}
          aria-hidden
        />

        {/* Logo compact */}
        <div className="relative ml-1 h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-[#E5DCC2]/60 bg-[#FAF7F0] p-1.5">
          <Image
            src={partenaire.logo}
            alt={`Logo ${partenaire.acronyme}`}
            fill
            className="object-contain object-center p-0.5"
            sizes={LOGO_SIZES}
            loading="lazy"
          />
        </div>

        {/* Contenu */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="truncate text-sm font-bold text-[#2A1F18] transition-colors group-hover:text-[#7B4F2A]">
              {partenaire.acronyme}
            </h3>
            {partenaire.pays && (
              <span
                className={`max-w-[5.5rem] shrink-0 truncate rounded px-1.5 py-0.5 text-[9px] font-bold leading-none ${PARTENAIRE_CATEGORY_COLORS[partenaire.category]}`}
                title={partenaire.pays}
              >
                {partenaire.pays}
              </span>
            )}
          </div>

          <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-[#5A4733]">
            {partenaire.nom}
          </p>
          <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-snug text-[#8B7355]">
            {partenaire.description}
          </p>

          {partenaire.siteWeb && (
            <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#7B4F2A] opacity-80 transition-opacity group-hover:opacity-100">
              Site web
              <ExternalLink className="size-2.5" aria-hidden />
            </span>
          )}
        </div>
      </CardWrapper>
    </motion.div>
  );
}
