"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatDate,
  type NewsItem,
} from "@/components/actualites/actualites-data";
import { ArticleSidebar } from "@/components/actualites/ArticleSidebar";

/* ------------------------------------------------------------------ */
/*  HTML content renderer (WYSIWYG output)                             */
/* ------------------------------------------------------------------ */

function renderHtmlContent(html: string) {
  return (
    <div
      // Typographie « prose » appliquée au HTML issu du CMS (aucune classe côté
      // back-office) : largeur de lecture ~70ch, interligne 1.75, hiérarchie
      // H2/H3 marquée, listes indentées, liens ocre soulignés au survol.
      className={cn(
        "max-w-[70ch] text-[1.0625rem] leading-[1.75] text-[#4A3F36]",
        "[&_p]:my-4",
        "[&_a]:font-medium [&_a]:text-[#7B4F2A] [&_a]:underline [&_a]:decoration-[#7B4F2A]/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-[#7B4F2A]",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-[#2A1F18] sm:[&_h2]:text-[1.35rem]",
        "[&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#2A1F18]",
        "[&_strong]:font-semibold [&_strong]:text-[#2A1F18]",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-1.5 [&_li]:pl-1",
        "[&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#7B4F2A] [&_blockquote]:bg-[#7B4F2A]/[0.05] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-[#5E3D20]",
        "[&_cite]:mt-2 [&_cite]:block [&_cite]:text-sm [&_cite]:not-italic [&_cite]:text-[#8A7A6B]",
        "[&_img]:rounded-xl"
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface Props {
  article: NewsItem;
  related: NewsItem[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ArticleDetailClient({ article, related }: Props) {
  // URL de partage : on rend d'abord l'URL canonique (identique côté serveur et
  // au premier rendu client) pour éviter un mismatch d'hydratation, puis on
  // bascule sur l'URL réelle de la page une fois monté côté client.
  const [shareUrl, setShareUrl] = useState(
    `https://inp.sn/actualites/${article.slug}`
  );
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  return (
    <>
      {/* ── Hero image ── */}
      <section className="relative h-[42vh] min-h-[300px] overflow-hidden sm:h-[55vh]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Overlay sombre renforcé : atténue fortement tout texte/motif présent
            dans l'image source (CMS) et garantit le contraste du titre blanc,
            du fil d'Ariane, du badge et de la date. */}
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/45"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:pb-12">
          <div className="container mx-auto max-w-6xl">
            <Link
              href="/actualites"
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Retour aux actualités
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm",
                  CATEGORY_COLORS[article.category]
                )}
              >
                {CATEGORY_LABELS[article.category]}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/80">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(article.publishedAt)}
              </span>
            </div>

            <motion.h1
              className="max-w-3xl text-[1.6rem] font-bold leading-[1.2] text-white drop-shadow-sm sm:text-3xl lg:text-4xl lg:leading-[1.15]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {article.title}
            </motion.h1>

            <motion.p
              className="mt-3 flex items-center gap-1.5 text-sm text-white/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <User className="h-3.5 w-3.5" /> {article.author}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-14 px-4 sm:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-14">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Chapô */}
              <p className="max-w-[70ch] text-lg font-medium leading-[1.65] text-[#43392F]">
                {article.excerpt}
              </p>

              <hr className="my-7 max-w-[70ch] border-[#7B4F2A]/10" />

              <div>{renderHtmlContent(article.content)}</div>

              {/* Tags */}
              <div className="mt-10 flex max-w-[70ch] flex-wrap items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-[#8A7A6B]" aria-hidden />
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#EADFC9] bg-[#F8F1E0] px-3 py-1 text-xs font-medium text-[#7B4F2A]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Sidebar — composant partagé, charte INP (sticky au défilement) */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <ArticleSidebar
                shareUrl={shareUrl}
                shareTitle={article.title}
                info={[
                  {
                    label: "Catégorie",
                    value: CATEGORY_LABELS[article.category],
                  },
                  { label: "Date", value: formatDate(article.publishedAt) },
                  { label: "Auteur", value: article.author },
                ]}
                related={related}
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
