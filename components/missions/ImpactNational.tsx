"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";

/* ------------------------------------------------------------------ */
/*  Counter data                                                       */
/* ------------------------------------------------------------------ */

interface CounterItem {
  target: number;
  suffix: string;
  label: string;
}

const COUNTERS: CounterItem[] = [
  { target: 14, suffix: "", label: "Régions du Sénégal couvertes" },
  { target: 12000, suffix: "+", label: "Profils pédologiques réalisés" },
  { target: 350, suffix: "+", label: "Projets accompagnés" },
  { target: 60, suffix: "+", label: "Années d'expertise" },
];

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useCounter(target: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let current = 0;
    const steps = 45;
    const step = target / steps;
    const ms = 1400 / steps;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, ms);
    return () => clearInterval(timer);
  }, [active, target]);

  return count;
}

function Counter({ item, active }: { item: CounterItem; active: boolean }) {
  const count = useCounter(item.target, active);
  return (
    <div className="text-center">
      <p className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl tabular-nums">
        {count.toLocaleString("fr-FR")}
        <span className="text-white/70">{item.suffix}</span>
      </p>
      <p className="mt-2 text-sm font-medium text-white/65 sm:text-base">
        {item.label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ImpactNational() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 px-4 sm:py-24 lg:py-32"
      style={{ backgroundColor: "var(--inp-vert)" }}
      aria-labelledby="impact-title"
    >
      {/* Geometric texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="container relative mx-auto max-w-6xl">
        <SectionTitle
          id="impact-title"
          align="center"
          light
          subtitle="L'INP contribue directement à la sécurité alimentaire et au développement durable du Sénégal."
        >
          Un acteur stratégique du développement agricole
        </SectionTitle>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTERS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: "easeOut" as const,
              }}
            >
              <Counter item={item} active={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
