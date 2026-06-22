import type { Metadata } from "next";

import { EquipePageClient } from "@/components/institut/EquipePageClient";
import { demoEquipe } from "@/lib/demoEquipe";
import { getPublishedInstitutMembres } from "@/lib/services/institut/get-published-institut";
import type { PublicInstitutMembre } from "@/lib/services/institut/serialize-institut-membre";

export const metadata: Metadata = {
  title: "Notre équipe — Institut national de Pédologie",
  description:
    "Découvrez les femmes et les hommes de l'INP : direction, divisions techniques, administration, communication et délégations territoriales.",
};

async function loadMembres(): Promise<PublicInstitutMembre[]> {
  try {
    const fromDb = await getPublishedInstitutMembres();
    if (fromDb.length > 0) return fromDb;
  } catch {
    /* MongoDB indisponible — repli sur les données de démo */
  }

  return demoEquipe.map((m) => ({
    id: m.id,
    nom: m.nom,
    fonction: m.fonction,
    pole: m.pole,
    zone: m.zone,
    photo: m.photo,
  }));
}

export default async function EquipePage() {
  const membres = await loadMembres();
  return <EquipePageClient membres={membres} />;
}
