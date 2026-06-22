import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TYPE_LABELS, TYPE_COLORS } from "@/components/publications/publication-data";
import { PublicationDetailClient } from "./PublicationDetailClient";
import {
  getPublishedPublicationBySlug,
} from "@/lib/services/cms/get-published-content";
import { toPublicationItem } from "@/lib/services/cms/serialize-publication";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pubDoc = await getPublishedPublicationBySlug(slug);
  if (!pubDoc) return { title: "Publication introuvable" };

  const pub = toPublicationItem(pubDoc);

  return {
    title: `${pub.title} — Publications INP`,
    description: pub.abstract.slice(0, 160),
    openGraph: {
      title: pub.title,
      description: pub.abstract.slice(0, 200),
    },
  };
}

export default async function PublicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pubDoc = await getPublishedPublicationBySlug(slug);
  if (!pubDoc) notFound();

  const publication = toPublicationItem(pubDoc);

  return (
    <PublicationDetailClient
      publication={publication}
      typeLabel={TYPE_LABELS[publication.type]}
      typeColor={TYPE_COLORS[publication.type]}
    />
  );
}
