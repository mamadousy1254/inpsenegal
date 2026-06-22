"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Megaphone, ChevronRight, AlertTriangle, Info } from "lucide-react";
import { demoActualites } from "@/lib/demoActualites";
import { usePathname } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Données — issues du store partagé (chemin canonique /actualites)   */
/* ------------------------------------------------------------------ */

type AnnouncementType = "URGENT" | "COMMUNIQUÉ" | "INFO";

const announcements = demoActualites.map((a) => ({
  id: a.slug,
  type: a.type,
  source: a.source,
  title: a.title,
  href: `/actualites/${a.slug}`, // ← chemin canonique, correspond à app/actualites/[slug]
}));

/* ------------------------------------------------------------------ */
/*  Style des badges par type                                          */
/* ------------------------------------------------------------------ */

const TYPE_CONFIG: Record<
  AnnouncementType,
  { bg: string; label: string; Icon: typeof Megaphone; pulse?: boolean }
> = {
  URGENT: { bg: "#E31B23", label: "URGENT", Icon: AlertTriangle, pulse: true },
  COMMUNIQUÉ: { bg: "#7B4F2A", label: "COMMUNIQUÉ", Icon: Megaphone },
  INFO: { bg: "#00853F", label: "INFO", Icon: Info },
};

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */

export default function AnnouncementBar() {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Préférence d'accessibilité : mouvement réduit
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const next = () => setCurrentIndex((i) => (i + 1) % announcements.length);

  // En mode mouvement réduit : rotation par minuterie (pas de défilement)
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  useEffect(() => {
    if (!reducedMotion) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) next();
    }, 8000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const current = announcements[currentIndex];
  const config = TYPE_CONFIG[current.type];
  const { Icon } = config;

  return pathname.includes("/dashboard") || pathname.includes("/login") ? null : (
    <section
      role="region"
      aria-label="Annonces officielles de l'INP"
      className="relative z-[60] w-full border-b border-[#E5DCC2] bg-[#F8F1E0]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex h-11 w-full items-center gap-3 px-3 sm:gap-4 sm:px-4">
        {/* ── Badge type ── */}
        <span
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: config.bg }}
        >
          {config.pulse ? (
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
          ) : (
            <Icon className="h-3.5 w-3.5" aria-hidden />
          )}
          {config.label}
        </span>

        {/* ── Source (masquée sur mobile) ── */}
        <span className="hidden flex-shrink-0 items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#4A2F1A] md:inline-flex">
          <Megaphone className="h-3.5 w-3.5 text-[#7B4F2A]" aria-hidden />
          {current.source}
        </span>

        {/* ── Zone de défilement ── */}
        <div
          className="relative min-w-0 flex-1 overflow-hidden"
          aria-live="polite"
        >
          {reducedMotion ? (
            <p className="truncate text-[13px] text-[#2A1F18]">
              {current.title}
            </p>
          ) : (
            <p
              key={currentIndex}
              className="whitespace-nowrap pl-[100%] text-[13px] text-[#2A1F18] will-change-transform"
              style={{
                animation: "announce-marquee 38s linear",
                animationPlayState: paused ? "paused" : "running",
              }}
              onAnimationEnd={next}
            >
              {current.title}
            </p>
          )}
        </div>

        {/* ── Bouton LIRE ── */}
        <Link
          href={current.href}
          className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#C9A574] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#bb9560] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4F2A] focus-visible:ring-offset-1"
          aria-label={`Lire l'annonce : ${current.title}`}
        >
          Lire
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
