"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Landmark,
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Tractor,
  Users,
  Factory,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Audience {
  title: string;
  icon: LucideIcon;
}

const COL_LEFT: { heading: string; items: Audience[] } = {
  heading: "Secteur public & institutionnel",
  items: [
    { title: "Ministères & directions nationales", icon: Landmark },
    { title: "Collectivités territoriales", icon: MapPin },
    { title: "Organismes de développement", icon: Building2 },
    { title: "ONG & programmes internationaux", icon: Globe },
    { title: "Projets d'investissement agricole", icon: Briefcase },
  ],
};

const COL_RIGHT: { heading: string; items: Audience[] } = {
  heading: "Secteur privé & producteurs",
  items: [
    { title: "Exploitations agricoles", icon: Tractor },
    { title: "Organisations paysannes & coopératives", icon: Users },
    { title: "Entreprises agro-industrielles", icon: Factory },
  ],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PublicCible() {
  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="public-title">
      <div className="container mx-auto max-w-5xl">
        <SectionTitle
          id="public-title"
          align="center"
          label="À qui s'adresse l'INP"
          subtitle="Nos services sont accessibles à l'ensemble des acteurs du développement agricole et territorial."
        >
          Public cible
        </SectionTitle>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {/* Column left */}
          <Column data={COL_LEFT} baseDelay={0} />
          {/* Column right */}
          <Column data={COL_RIGHT} baseDelay={0.15} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Column sub-component                                               */
/* ------------------------------------------------------------------ */

function Column({
  data,
  baseDelay,
}: {
  data: { heading: string; items: Audience[] };
  baseDelay: number;
}) {
  return (
    <motion.div
      className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-7 shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: baseDelay }}
    >
      <h3 className="mb-5 text-base font-semibold text-foreground">
        {data.heading}
      </h3>
      <ul className="space-y-4">
        {data.items.map((item, i) => (
          <motion.li
            key={item.title}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, delay: baseDelay + 0.08 + i * 0.06 }}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
              <item.icon className="h-4 w-4" />
            </div>
            <span className="text-sm text-foreground">{item.title}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
