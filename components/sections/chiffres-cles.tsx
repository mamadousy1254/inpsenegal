"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Clock,
  Database,
  FlaskConical,
  MapPin,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Counter {
  value: number;
  suffix: string;
  label: string;
  detail: string;
  icon: LucideIcon;
}

const COUNTERS: Counter[] = [
  { value: 40, suffix: "+", label: "Ans d'expertise", detail: "Depuis 1984, au service des sols du Sénégal", icon: Clock },
  { value: 12000, suffix: "+", label: "Profils pédologiques", detail: "Base nationale de référence géoréférencée", icon: Database },
  { value: 5, suffix: "", label: "Laboratoires spécialisés", detail: "Analyse physico-chimique, fertilité, SIG", icon: FlaskConical },
  { value: 14, suffix: "", label: "Régions couvertes", detail: "Couverture pédologique complète du territoire", icon: MapPin },
  { value: 65, suffix: "+", label: "Chercheurs & techniciens", detail: "Expertise pluridisciplinaire de haut niveau", icon: Users },
  { value: 150, suffix: "+", label: "Publications scientifiques", detail: "Rapports, articles et fiches techniques", icon: FileText },
];

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCounter({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const duration = 1.5;
  const steps = 40;
  const stepValue = value / steps;
  const stepDuration = (duration * 1000) / steps;

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [inView, value, stepValue, stepDuration]);

  return (
    <>
      {count.toLocaleString("fr-FR")}
      {suffix}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function ChiffresCles() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #7B4F2A 0%, #4A2F1A 50%, #2A1F18 100%)" }}
      aria-labelledby="chiffres-title"
    >
      {/* Subtle texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="container mx-auto max-w-6xl relative">
        <SectionTitle id="chiffres-title" align="center" light>
          L&apos;INP en chiffres
        </SectionTitle>
        <p className="mt-3 text-center text-[14px] text-white/50 max-w-xl mx-auto">
          Des décennies d&apos;engagement scientifique au service de la connaissance
          et de la gestion durable des sols du Sénégal.
        </p>

        {/* Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTERS.map((item, i) => (
            <motion.div
              key={item.label}
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              {/* Icon */}
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A6F47]/40 ring-1 ring-[#5A6F47]/60 transition-colors duration-300 group-hover:bg-[#5A6F47]/60">
                <item.icon className="h-5 w-5 text-white" aria-hidden />
              </div>

              {/* Number */}
              <p className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                <AnimatedCounter
                  value={item.value}
                  suffix={item.suffix}
                  inView={inView}
                />
              </p>

              {/* Label */}
              <p className="mt-1 text-[13px] font-semibold text-white/80">
                {item.label}
              </p>

              {/* Detail */}
              <p className="mt-1.5 text-[11px] text-white/40 leading-relaxed">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
