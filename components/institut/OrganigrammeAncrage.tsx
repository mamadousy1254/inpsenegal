"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import OrganigrammeInteractif from "@/components/OrganigrammeInteractif";

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4, ease: easeOut },
};

/** Lien cliquable vers une page délégation (liste sous la carte — image inchangée) */
export type OrganigrammeDelegationLink = {
  slug: string;
  label: string;
  color: string;
};

const FALLBACK_DELEGATIONS: OrganigrammeDelegationLink[] = [
  { slug: "niayes", label: "Délégation Niayes", color: "#7A8B2E" },
  { slug: "sylvo-pastorale", label: "Délégation Sylvo Pastorale", color: "#E5E5E5" },
  { slug: "fleuve", label: "Délégation Fleuve", color: "#1E5FD8" },
  { slug: "bassin-arachidier", label: "Délégation Bassin Arachidier", color: "#D49A5A" },
  { slug: "tamba", label: "Délégation Tamba", color: "#E76F6F" },
  { slug: "kedougou", label: "Délégation Kédougou", color: "#F4EA6A" },
  { slug: "sedhiou", label: "Délégation Sédhiou", color: "#63D1C1" },
  { slug: "ziguinchor", label: "Délégation Ziguinchor", color: "#39FF14" },
];

type OrganigrammeAncrageProps = {
  delegations?: OrganigrammeDelegationLink[];
};

export function OrganigrammeAncrage({ delegations }: OrganigrammeAncrageProps) {
  const items = delegations?.length ? delegations : FALLBACK_DELEGATIONS;
  return (
    <section className="bg-[#F6F5F2] py-24" aria-labelledby="organigramme-title">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h1
          id="organigramme-title"
          className="text-center text-3xl font-bold tracking-wide text-amber-900 sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Organigramme et ancrage territorial
        </motion.h1>
        <motion.span
          className="mx-auto mt-4 block h-1 w-24 rounded-full bg-amber-800"
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        <motion.div
          className="mt-16"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
        >
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-gray-400">
            Structure hiérarchique de l&apos;INP
          </p>
          {/* Organigramme interactif (postes cliquables + accordéon des missions) */}
          <OrganigrammeInteractif />
        </motion.div>

        <div className="my-20 border-t border-gray-200" aria-hidden />

        {/* Section ancrage territorial */}
        <motion.h2
          className="mb-8 text-2xl font-semibold text-amber-900 sm:text-3xl"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          Ancrage territorial
        </motion.h2>
        <motion.p
          className="mb-12 text-lg leading-relaxed text-gray-600"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
        >
          L&apos;INP assure un ancrage territorial à travers ses délégations
          pédoclimatiques couvrant l&apos;ensemble du territoire national.
        </motion.p>

        {/* 5. Carte complète : Direction Technique, Délégations pédoclimatiques et carte du Sénégal */}
        <motion.div
          className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg sm:p-10"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
        >
          <div className="overflow-hidden rounded-xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg">
            <Image
              src="/images/institut/carte-senegal.png"
              alt="Direction Technique et Délégations pédoclimatiques — Carte des délégations de l'INP au Sénégal (Niayes, Sylvo Pastorale, Fleuve, Bassin Arachidier, Tamba, Kédougou, Sédhiou, Ziguinchor)"
              width={1200}
              height={800}
              className="w-full object-contain"
              unoptimized
            />
          </div>

          {/* 6. Liste structurée des délégations (couleurs officielles légende) */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {items.map((item, i) => (
              <motion.div
                key={item.slug}
                className="group relative overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-[#C9A574]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.4,
                  delay: 0.08 + i * 0.03,
                  ease: easeOut,
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full w-2 shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <Link
                  href={`/institut/delegations/${item.slug}`}
                  className="flex items-center gap-2 py-6 pl-6 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4F2A]"
                  aria-label={`Voir la ${item.label}`}
                >
                  <span className="flex-1 text-sm font-medium text-gray-900 transition-colors group-hover:text-amber-900">
                    {item.label}
                  </span>
                  <span
                    className="text-[#C9A574] transition-transform group-hover:translate-x-1"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
