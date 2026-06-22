import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocumentationResourceDetailClient } from "@/components/documentation/DocumentationResourceDetailClient";
import { getPublishedDocumentationBySlug } from "@/lib/services/documentation/get-published-documentation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedDocumentationBySlug(slug);
  if (!item) return { title: "Document introuvable" };

  return {
    title: `${item.title} — Documentation INP`,
    description: item.description.slice(0, 160),
  };
}

export default async function DocumentationResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublishedDocumentationBySlug(slug);
  if (!item) notFound();

  return <DocumentationResourceDetailClient item={item} />;
}
