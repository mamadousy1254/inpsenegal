import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MissionGenerale } from "@/components/missions/MissionGenerale";
import { MissionsStrategiques } from "@/components/missions/MissionsStrategiques";
import { MissionsOperationnelles } from "@/components/missions/MissionsOperationnelles";
import { ImpactNational } from "@/components/missions/ImpactNational";

export const metadata: Metadata = {
  title: "Missions",
  description:
    "Missions de l'INP : recherche scientifique, cartographie des sols, appui aux politiques agricoles, formation et diffusion des connaissances.",
};

export default function MissionsPage() {
  return (
    <>
      <PageHero
        label="INP — Institut national de Pédologie"
        title="Nos Missions"
        subtitle="Recherche, cartographie et expertise au service du développement agricole national."
      />
      <MissionGenerale />
      <MissionsStrategiques />
      <MissionsOperationnelles />
      <ImpactNational />
    </>
  );
}
