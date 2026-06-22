"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Clock,
  Mail,
  Wrench,
  Lock,
  CalendarDays,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const HORAIRES = [
  { day: "Lundi – Vendredi", hours: "08h00 – 17h00" },
  { day: "Samedi", hours: "Fermé" },
  { day: "Dimanche & jours fériés", hours: "Fermé" },
];

const CANAUX = [
  {
    icon: Mail,
    label: "Secrétariat général",
    value: "secretariat@inp.gouv.sn",
    href: "mailto:secretariat@inp.gouv.sn",
  },
  {
    icon: Wrench,
    label: "Service technique",
    value: "technique@inp.gouv.sn",
    href: "mailto:technique@inp.gouv.sn",
  },
  {
    icon: Lock,
    label: "Espace professionnel",
    value: "pro@inp.gouv.sn",
    href: "mailto:pro@inp.gouv.sn",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HorairesCanaux() {
  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "var(--inp-vert)" }}
      aria-labelledby="horaires-title"
    >
      {/* Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="container relative mx-auto max-w-5xl">
        <SectionTitle
          id="horaires-title"
          align="center"
          light
          label="Informations pratiques"
        >
          Horaires &amp; canaux de contact
        </SectionTitle>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Horaires */}
          <motion.div
            className="rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 p-7"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
          >
            <h3 className="flex items-center gap-2 text-base font-semibold text-white mb-5">
              <Clock className="h-4 w-4 text-[var(--inp-beige)]" /> Horaires
              d&apos;ouverture
            </h3>
            <ul className="space-y-3">
              {HORAIRES.map((h, i) => (
                <motion.li
                  key={h.day}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                >
                  <span className="flex items-center gap-2 text-sm text-white/80">
                    <CalendarDays className="h-3.5 w-3.5 text-white/40" />
                    {h.day}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      h.hours === "Fermé" ? "text-red-300/80" : "text-white"
                    }`}
                  >
                    {h.hours}
                  </span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-white/[0.06] px-4 py-2.5 text-xs text-white/60 leading-relaxed">
              Le service d&apos;accueil des échantillons est ouvert du lundi au
              vendredi de 08h00 à 12h00.
            </p>
          </motion.div>

          {/* Canaux */}
          <motion.div
            className="rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 p-7"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <h3 className="flex items-center gap-2 text-base font-semibold text-white mb-5">
              <Mail className="h-4 w-4 text-[var(--inp-beige)]" /> Canaux
              officiels
            </h3>
            <ul className="space-y-4">
              {CANAUX.map((c, i) => (
                <motion.li
                  key={c.label}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/80">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                      {c.label}
                    </p>
                    <a
                      href={c.href}
                      className="text-sm font-medium text-white transition-colors hover:text-[var(--inp-beige)]"
                    >
                      {c.value}
                    </a>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
