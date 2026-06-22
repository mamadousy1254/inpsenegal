"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

export function Hero() {
  return (
    <section
      className="hero-texture relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 text-center"
      aria-labelledby="hero-title"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          id="hero-title"
          className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Référence nationale en science des sols
        </motion.h1>
        <motion.p
          className="mt-6 text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Recherche, cartographie et expertise pour une agriculture durable
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Button size="lg" asChild className="min-w-[200px]">
            <Link href="/institut">
              Découvrir l&apos;Institut
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild className="min-w-[200px]">
            <Link href="/services">
              Nos services
              <FileText className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
