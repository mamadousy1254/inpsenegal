import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleShell,
  type ShellArticleCard,
} from "@/components/actualites/ArticleShell";
import {
  getActualiteBySlug,
  getRelatedActualites,
  getPrevNextActualites,
  type ActualiteDemo,
} from "@/lib/demoActualites";
import { getSiteUrl } from "@/lib/constants/site-url";

/* ------------------------------------------------------------------ */
/*  Article du DG en page FIXE (statique) — gabarit ArticleShell       */
/*  (modèle de référence : fond crème, sidebar À lire aussi /          */
/*  Restez informé / Une question ?, partage, prev/next, suggestions). */
/*  Contenu : lib/demoActualites (même source que le bandeau).         */
/* ------------------------------------------------------------------ */

const SLUG = "interview-dg-sante-des-sols";
// Cover : photo du DG validée (interne, sans filigrane).
const COVER = "/images/direction/Dr-TINE.webp";

const article = getActualiteBySlug(SLUG);

export const metadata: Metadata = article
  ? {
      title: `${article.title} — Actualités INP`,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        type: "article",
        images: [{ url: COVER }],
      },
    }
  : { title: "Article introuvable" };

function demoToCard(a: ActualiteDemo): ShellArticleCard {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    badge: a.type,
    category: a.category,
    dateLabel: a.date,
  };
}

export default function InterviewDgSanteDesSolsPage() {
  if (!article) notFound();

  const { prev, next } = getPrevNextActualites(SLUG);

  return (
    <ArticleShell
      article={{
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        contentHtml: article.content,
        coverImage: COVER,
        badge: article.type,
        category: article.category,
        dateLabel: article.date,
        source: article.source,
        author: article.author,
        sourceUrl: article.sourceUrl,
      }}
      related={getRelatedActualites(SLUG, 4).map(demoToCard)}
      prev={prev ? { slug: prev.slug, title: prev.title } : null}
      next={next ? { slug: next.slug, title: next.title } : null}
      shareUrl={`${getSiteUrl()}/actualites/${SLUG}`}
    />
  );
}
