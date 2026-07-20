"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Map, ZoomIn } from "lucide-react";

import { SectionTitle } from "@/components/ui/SectionTitle";
import type { PublicCartothequeMap } from "@/lib/services/cms/serialize-cartotheque";

type CartothequeHomeProps = {
  maps: PublicCartothequeMap[];
};

export function CartothequeHome({ maps }: CartothequeHomeProps) {
  if (maps.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden py-20 px-4"
      aria-labelledby="cartotheque-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(46,125,50,0.12),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-[#EADFC9]/40 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[var(--inp-vert)]/5 blur-3xl" aria-hidden />

      <div className="container relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--inp-vert)]/20 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--inp-vert)] shadow-sm backdrop-blur-sm">
            <Layers className="size-3.5" aria-hidden />
            Ressources cartographiques
          </span>
          <SectionTitle id="cartotheque-title" align="center" className="mb-4">
            Cartothèque
          </SectionTitle>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Consultez les dernières cartes produites par l&apos;INP : légendes
            détaillées et accès à l&apos;ensemble du fonds cartographique.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {maps.map((map, i) => (
            <motion.article
              key={map.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-md shadow-black/[0.04] transition-shadow duration-300 hover:shadow-xl hover:shadow-[var(--inp-vert)]/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F7F1E6] to-white">
                <Image
                  src={map.imageUrl}
                  alt={map.alt}
                  fill
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#5E3D20]/0 opacity-0 transition-all duration-300 group-hover:bg-[#5E3D20]/15 group-hover:opacity-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg">
                    <ZoomIn className="size-4 text-[var(--inp-vert)]" aria-hidden />
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col border-t border-border/40 bg-gradient-to-b from-white to-[#FAF7F2] p-4">
                <h3 className="text-sm font-semibold text-[#5E3D20] line-clamp-1">{map.alt}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-4">
                  {map.legende}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/cartotheque"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] px-6 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-900/25"
          >
            <Map className="size-3.5" aria-hidden />
            Voir toute la cartothèque
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
