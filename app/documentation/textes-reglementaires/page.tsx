import type { Metadata } from "next";
import { TextesReglementairesClient } from "@/components/documentation/TextesReglementairesClient";
import { getPublishedDocumentation } from "@/lib/services/documentation/get-published-documentation";

export const metadata: Metadata = {
  title: "Textes réglementaires | Documentation — INP",
  description:
    "Cadre juridique et réglementaire encadrant les missions de l'Institut National de Pédologie et la gestion des sols au Sénégal.",
};

export const dynamic = "force-dynamic";

export default async function TextesReglementairesPage() {
  const textes = await getPublishedDocumentation("textes-reglementaires");
  return <TextesReglementairesClient textes={textes} />;
}
