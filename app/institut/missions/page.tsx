import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MissionsContent } from "./MissionsContent";

export const metadata: Metadata = {
  title: "Missions de l'INP",
  description:
    "Les huit missions officielles de l'Institut national de Pédologie : identification des sols, patrimoine foncier, formation, coordination, normes, coopération.",
};

export default function InstitutMissionsPage() {
  return (
    <>
      <PageHero
        label="L'Institut"
        title="Missions de l'INP"
        subtitle="Les missions assignées à l'INP."
      />
      <MissionsContent />
    </>
  );
}
