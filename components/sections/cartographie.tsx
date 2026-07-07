"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MapPin, Layers, ArrowRight, Globe, Database } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Quick stats                                                        */
/* ------------------------------------------------------------------ */

const STATS = [
  { icon: Layers, value: "14", label: "Régions cartographiées" },
  { icon: Database, value: "12 000+", label: "Profils pédologiques" },
  { icon: Globe, value: "8", label: "Types de sols majeurs" },
];

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function Cartographie() {
  return (
    <section
      className="py-20 px-4 bg-muted/40"
      aria-labelledby="cartographie-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle id="cartographie-title" align="center" className="mb-12">
          Cartographie des sols
        </SectionTitle>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="flex flex-col lg:flex-row lg:items-start lg:gap-12"
        >
          {/* Left — text + stats */}
          <div className="lg:w-1/2">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Accédez à la carte pédologique du Sénégal et aux données
              d&apos;inventaire des sols. Une couverture nationale au service
              de l&apos;aménagement du territoire et de l&apos;agriculture
              durable.
            </p>

            {/* Mini stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="rounded-xl border border-border/60 bg-white p-3 text-center shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                >
                  <s.icon className="h-4 w-4 mx-auto text-[var(--inp-vert)]" aria-hidden />
                  <p className="mt-1.5 text-lg font-bold text-[var(--inp-vert)]">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                </motion.div>
              ))}
            </div>

            <Link
              href="/cartographie"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8B5E3C] px-5 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/25 hover:scale-[1.02]"
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              Explorer la cartographie
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Right — embedded map */}
          <motion.div
            className="mt-8 lg:mt-0 lg:w-1/2 flex flex-col gap-3"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative rounded-2xl border border-border/60 bg-white p-4 shadow-xl overflow-hidden">
              <Image
                src="/images/cartographie/carte-pedologique-senegal.png"
                alt="Carte pédologique officielle du Sénégal — Institut national de Pédologie"
                width={800}
                height={600}
                className="w-full h-auto rounded-xl object-contain"
                loading="lazy"
                quality={75}
              />
              {/* Badge label */}
              <div className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-border/40 px-3 py-1.5 shadow-sm">
                <MapPin className="h-3 w-3 text-[var(--inp-vert)]" />
                <span className="text-[11px] font-semibold text-[var(--inp-vert)]">
                  Carte pédologique officielle du Sénégal
                </span>
              </div>
            </div>

            {/* Legend bar */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-white px-4 py-2.5 shadow-sm">
              {[
                { color: "#8B5E3C", label: "Sols ferrugineux" },
                { color: "#C9A574", label: "Sols sableux" },
                { color: "#7B4F2A", label: "Sols hydromorphes" },
                { color: "#B8860B", label: "Sols ferralitiques" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  {l.label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
