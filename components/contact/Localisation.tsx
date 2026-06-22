"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MapPin, Navigation } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  INP coordinates (Hann, Dakar)                                      */
/* ------------------------------------------------------------------ */

const LAT = 14.7167;
const LNG = -17.4377;
const MAPS_URL = `https://www.google.com/maps?q=${LAT},${LNG}`;
const EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - 0.008}%2C${LAT - 0.005}%2C${LNG + 0.008}%2C${LAT + 0.005}&layer=mapnik&marker=${LAT}%2C${LNG}`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Localisation() {
  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="localisation-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="localisation-title"
          align="center"
          label="Nous trouver"
        >
          Localisation
        </SectionTitle>

        <motion.div
          className="mt-10 overflow-hidden rounded-2xl border border-[var(--inp-vert)]/15 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Map embed */}
          <div className="relative h-[400px] w-full bg-muted sm:h-[450px]">
            <iframe
              title="Localisation de l'INP — Hann, Dakar"
              src={EMBED_URL}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          {/* Address bar */}
          <div className="flex flex-col gap-3 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Institut national de Pédologie
                </p>
                <p className="text-xs text-muted-foreground">
                  BP 10709 Hann Maristes, Dakar, Sénégal
                </p>
              </div>
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--inp-vert)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110"
            >
              <Navigation className="h-3.5 w-3.5" /> Itinéraire
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
