"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function MissionGenerale() {
  return (
    <section
      className="py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "#F8F1E0" }}
      aria-labelledby="mission-generale-title"
    >
      <div className="container mx-auto max-w-4xl text-center">
        <SectionTitle
          id="mission-generale-title"
          align="center"
          label="Raison d'être"
        >
          Notre Mission
        </SectionTitle>

        <motion.div
          className="mt-8 space-y-5 text-lg leading-[1.9] text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p>
            L&apos;Institut national de Pédologie a pour mission de{" "}
            <strong className="text-foreground">produire, analyser et diffuser</strong>{" "}
            les connaissances scientifiques relatives aux sols, afin de soutenir les{" "}
            <strong className="text-foreground">politiques agricoles</strong> et la{" "}
            <strong className="text-foreground">gestion durable des terres</strong>.
          </p>
          <p>
            Institut parapublic à caractère scientifique et technologique, l&apos;INP
            constitue le principal instrument de l&apos;État en matière de{" "}
            <strong className="text-foreground">recherche pédologique</strong>,
            de cartographie des sols et d&apos;expertise technique au service de la{" "}
            <strong className="text-foreground">souveraineté alimentaire</strong> nationale.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
