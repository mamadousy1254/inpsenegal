"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoilMapScene } from "@/components/3d/SoilMapScene";
import { REDUCED_MOTION_MEDIA } from "@/lib/animations";

export function Hero3D() {
  const [reducedMotion, setReducedMotion] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mmReduced = window.matchMedia(REDUCED_MOTION_MEDIA);
    const mmMobile = window.matchMedia("(max-width: 1023px)");
    setReducedMotion(mmReduced.matches);
    setIsMobile(mmMobile.matches);
    const onReduced = () => setReducedMotion(mmReduced.matches);
    const onMobile = () => setIsMobile(mmMobile.matches);
    mmReduced.addEventListener("change", onReduced);
    mmMobile.addEventListener("change", onMobile);
    return () => {
      mmReduced.removeEventListener("change", onReduced);
      mmMobile.removeEventListener("change", onMobile);
    };
  }, []);

  const use3D = !reducedMotion && !isMobile;

  return (
    <section
      id="hero-3d"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-20 text-center bg-[#f5f5f5]"
      aria-labelledby="hero-title"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background: `linear-gradient(165deg, rgba(31, 61, 43, 0.06) 0%, rgba(216, 195, 165, 0.08) 40%, rgba(245, 245, 245, 1) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%231F3D2B' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(31,61,43,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(31,61,43,0.3) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* Carte 3D */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <SoilMapScene enabled={use3D} className="w-full h-full" />
      </div>

      {/* Contenu */}
      <div className="container relative z-10 mx-auto max-w-4xl">
        <motion.h1
          id="hero-title"
          className="hero-3d-title text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Référence nationale en
          <br />
          science des sols
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Recherche, cartographie et expertise pour une agriculture durable
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button size="lg" asChild className="min-w-[200px] shadow-md hover:shadow-lg transition-shadow">
            <Link href="/institut">
              Découvrir l&apos;Institut
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild className="min-w-[200px] border border-inp-marron/20">
            <Link href="/services">
              Nos services
              <FileText className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </motion.div>
        <motion.a
          href="#mot-du-directeur"
          className="mt-12 inline-flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          aria-label="Aller au Mot du Directeur"
        >
          Découvrir la suite
          <span className="text-xs" aria-hidden>↓</span>
        </motion.a>
      </div>
    </section>
  );
}
