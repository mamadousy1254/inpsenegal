"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  User,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatDate,
  type NewsItem,
} from "@/components/actualites/actualites-data";

/* ------------------------------------------------------------------ */
/*  HTML content renderer (WYSIWYG output)                             */
/* ------------------------------------------------------------------ */

function renderHtmlContent(html: string) {
  return (
    <div
      className="prose prose-sm max-w-none text-muted-foreground [&_a]:text-[var(--inp-vert)] [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_p]:leading-[1.85] [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5"
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
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://inp.sn/actualites/${article.slug}`;

  return (
    <>
      {/* ── Hero image ── */}
      <section className="relative h-[50vh] min-h-[320px] overflow-hidden sm:h-[55vh]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Fond sombre + dégradé pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-10 sm:pb-14">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/actualites"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
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
              <span className="flex items-center gap-1.5 text-xs text-white/70">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(article.publishedAt)}
              </span>
            </div>

            <motion.h1
              className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {article.title}
            </motion.h1>

            <motion.p
              className="mt-2 flex items-center gap-1.5 text-sm text-white/60"
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
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-base leading-relaxed text-foreground font-medium">
                {article.excerpt}
              </p>

              <hr className="my-6 border-border/50" />

              <div>{renderHtmlContent(article.content)}</div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden />
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--inp-vert)]/[0.07] px-3 py-1 text-xs font-medium text-[var(--inp-vert)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share */}
              <motion.div
                className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-[var(--inp-vert)]" /> Partager
                </h3>
                <div className="flex gap-2">
                  <ShareBtn
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    label="Facebook"
                    className="bg-[#1877F2] hover:bg-[#1877F2]/90"
                  >
                    <Facebook className="h-4 w-4" />
                  </ShareBtn>
                  <ShareBtn
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                    label="Twitter"
                    className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
                  >
                    <Twitter className="h-4 w-4" />
                  </ShareBtn>
                  <ShareBtn
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    label="LinkedIn"
                    className="bg-[#0077B5] hover:bg-[#0077B5]/90"
                  >
                    <Linkedin className="h-4 w-4" />
                  </ShareBtn>
                </div>
              </motion.div>

              {/* Infos */}
              <motion.div
                className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
              >
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  Informations
                </h3>
                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Catégorie</dt>
                    <dd className="font-medium text-foreground">
                      {CATEGORY_LABELS[article.category]}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="font-medium text-foreground">
                      {formatDate(article.publishedAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Auteur</dt>
                    <dd className="font-medium text-foreground">
                      {article.author}
                    </dd>
                  </div>
                </dl>
              </motion.div>

              {/* Related */}
              {related.length > 0 && (
                <motion.div
                  className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                >
                  <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Actualités similaires
                  </h3>
                  <ul className="space-y-4">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/actualites/${r.slug}`}
                          className="group flex gap-3"
                        >
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={r.image}
                              alt={r.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-[var(--inp-vert)] transition-colors">
                              {r.title}
                            </p>
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {formatDate(r.publishedAt)}
                            </p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 self-center text-muted-foreground/40 group-hover:text-[var(--inp-vert)] transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Share button                                                       */
/* ------------------------------------------------------------------ */

function ShareBtn({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Partager sur ${label}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors",
        className
      )}
    >
      {children}
    </a>
  );
}
