import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { VisionScientifique } from "@/components/recherche/VisionScientifique";
import { AxesRecherche } from "@/components/recherche/AxesRecherche";
import { ProjetsEnCours } from "@/components/recherche/ProjetsEnCours";
import { LaboratoiresSection } from "@/components/recherche/LaboratoiresSection";
import { PublicationsResultats } from "@/components/recherche/PublicationsResultats";
import {
  getPublishedPublicationsAsItems,
  getPublishedResearchAxes,
  getPublishedResearchProjects,
} from "@/lib/services/cms/get-published-content";

export const metadata: Metadata = {
  title: "Recherche & Innovation",
  description:
    "Recherche scientifique de l'INP : axes de recherche, projets en cours, laboratoires et publications sur la science des sols au Sénégal.",
};

export const dynamic = "force-dynamic";

export default async function RecherchePage() {
  const [publications, researchAxes, researchProjects] = await Promise.all([
    getPublishedPublicationsAsItems(6),
    getPublishedResearchAxes(),
    getPublishedResearchProjects(),
  ]);

  return (
    // Charte de référence (Vercel) : ton dominant brun terre sur toute la page
    // Recherche. La référence définit globalement `--primary` et `--inp-vert`
    // sur ce brun ; ici on applique la même valeur LOCALEMENT (scopée à la page)
    // → hero (PageHero), titres de section (text-primary) et accents/survols
    // (var(--inp-vert)) passent en ocre/brun comme la référence, sans toucher
    // aux tokens globaux.
    <div
      style={
        { "--primary": "#7B4F2A", "--inp-vert": "#7B4F2A" } as CSSProperties
      }
    >
      <PageHero
        label="INP — Institut national de Pédologie"
        title="Recherche & Innovation"
        subtitle="Excellence scientifique au service de la connaissance des sols et du développement agricole."
      />
      <VisionScientifique />
      <AxesRecherche axes={researchAxes} />
      <ProjetsEnCours projects={researchProjects} />
      <LaboratoiresSection />
      <PublicationsResultats publications={publications} />
    </div>
  );
}
