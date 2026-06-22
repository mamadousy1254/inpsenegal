"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Filter, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Filter data                                                        */
/* ------------------------------------------------------------------ */

interface FilterGroup {
  label: string;
  options: string[];
}

const FILTERS: FilterGroup[] = [
  {
    label: "Type de sol",
    options: [
      "Sols ferralitiques",
      "Sols ferrugineux tropicaux",
      "Sols hydromorphes",
      "Sols halomorphes",
      "Sols minéraux bruts",
      "Sols sableux (dior)",
    ],
  },
  {
    label: "Région",
    options: [
      "Dakar",
      "Thiès",
      "Saint-Louis",
      "Matam",
      "Louga",
      "Diourbel",
      "Fatick",
      "Kaolack",
      "Kaffrine",
      "Tambacounda",
      "Kédougou",
      "Kolda",
      "Sédhiou",
      "Ziguinchor",
    ],
  },
  {
    label: "Niveau de fertilité",
    options: ["Élevée", "Moyenne", "Faible", "Très faible"],
  },
  {
    label: "Risque d'érosion",
    options: ["Faible", "Modéré", "Élevé", "Très élevé"],
  },
  {
    label: "Salinisation",
    options: ["Absente", "Faible", "Modérée", "Forte"],
  },
  {
    label: "Usage agricole",
    options: [
      "Cultures pluviales",
      "Cultures irriguées",
      "Maraîchage",
      "Pâturages",
      "Forêts",
      "Non exploité",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Accordion item                                                     */
/* ------------------------------------------------------------------ */

function FilterAccordion({ group }: { group: FilterGroup }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (opt: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  };

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-foreground transition-colors hover:text-[var(--inp-vert)]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {group.label}
          {checked.size > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--inp-vert)] px-1.5 text-[10px] font-bold text-white">
              {checked.size}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <motion.div
          className="pb-3 space-y-1.5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          {group.options.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <input
                type="checkbox"
                checked={checked.has(opt)}
                onChange={() => toggle(opt)}
                className="h-4 w-4 rounded border-border text-[var(--inp-vert)] accent-[var(--inp-vert)]"
              />
              {opt}
            </label>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FiltresCouches() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F4EFE6" }}
      aria-labelledby="filtres-title"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="filtres-title"
          align="center"
          label="Exploration"
          subtitle="Affinez votre recherche par type de sol, région, fertilité et autres critères."
        >
          Filtres &amp; couches de données
        </SectionTitle>

        <div className="mx-auto mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FILTERS.map((group, i) => (
            <motion.div
              key={group.label}
              className="rounded-2xl border border-border/60 bg-white px-5 py-2 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.4,
                delay: i * 0.06,
                ease: "easeOut" as const,
              }}
            >
              <FilterAccordion group={group} />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-8 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Filter className="mr-1.5 inline h-3.5 w-3.5" />
          Les filtres seront connectés à la carte interactive Mapbox dans la version finale.
        </motion.p>
      </div>
    </section>
  );
}
