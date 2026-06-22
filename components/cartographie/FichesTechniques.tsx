"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FileText, Download } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface SoilSheet {
  name: string;
  description: string;
  region: string;
  color: string;
}

const SHEETS: SoilSheet[] = [
  {
    name: "Sols ferralitiques",
    description:
      "Sols profonds, acides et fortement altérés. Bonne capacité de rétention hydrique, adaptés aux cultures tropicales.",
    region: "Casamance, Kédougou",
    color: "#5E8F48",
  },
  {
    name: "Sols ferrugineux tropicaux",
    description:
      "Sols à sesquioxydes de fer, texture sableuse à sablo-argileuse. Dominants dans le bassin arachidier.",
    region: "Kaolack, Kaffrine, Tambacounda",
    color: "#B8935A",
  },
  {
    name: "Sols hydromorphes",
    description:
      "Sols de bas-fonds et zones inondables. Engorgement saisonnier, potentiel rizicole et maraîcher.",
    region: "Vallée du Fleuve, Fatick",
    color: "#8AAD8A",
  },
  {
    name: "Sols halomorphes",
    description:
      "Sols salés ou alcalins (tannes). Contraintes de salinité nécessitant des aménagements spécifiques.",
    region: "Fatick, Kaolack, Sine-Saloum",
    color: "#7B9971",
  },
  {
    name: "Sols sableux (dior)",
    description:
      "Sols sableux dunaires, faible capacité de rétention, sensibles à l'érosion éolienne. Culture d'arachide et mil.",
    region: "Louga, Thiès, Diourbel",
    color: "#D4B896",
  },
  {
    name: "Sols minéraux bruts",
    description:
      "Sols peu évolués sur cuirasse ou roche. Faible potentiel agricole sans aménagement.",
    region: "Thiès (plateau), zones latéritiques",
    color: "#C9B080",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FichesTechniques() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      aria-labelledby="fiches-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="fiches-title"
          align="center"
          label="Référentiels"
          subtitle="Fiches descriptives des grands types de sols identifiés sur le territoire national."
        >
          Fiches techniques des sols
        </SectionTitle>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SHEETS.map((sheet, i) => (
            <motion.article
              key={sheet.name}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.07,
                ease: "easeOut" as const,
              }}
            >
              {/* Color stripe */}
              <div
                className="h-1.5"
                style={{ backgroundColor: sheet.color }}
                aria-hidden
              />

              <div className="p-6">
                {/* Soil color dot + name */}
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 flex-shrink-0 rounded-full ring-2 ring-white shadow-sm"
                    style={{ backgroundColor: sheet.color }}
                    aria-hidden
                  />
                  <h3 className="text-lg font-semibold text-foreground">
                    {sheet.name}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {sheet.description}
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Régions :</span>{" "}
                  {sheet.region}
                </p>

                {/* Download */}
                <button
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-[var(--inp-vert)]/20 px-3.5 py-2 text-xs font-medium text-[var(--inp-vert)] transition-all hover:bg-[var(--inp-vert)] hover:text-white"
                  aria-label={`Télécharger la fiche technique : ${sheet.name}`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Télécharger PDF
                  <Download className="h-3 w-3" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
