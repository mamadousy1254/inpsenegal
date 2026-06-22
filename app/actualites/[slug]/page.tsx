import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleDetailClient } from "./ArticleDetailClient";
import {
  getPublishedActualiteBySlug,
  getPublishedActualitesAsNews,
} from "@/lib/services/cms/get-published-content";
import { toNewsItem } from "@/lib/services/cms/serialize-actualite";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedActualiteBySlug(slug);
  if (!article) return { title: "Article introuvable" };

  const newsItem = toNewsItem(article);

  return {
    title: `${newsItem.title} — Actualités INP`,
    description: newsItem.excerpt,
    openGraph: {
      title: newsItem.title,
      description: newsItem.excerpt,
      images: newsItem.image ? [{ url: newsItem.image }] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const articleDoc = await getPublishedActualiteBySlug(slug);
  if (!articleDoc) notFound();

  const article = toNewsItem(articleDoc);
  const allNews = await getPublishedActualitesAsNews();

  const related = allNews
    .filter((n) => n.category === article.category && n.slug !== article.slug)
    .slice(0, 3);

  return <ArticleDetailClient article={article} related={related} />;
}
