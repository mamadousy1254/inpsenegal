import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { IntroCartographie } from "@/components/cartographie/IntroCartographie";
import { SoilMap } from "@/components/maps/SoilMap";
import ExplorateurSols from "@/components/ExplorateurSols";

export const metadata: Metadata = {
  title: "Cartographie des sols",
  description:
    "Système national de cartographie pédologique du Sénégal — Carte interactive, données par région, fiches techniques des types de sols.",
};

export default function CartographiePage() {
  return (
    <>
      <PageHero
        label="INP — Institut national de Pédologie"
        title="Cartographie des Sols"
        subtitle="Portail national de consultation des données pédologiques du Sénégal."
      />
      <IntroCartographie />
      <SoilMap />
      <ExplorateurSols />
    </>
  );
}
