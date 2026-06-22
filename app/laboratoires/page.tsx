import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { IntroLaboratoires } from "@/components/laboratoires/IntroLaboratoires";
import { PresentationLabos } from "@/components/laboratoires/PresentationLabos";
import { EquipementsCapacites } from "@/components/laboratoires/EquipementsCapacites";
import { MethodologiesNormes } from "@/components/laboratoires/MethodologiesNormes";
import { DemandeAnalyse } from "@/components/laboratoires/DemandeAnalyse";

export const metadata: Metadata = {
  title: "Laboratoires — INP",
  description:
    "Découvrez les laboratoires spécialisés de l'INP : analyse physico-chimique, fertilité des sols, caractérisation pédologique, SIG et recherche terrain.",
  openGraph: {
    title: "Laboratoires — Institut national de Pédologie",
    description:
      "Infrastructures scientifiques, équipements de pointe et services d'analyse au service de la science des sols.",
  },
};

export default function LaboratoiresPage() {
  return (
    <>
      <PageHero
        title="Laboratoires"
        subtitle="Infrastructures scientifiques, équipements de pointe et expertise analytique au service de la science des sols."
        label="Nos moyens techniques"
      />

      <IntroLaboratoires />
      <PresentationLabos />
      <EquipementsCapacites />
      <MethodologiesNormes />
      <DemandeAnalyse />
    </>
  );
}
