"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Landmark,
  GraduationCap,
  FlaskConical,
  MapPin,
  Building2,
  Wheat,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface NationalPartner {
  name: string;
  acronym: string;
  icon: LucideIcon;
}

const PARTNERS: NationalPartner[] = [
  { name: "Ministère de l'Agriculture et de l'Équipement Rural", acronym: "MAER", icon: Landmark },
  { name: "Institut Sénégalais de Recherches Agricoles", acronym: "ISRA", icon: FlaskConical },
  { name: "Université Cheikh Anta Diop de Dakar", acronym: "UCAD", icon: GraduationCap },
  { name: "Université Gaston Berger de Saint-Louis", acronym: "UGB", icon: GraduationCap },
  { name: "Agence Nationale de Conseil Agricole et Rural", acronym: "ANCAR", icon: Wheat },
  { name: "Direction de l'Aménagement du Territoire", acronym: "DAT", icon: MapPin },
  { name: "Centre de Suivi Écologique", acronym: "CSE", icon: Building2 },
  { name: "Société d'Aménagement des Eaux du Delta", acronym: "SAED", icon: Building2 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PartenairesNationaux() {
  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="nat-partners-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="nat-partners-title"
          align="center"
          label="Sénégal"
          subtitle="Institutions publiques, centres de recherche et universités partenaires de l'INP."
        >
          Partenaires institutionnels nationaux
        </SectionTitle>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p.acronym}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {/* Logo placeholder — icon + acronym */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground transition-all duration-300 grayscale group-hover:grayscale-0 group-hover:bg-[var(--inp-vert)]/10 group-hover:text-[var(--inp-vert)]">
                <p.icon className="h-7 w-7" />
              </div>

              <span className="text-lg font-bold text-foreground/80 group-hover:text-[var(--inp-vert)] transition-colors duration-300">
                {p.acronym}
              </span>

              <span className="text-[11px] leading-tight text-muted-foreground line-clamp-2">
                {p.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
