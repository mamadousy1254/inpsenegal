import type { Metadata } from "next";
import type { CSSProperties } from "react";
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
    // Charte de référence (Vercel) : sur cette page le ton dominant est le brun
    // terre. La référence redéfinit globalement `--inp-vert` en #7B4F2A ; ici on
    // applique la même valeur de façon LOCALE (scopée à la page) afin que le hero
    // (PageHero) et le bandeau photo (MotDirecteurContent), qui utilisent
    // `var(--inp-vert)`, s'affichent en ocre/brun comme sur la référence —
    // sans modifier le token global ni les composants partagés.
    <div style={{ "--inp-vert": "#7B4F2A" } as CSSProperties}>
      <PageHero
        label="L'Institut"
        title="Le mot du Directeur"
        subtitle="Message institutionnel du Directeur Général de l'INP."
      />
      <MotDirecteurContent director={director} />
    </div>
  );
}
