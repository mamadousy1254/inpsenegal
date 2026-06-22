import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MotDirecteurContent } from "./MotDirecteurContent";
import { getDirector } from "@/lib/parse-server";

export const metadata: Metadata = {
  title: "Le mot du Directeur",
  description:
    "Message du Directeur Général de l'INP, Dr Alfred Kouly TINE : vision et engagement pour la science des sols et la souveraineté alimentaire.",
};

export default async function MotDirecteurPage() {
  const director = await getDirector();

  return (
    <>
      <PageHero
        label="L'Institut"
        title="Le mot du Directeur"
        subtitle="Message institutionnel du Directeur Général de l'INP."
      />
      <MotDirecteurContent director={director} />
    </>
  );
}
