"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  HardDrive,
  FileText,
  Download,
  Tag,
  MapPin,
  Copy,
  Check,
  BookOpen,
  Hash,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DOC_TYPE_LABELS,
  DOC_TYPE_COLORS,
  type DocItem,
} from "@/components/documentation/doc-data";

/* ------------------------------------------------------------------ */
/*  Citation helper                                                    */
/* ------------------------------------------------------------------ */

function formatCitation(d: DocItem): string {
  return `INP (${d.year}). ${d.title}. ${d.author}. Dakar : Institut national de Pédologie. Version ${d.version}.`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DocDetailClient({ doc }: { doc: DocItem }) {
  const [copied, setCopied] = useState(false);
  const citation = formatCitation(doc);

  async function handleCopy() {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <>
      {/* ── Hero bar ── */}
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
            href="/documentation"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à la documentation
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                DOC_TYPE_COLORS[doc.type]
              )}
            >
              <FileText className="h-3 w-3" />
              {DOC_TYPE_LABELS[doc.type]}
            </span>
            <span className="flex items-center gap-1 text-sm text-white/70">
              <Calendar className="h-3.5 w-3.5" /> {doc.year}
            </span>
          </div>

          <motion.h1
            className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {doc.title}
          </motion.h1>

          <motion.p
            className="mt-3 flex items-center gap-2 text-sm text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <User className="h-4 w-4 flex-shrink-0" />
            {doc.author}
          </motion.p>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-16 px-4 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {/* Main column */}
            <div className="space-y-8">
              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <h2 className="text-lg font-semibold text-foreground">Description</h2>
                <p className="mt-3 text-sm leading-[1.85] text-muted-foreground">
                  {doc.description}
                </p>
              </motion.div>

              {/* Tags */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Tag className="h-4 w-4 text-[var(--inp-vert)]" /> Mots-clés
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {doc.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[var(--inp-vert)]/[0.07] px-3 py-1 text-xs font-medium text-[var(--inp-vert)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Citation */}
              <motion.div
                className="rounded-2xl border border-[var(--inp-vert)]/15 bg-[#F8F1E0] p-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Citation institutionnelle
                </h3>
                <div className="rounded-xl bg-white p-4 text-sm leading-relaxed text-foreground/90 font-mono border border-border/50">
                  {citation}
                </div>
                <button
                  onClick={handleCopy}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--inp-vert)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110"
                >
                  {copied ? (
                    <><Check className="h-3.5 w-3.5" /> Copié !</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copier la citation</>
                  )}
                </button>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download */}
              <motion.div
                className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">Télécharger</h3>
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--inp-vert)] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
                  aria-label="Télécharger le document"
                >
                  <Download className="h-4 w-4" /> Télécharger le document
                </button>
                <p className="mt-3 text-center text-[10px] text-muted-foreground">
                  Format PDF • {doc.fileSize} • Téléchargement gratuit
                </p>
                <p className="mt-1 text-center text-[10px] text-muted-foreground/60">
                  {doc.downloads.toLocaleString("fr-FR")} téléchargements
                </p>
              </motion.div>

              {/* Metadata */}
              <motion.div
                className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4">Métadonnées</h3>
                <dl className="space-y-3 text-xs">
                  <Row icon={FileText} label="Type" value={DOC_TYPE_LABELS[doc.type]} />
                  <Row icon={Calendar} label="Année" value={String(doc.year)} />
                  <Row icon={User} label="Auteur" value={doc.author} />
                  <Row icon={MapPin} label="Région" value={doc.region} />
                  <Row icon={Layers} label="Axe" value={doc.researchAxis} />
                  <Row icon={BookOpen} label="Pages" value={String(doc.pages)} />
                  <Row icon={Hash} label="Version" value={doc.version} />
                  <Row icon={HardDrive} label="Taille" value={doc.fileSize} />
                </dl>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Row helper                                                         */
/* ------------------------------------------------------------------ */

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <dt className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3 flex-shrink-0" /> {label}
      </dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
