import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArticleShell,
  type ShellArticle,
  type ShellArticleCard,
} from "@/components/actualites/ArticleShell";
import {
  getPublishedActualiteBySlug,
  getPublishedActualitesAsNews,
} from "@/lib/services/cms/get-published-content";
import { toNewsItem } from "@/lib/services/cms/serialize-actualite";
import {
  CATEGORY_LABELS,
  formatDate,
  type NewsItem,
} from "@/components/actualites/actualites-data";
import {
  getActualiteBySlug,
  getRelatedActualites,
  getPrevNextActualites,
  type ActualiteDemo,
} from "@/lib/demoActualites";
import { getSiteUrl } from "@/lib/constants/site-url";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* ------------------------------------------------------------------ */
/*  Sources : articles CMS (back-office) en priorité, puis repli sur   */
/*  les actualités statiques `demoActualites` (celles du bandeau       */
/*  COMMUNIQUÉ) — toutes rendues avec le même gabarit ArticleShell.    */
/* ------------------------------------------------------------------ */

function newsToShell(n: NewsItem): ShellArticle {
  return {
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt,
    contentHtml: n.content,
    coverImage: n.image,
    category: CATEGORY_LABELS[n.category] ?? n.category,
    dateLabel: formatDate(n.publishedAt),
    author: n.author,
  };
}

function demoToShell(a: ActualiteDemo): ShellArticle {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    contentHtml: a.content,
    coverImage: a.coverImage,
    badge: a.type,
    category: a.category,
    dateLabel: a.date,
    source: a.source,
    author: a.author,
    sourceUrl: a.sourceUrl,
  };
}

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getPublishedActualiteBySlug(slug).catch(() => null);
  if (cms) {
    const n = toNewsItem(cms);
    return {
      title: `${n.title} — Actualités INP`,
      description: n.excerpt,
      openGraph: {
        title: n.title,
        description: n.excerpt,
        images: n.image ? [{ url: n.image }] : undefined,
      },
    };
  }
  const demo = getActualiteBySlug(slug);
  if (demo) {
    return {
      title: `${demo.title} — Actualités INP`,
      description: demo.excerpt,
      openGraph: {
        title: demo.title,
        description: demo.excerpt,
        images: demo.coverImage ? [{ url: demo.coverImage }] : undefined,
      },
    };
  }
  return { title: "Article introuvable" };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const shareUrl = `${getSiteUrl()}/actualites/${slug}`;

  /* ── 1. Article du back-office (CMS) ── */
  const articleDoc = await getPublishedActualiteBySlug(slug).catch(() => null);
  if (articleDoc) {
    const article = newsToShell(toNewsItem(articleDoc));
    let allNews: NewsItem[] = [];
    try {
      allNews = await getPublishedActualitesAsNews();
    } catch {
      allNews = [];
    }
    const others = allNews.filter((n) => n.slug !== slug);
    const idx = allNews.findIndex((n) => n.slug === slug);
    // Liste triée du plus récent au plus ancien :
    // « suivant » = plus récent, « précédent » = plus ancien.
    const next = idx > 0 ? allNews[idx - 1] : null;
    const prev =
      idx >= 0 && idx < allNews.length - 1 ? allNews[idx + 1] : null;

    return (
      <ArticleShell
        article={article}
        related={others.slice(0, 4).map((n) => ({
          slug: n.slug,
          title: n.title,
          excerpt: n.excerpt,
          coverImage: n.image,
          category: CATEGORY_LABELS[n.category] ?? n.category,
          dateLabel: formatDate(n.publishedAt),
        }))}
        prev={prev ? { slug: prev.slug, title: prev.title } : null}
        next={next ? { slug: next.slug, title: next.title } : null}
        shareUrl={shareUrl}
      />
    );
  }

  /* ── 2. Repli : actualité statique (bandeau COMMUNIQUÉ) ── */
  const demo = getActualiteBySlug(slug);
  if (!demo) notFound();

  const { prev, next } = getPrevNextActualites(slug);
  return (
    <ArticleShell
      article={demoToShell(demo)}
      related={getRelatedActualites(slug, 4).map(demoToCard)}
      prev={prev ? { slug: prev.slug, title: prev.title } : null}
      next={next ? { slug: next.slug, title: next.title } : null}
      shareUrl={shareUrl}
    />
  );
}
