"use client";

import Image from "next/image";
import { Layers, Info, MapPin } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Legend                                                             */
/* ------------------------------------------------------------------ */

const LEGEND = [
  { label: "Délégation Niayes", color: "#8B8B00" },
  { label: "Délégation Sédhiou", color: "#7ECFC0" },
  { label: "Délégation Ziguinchor", color: "#4CB050" },
  { label: "Délégation Sylvo-pastorale", color: "#C0C0C0" },
  { label: "Délégation Bassin arachidier", color: "#C4956A" },
  { label: "Délégation Fleuve", color: "#2060D0" },
  { label: "Délégation Tamba", color: "#E8908A" },
  { label: "Délégation Kédougou", color: "#F0E060" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SoilMap() {
  return (
    <section className="py-20 px-4 sm:py-24" aria-labelledby="carte-title">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="h-5 w-5 text-[var(--inp-vert)]" />
          <h2 id="carte-title" className="text-xl font-semibold text-foreground">
            Carte pédologique nationale
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* ── Map Image ── */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white p-4 shadow-xl">
            <Image
              src="/images/cartographie/carte-pedologique-senegal.png"
              alt="Carte pédologique officielle du Sénégal par délégations — Institut national de Pédologie (Source INP, Projection UTM, Datum WGS 1984 Zone 28N, Réalisation DCCA)"
              width={900}
              height={700}
              className="w-full h-auto rounded-xl object-contain"
              loading="eager"
              quality={90}
            />
            {/* Badge */}
            <div className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-border/40 px-3 py-1.5 shadow-sm">
              <MapPin className="h-3 w-3 text-[var(--inp-vert)]" />
              <span className="text-[11px] font-semibold text-[var(--inp-vert)]">
                Carte pédologique officielle du Sénégal
              </span>
            </div>
          </div>

          {/* ── Sidebar: Legend + info ── */}
          <div className="space-y-5">
            {/* Legend */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]"
                  aria-hidden
                >
                  <Layers className="h-3 w-3" />
                </span>
                Légende
              </h3>
              <ul className="mt-4 space-y-2.5">
                {LEGEND.map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 flex-shrink-0 rounded-sm"
                      style={{ backgroundColor: item.color }}
                      aria-hidden
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]"
                  aria-hidden
                >
                  <Info className="h-3 w-3" />
                </span>
                Données nationales
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  { val: "14", lbl: "Régions" },
                  { val: "12 000+", lbl: "Profils" },
                  { val: "8", lbl: "Délégations" },
                  { val: "100%", lbl: "Couverture" },
                ].map((s) => (
                  <div key={s.lbl} className="text-center">
                    <p className="text-lg font-bold text-[var(--inp-vert)]">
                      {s.val}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Carte officielle INP — Source : INP, Projection UTM, Datum WGS 1984 Zone 28N, Réalisation DCCA.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
