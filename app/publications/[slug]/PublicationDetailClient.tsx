"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Users,
  Tag,
  FileText,
  ExternalLink,
  FlaskConical,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CitationBlock } from "@/components/publications/CitationBlock";
import { PublicationDownloadLink } from "@/components/publications/PublicationDownloadLink";
import type { PublicationItem } from "@/components/publications/publication-data";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  publication: PublicationItem;
  typeLabel: string;
  typeColor: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PublicationDetailClient({
  publication: pub,
  typeLabel,
  typeColor,
}: Props) {
  return (
    <>
      {/* ── Green hero bar ── */}
      <section className="relative overflow-hidden bg-[var(--inp-vert)] pb-14 pt-20 sm:pb-16 sm:pt-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
        <div className="container mx-auto max-w-4xl px-4">
          <Link
            href="/publications"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux publications
          </Link>

          {/* Type badge + Year */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                typeColor
              )}
            >
              <FileText className="h-3 w-3" />
              {typeLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-white/70">
              <Calendar className="h-3.5 w-3.5" /> {pub.year}
            </span>
          </div>

          <motion.h1
            className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {pub.title}
          </motion.h1>

          <motion.p
            className="mt-3 flex items-center gap-2 text-sm text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Users className="h-4 w-4 flex-shrink-0" />
            {pub.authors.join(", ")}
          </motion.p>

          {pub.doi && (
            <motion.p
              className="mt-2 text-xs font-mono text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              DOI :{" "}
              <a
                href={`https://doi.org/${pub.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/80"
              >
                {pub.doi} <ExternalLink className="ml-0.5 inline h-3 w-3" />
              </a>
            </motion.p>
          )}
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-16 px-4 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {/* Main column */}
            <div className="space-y-10">
              {/* Abstract */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <h2 className="text-lg font-semibold text-foreground">
                  Résumé scientifique
                </h2>
                <p className="mt-3 text-sm leading-[1.85] text-muted-foreground">
                  {pub.abstract}
                </p>
              </motion.div>

              {/* Methodology */}
              {pub.methodology && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                >
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <FlaskConical className="h-4 w-4 text-[var(--inp-vert)]" />
                    Méthodologie
                  </h2>
                  <p className="mt-3 text-sm leading-[1.85] text-muted-foreground">
                    {pub.methodology}
                  </p>
                </motion.div>
              )}

              {/* Results */}
              {pub.results && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                >
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <BarChart3 className="h-4 w-4 text-[var(--inp-vert)]" />
                    Résultats clés
                  </h2>
                  <p className="mt-3 text-sm leading-[1.85] text-muted-foreground">
                    {pub.results}
                  </p>
                </motion.div>
              )}

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Tag className="h-4 w-4 text-[var(--inp-vert)]" />
                  Mots-clés
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pub.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[var(--inp-vert)]/[0.07] px-3 py-1 text-xs font-medium text-[var(--inp-vert)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download card */}
              <motion.div
                className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Télécharger
                </h3>
                <PublicationDownloadLink publication={pub} fullWidth />
                <p className="mt-3 text-center text-[10px] text-muted-foreground">
                  Format PDF • Téléchargement gratuit
                </p>
              </motion.div>

              {/* Metadata card */}
              <motion.div
                className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Informations
                </h3>
                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="font-medium text-foreground">{typeLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Année</dt>
                    <dd className="font-medium text-foreground">{pub.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Axe</dt>
                    <dd className="font-medium text-foreground">
                      {pub.researchAxis}
                    </dd>
                  </div>
                  {pub.doi && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">DOI</dt>
                      <dd className="font-mono text-foreground">{pub.doi}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground mb-1">Auteurs</dt>
                    <dd className="font-medium text-foreground">
                      {pub.authors.join(", ")}
                    </dd>
                  </div>
                </dl>
              </motion.div>

              {/* Citation */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
              >
                <CitationBlock publication={pub} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
