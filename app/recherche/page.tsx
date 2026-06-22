import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { VisionScientifique } from "@/components/recherche/VisionScientifique";
import { AxesRecherche } from "@/components/recherche/AxesRecherche";
import { ProjetsEnCours } from "@/components/recherche/ProjetsEnCours";
import { LaboratoiresSection } from "@/components/recherche/LaboratoiresSection";
import { PublicationsResultats } from "@/components/recherche/PublicationsResultats";
import { getPublishedPublicationsAsItems } from "@/lib/services/cms/get-published-content";

export const metadata: Metadata = {
  title: "Recherche & Innovation",
  description:
    "Recherche scientifique de l'INP : axes de recherche, projets en cours, laboratoires et publications sur la science des sols au Sénégal.",
};

export const dynamic = "force-dynamic";

export default async function RecherchePage() {
  const publications = await getPublishedPublicationsAsItems(6);

  return (
    <>
      <PageHero
        label="INP — Institut national de Pédologie"
        title="Recherche & Innovation"
        subtitle="Excellence scientifique au service de la connaissance des sols et du développement agricole."
      />
      <VisionScientifique />
      <AxesRecherche />
      <ProjetsEnCours />
      <LaboratoiresSection />
      <PublicationsResultats publications={publications} />
    </>
  );
}
