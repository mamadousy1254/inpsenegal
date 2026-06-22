"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { heroSlides, type HeroSlide } from "@/lib/heroSlides";

/* ------------------------------------------------------------------ */
/*  Contenu d'une slide DG (vitrine institutionnelle)                  */
/* ------------------------------------------------------------------ */

function DGSlideContent({ slide }: { slide: HeroSlide }) {
  return (
    <div className="container mx-auto h-full px-4 md:px-8 flex flex-col justify-end lg:justify-center pt-16 lg:pt-20 pb-24 lg:pb-16">
      {/* Texte UNIQUEMENT dans la moitié gauche (zone vide de la photo) */}
      <div className="w-full lg:w-1/2 max-w-2xl text-white">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-12 bg-[#C9A574]" />
          <span
            className="text-[#C9A574] text-xs md:text-sm font-semibold tracking-[0.2em] uppercase"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
          >
            {slide.eyebrow}
          </span>
        </div>

        {/* Titre */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 lg:mb-5 tracking-tight">
          {slide.title}
        </h1>

        {/* Sous-titre */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 leading-relaxed mb-5 lg:mb-6">
          {slide.subtitle}
        </p>

        {/* Citation (masquée sur très petit écran pour gagner de la place) */}
        {slide.description && (
          <blockquote className="hidden sm:block border-l-2 border-[#C9A574] pl-4 italic text-sm md:text-base text-white/90 mb-5 lg:mb-7">
            {slide.description}
          </blockquote>
        )}

        {/* Signature DG — inline, sobre (pas de cartouche flottant) */}
        <div className="flex items-center gap-3 mb-5 lg:mb-7">
          <div className="w-1 h-9 lg:h-10 bg-[#C9A574] rounded-full" />
          <div>
            <p className="text-base lg:text-lg font-bold text-white leading-tight">
              {slide.dgName}
            </p>
            <p className="text-white/75 text-xs lg:text-sm">{slide.dgRole}</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={slide.primaryCta.href}
            className="inline-flex items-center gap-2 bg-[#C9A574] hover:bg-[#B3935F] text-[#2A1F18] px-6 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            {slide.primaryCta.label}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={slide.secondaryCta.href}
            className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold transition-all backdrop-blur-sm"
          >
            {slide.secondaryCta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contenu d'une slide thématique                                     */
/* ------------------------------------------------------------------ */

function ThematicSlideContent({ slide }: { slide: HeroSlide }) {
  return (
    <div className="max-w-3xl text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-12 bg-[#C9A574]" />
        <span
          className="text-[#C9A574] text-xs md:text-sm font-semibold tracking-[0.2em] uppercase"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        >
          {slide.eyebrow}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 lg:mb-6 tracking-tight">
        {slide.title}
      </h1>

      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed mb-6 lg:mb-8 max-w-2xl">
        {slide.subtitle}
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href={slide.primaryCta.href}
          className="inline-flex items-center gap-2 bg-[#C9A574] hover:bg-[#B3935F] text-[#2A1F18] px-6 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          {slide.primaryCta.label}
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href={slide.secondaryCta.href}
          className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold transition-all backdrop-blur-sm"
        >
          {slide.secondaryCta.label}
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const progressRef = useRef<HTMLSpanElement>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  /* Reset progress bar animation when slide changes */
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    if (isPlaying) {
      el.style.animation = "hero-progress 6s linear forwards";
    }
  }, [activeIndex, isPlaying]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    if ((autoplay as { isPlaying: () => boolean }).isPlaying()) {
      (autoplay as { stop: () => void }).stop();
      setIsPlaying(false);
    } else {
      (autoplay as { play: () => void }).play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  const slide = heroSlides[activeIndex];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#2A1F18]"
      style={{ height: "88vh", minHeight: 640 }}
      aria-roledescription="carousel"
      aria-label="Hero – Institut national de Pédologie"
    >
      {/* ── Embla viewport (images) ── */}
      <div
        ref={emblaRef}
        className="absolute inset-0 overflow-hidden"
        style={{ height: "100%", width: "100%" }}
      >
        <div className="flex h-full">
          {heroSlides.map((s, i) => (
            <div
              key={s.id}
              className="relative"
              style={{ flex: "0 0 100%", minWidth: 0, height: "100%" }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} sur ${heroSlides.length}`}
            >
              {s.variant === "dg" ? (
                /* Slide DG : photo institutionnelle EN FOND PLEIN ÉCRAN, intacte.
                   Le DG est cadré à droite ; le texte occupe la zone gauche vide. */
                <>
                  <div className="absolute inset-0">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      className="object-cover object-[60%_30%] lg:object-[center_28%]"
                      sizes="100vw"
                      priority={i === 0}
                    />
                  </div>
                  {/* Desktop : dégradé gauche→droite, totalement transparent à droite (DG intact) */}
                  <div
                    className="absolute inset-0 pointer-events-none hidden lg:block"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(42, 31, 24, 0.55) 0%, rgba(42, 31, 24, 0.35) 30%, rgba(42, 31, 24, 0.05) 50%, rgba(42, 31, 24, 0) 60%)",
                    }}
                    aria-hidden
                  />
                  {/* Mobile : dégradé bas→haut renforcé (texte lisible en bas, DG en filigrane au-dessus) */}
                  <div
                    className="absolute inset-0 pointer-events-none lg:hidden"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(42, 31, 24, 0.95) 0%, rgba(42, 31, 24, 0.88) 35%, rgba(42, 31, 24, 0.65) 55%, rgba(42, 31, 24, 0.2) 80%, rgba(42, 31, 24, 0) 100%)",
                    }}
                    aria-hidden
                  />
                </>
              ) : (
                /* Slides thématiques : photo plein écran + overlay dégradé latéral léger */
                <>
                  <div className="hero-ken-burns" style={{ position: "absolute", inset: 0 }}>
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      className="object-cover"
                      style={{ objectPosition: s.imagePosition ?? "center center" }}
                      sizes="100vw"
                      priority={i === 0}
                      unoptimized={s.image.startsWith("http")}
                    />
                  </div>
                  {/* Desktop : overlay latéral gauche→droite (inchangé) */}
                  <div
                    className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#2A1F18]/85 via-[#2A1F18]/60 to-[#2A1F18]/30"
                    aria-hidden
                  />
                  {/* Mobile : overlay vertical bas→haut renforcé (eyebrow/texte lisibles) */}
                  <div
                    className="absolute inset-0 pointer-events-none lg:hidden"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(42, 31, 24, 0.92) 0%, rgba(42, 31, 24, 0.82) 40%, rgba(42, 31, 24, 0.5) 65%, rgba(42, 31, 24, 0.15) 90%, rgba(42, 31, 24, 0) 100%)",
                    }}
                    aria-hidden
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Contenu (overlay animé, calé sur la slide active) ── */}
      <div className="relative z-10 h-full">
        <div
          key={activeIndex}
          className="h-full animate-[fadeSlideUp_0.8s_ease-out_both]"
        >
          {slide.variant === "dg" ? (
            <DGSlideContent slide={slide} />
          ) : (
            <div className="container mx-auto max-w-7xl h-full flex flex-col justify-end lg:justify-center px-4 sm:px-8 lg:px-12 pt-16 lg:pt-20 pb-24 lg:pb-16">
              <ThematicSlideContent slide={slide} />
            </div>
          )}
        </div>
      </div>

      {/* ── Barre de contrôle flottante (pastille glassmorphism) ── */}
      <div
        className="absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 shadow-2xl backdrop-blur-md lg:gap-4 lg:px-5 lg:py-2.5"
        style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {/* Précédent */}
        <button
          onClick={scrollPrev}
          aria-label="Slide précédente"
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Indicateurs (le point actif élargi contient la barre de progression ocre) */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Navigation slides">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Aller à la slide ${i + 1}`}
              className={`overflow-hidden rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                i === activeIndex
                  ? "h-1.5 w-12 bg-white/25"
                  : "h-1.5 w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            >
              {i === activeIndex && (
                <span
                  ref={progressRef}
                  className="block h-full origin-left bg-[#C9A574]"
                  style={{ transform: "scaleX(0)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Compteur */}
        <span className="min-w-[3.5rem] text-center text-xs font-semibold tabular-nums">
          <span className="text-white">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="mx-1 text-white/40">/</span>
          <span className="text-white/60">{String(heroSlides.length).padStart(2, "0")}</span>
        </span>

        {/* Pause / Play */}
        <button
          onClick={toggleAutoplay}
          aria-label={isPlaying ? "Mettre en pause le diaporama" : "Reprendre le diaporama"}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>

        {/* Suivant */}
        <button
          onClick={scrollNext}
          aria-label="Slide suivante"
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── CSS for fade animation ── */}
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
