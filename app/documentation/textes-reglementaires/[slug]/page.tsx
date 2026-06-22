import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TexteReglementaireDetailClient } from "@/components/documentation/TexteReglementaireDetailClient";
import {
  getPublishedDocumentationByRubriqueAndSlug,
} from "@/lib/services/documentation/get-published-documentation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getPublishedDocumentationByRubriqueAndSlug(
    "textes-reglementaires",
    slug,
  );
  if (!doc) return { title: "Document introuvable | INP" };
  return {
    title: `${doc.title} | Textes réglementaires — INP`,
    description: doc.description,
  };
}

export default async function DocumentDetail({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getPublishedDocumentationByRubriqueAndSlug(
    "textes-reglementaires",
    slug,
  );

  if (!doc) notFound();

  return <TexteReglementaireDetailClient doc={doc} />;
}
