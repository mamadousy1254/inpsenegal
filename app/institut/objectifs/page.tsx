import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ObjectifsContent } from "./ObjectifsContent";

export const metadata: Metadata = {
  title: "Objectifs de l'INP",
  description:
    "Objectifs de l'Institut national de Pédologie : statut institutionnel, contribution au développement économique et social, souveraineté alimentaire.",
};

export default function ObjectifsPage() {
  return (
    <>
      <PageHero
        label="L'Institut"
        title="Objectifs de l'INP"
        subtitle="Statut institutionnel et objectif stratégique national."
      />
      <ObjectifsContent />
    </>
  );
}
