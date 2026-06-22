import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { AxesInterventionSection } from "@/components/institut/AxesInterventionSection";

export const metadata: Metadata = {
  title: "Axes d'intervention",
  description:
    "Les quatre axes d'intervention de l'INP : connaissance des sols, productivité, renforcement des capacités GDT, coordination et partenariat.",
};

export default function AxesInterventionPage() {
  return (
    <>
      <PageHero
        label="L'Institut"
        title="Axes d'intervention"
        subtitle="Quatre axes structurants de l'action de l'INP."
      />
      <AxesInterventionSection />
    </>
  );
}
