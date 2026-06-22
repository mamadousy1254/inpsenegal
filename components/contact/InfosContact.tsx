"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, Mailbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface InfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

const INFOS: InfoItem[] = [
  {
    icon: MapPin,
    label: "Adresse",
    value: "Hann Maristes, Dakar, Sénégal",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+221 33 832 65 65",
    href: "tel:+221338326565",
  },
  {
    icon: Mail,
    label: "Email",
    value: "inppedologie@gmail.com",
    href: "mailto:inppedologie@gmail.com",
  },
  {
    icon: Mailbox,
    label: "Boîte postale",
    value: "BP 10709 Hann Maristes, Dakar, Sénégal",
  },
  {
    icon: Globe,
    label: "Site web",
    value: "www.inp.gouv.sn",
    href: "https://www.inp.gouv.sn",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function InfosContact() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Coordonnées officielles
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        L&apos;Institut national de Pédologie est un établissement public à
        caractère scientifique et technologique sous tutelle du Ministère de
        l&apos;Agriculture et de l&apos;Équipement Rural.
      </p>

      <div className="space-y-3 pt-2">
        {INFOS.map((info, i) => (
          <motion.div
            key={info.label}
            className="flex items-start gap-4 rounded-xl border border-[var(--inp-vert)]/15 bg-white p-4 shadow-sm"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]">
              <info.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {info.label}
              </p>
              {info.href ? (
                <a
                  href={info.href}
                  className="text-sm font-medium text-foreground transition-colors hover:text-[var(--inp-vert)]"
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {info.value}
                </a>
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {info.value}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
