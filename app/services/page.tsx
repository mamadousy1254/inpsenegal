import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { IntroServices } from "@/components/services/IntroServices";
import { CatalogueServices } from "@/components/services/CatalogueServices";
import { ProcessusIntervention } from "@/components/services/ProcessusIntervention";
import { PublicCible } from "@/components/services/PublicCible";
import { DemandeService } from "@/components/services/DemandeService";

export const metadata: Metadata = {
  title: "Nos Services — INP",
  description:
    "Découvrez le catalogue des services scientifiques et techniques de l'INP : analyse des sols, cartographie, diagnostic de fertilité, expertise et appui institutionnel.",
  openGraph: {
    title: "Nos Services — Institut national de Pédologie",
    description:
      "Analyse des sols, cartographie pédologique, études agro-écologiques et expertise technique au service du développement agricole.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Nos Services"
        subtitle="Analyse des sols, cartographie, expertise technique et appui institutionnel au service du développement agricole national."
        label="Catalogue des prestations"
      />

      <IntroServices />
      <CatalogueServices />
      <ProcessusIntervention />
      <PublicCible />
      <DemandeService />
    </>
  );
}
