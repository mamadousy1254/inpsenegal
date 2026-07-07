"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { GalleryImage } from "@/lib/services/cms/serialize-mediatheque";

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[index];

  /* keyboard nav */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Prev */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          aria-label="Image précédente"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          aria-label="Image suivante"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Image */}
        <motion.div
          key={index}
          className="relative max-h-[85vh] max-w-5xl w-full"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={1200}
            height={800}
            unoptimized
            className="mx-auto max-h-[80vh] w-auto rounded-xl object-contain"
          />
          <p className="mt-3 text-center text-sm text-white/70">
            {img.caption}
            <span className="ml-2 text-white/40">
              {index + 1} / {images.length}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function Mediatheque({ gallery }: { gallery: GalleryImage[] }) {
  const images = gallery;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ---- scroll helpers ---- */

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  function scrollBy(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  /* ---- lightbox ---- */

  function openLightbox(i: number) {
    setLightboxIndex(i);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }

  function prev() {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  }

  function next() {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-20 px-4 overflow-x-hidden" aria-labelledby="mediatheque-title">
        <div className="container mx-auto max-w-7xl min-w-0">
          <SectionTitle
            id="mediatheque-title"
            align="center"
            subtitle="L'INP en images — Activités, missions de terrain et événements officiels."
          >
            Médiathèque
          </SectionTitle>

          {/* ---- Carousel container ---- */}
          <div className="relative mt-12 min-w-0 overflow-hidden px-11 sm:px-12">
            {/* Left arrow */}
            <button
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              className={`absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg border border-border/60 text-[var(--inp-vert)] transition-all duration-200 hover:bg-[var(--inp-vert)] hover:text-white hover:shadow-xl ${canScrollLeft
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
                }`}
              aria-label="Défiler vers la gauche"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right arrow */}
            <button
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              className={`absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg border border-border/60 text-[var(--inp-vert)] transition-all duration-200 hover:bg-[var(--inp-vert)] hover:text-white hover:shadow-xl ${canScrollRight
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
                }`}
              aria-label="Défiler vers la droite"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Edge fade indicators */}
            {canScrollLeft && (
              <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-12 bg-gradient-to-r from-white to-transparent" />
            )}
            {canScrollRight && (
              <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-12 bg-gradient-to-l from-white to-transparent" />
            )}

            {/* Scrollable strip */}
            <div
              ref={scrollRef}
              className="flex min-w-0 gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {images.map((img, i) => (
                <motion.div
                  key={`${img.src}-${i}`}
                  className="flex-shrink-0"
                  style={{ width: "clamp(260px, 30vw, 380px)" }}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <button
                    onClick={() => openLightbox(i)}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2"
                    aria-label={`Voir : ${img.alt}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#7B4F2A]/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg">
                          <Camera className="h-5 w-5 text-[var(--inp-vert)]" />
                        </div>
                        <p className="mt-2.5 max-w-[85%] text-center text-[11px] font-medium leading-snug text-white">
                          {img.caption}
                        </p>
                      </div>

                      {/* Bottom gradient caption */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-8">
                        <p className="text-[11px] font-medium text-white/90 line-clamp-1">
                          {img.caption}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Facebook link */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <a
              href="https://web.facebook.com/gestiondessols/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/25 hover:scale-[1.02]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.063 1.376.126V8.06c-.15-.016-.508-.024-.908-.024-1.29 0-1.79.49-1.79 1.76v1.54h3.283l-.563 3.667h-2.72v8.278C19.396 22.46 24 17.755 24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.628 3.874 10.35 9.101 11.691Z" />
              </svg>
              Voir toutes les photos sur Facebook
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}
