import type { Metadata } from "next";

import { PartenairesPageClient } from "@/components/partenaires/PartenairesPageClient";
import { demoPartenaires } from "@/lib/demoPartenaires";
import { getPublishedPartenaires } from "@/lib/services/partenaires/get-published-partenaires";
import type { PublicPartenaire } from "@/lib/services/partenaires/serialize-partenaire";

export const metadata: Metadata = {
  title: "Nos partenaires — Institut national de Pédologie",
  description:
    "Réseau institutionnel de l'INP : gouvernement, organisations internationales, universités, société civile et centres de recherche.",
};

async function loadPartenaires(): Promise<PublicPartenaire[]> {
  try {
    const fromDb = await getPublishedPartenaires();
    if (fromDb.length > 0) return fromDb;
  } catch {
    /* repli sur les données de démo */
  }

  return demoPartenaires.map((p) => ({
    id: p.id,
    nom: p.nom,
    acronyme: p.acronyme,
    description: p.description,
    category: p.category,
    logo: p.logo,
    siteWeb: p.siteWeb,
    pays: p.pays,
  }));
}

export default async function PartenairesPage() {
  const partenaires = await loadPartenaires();
  return <PartenairesPageClient partenaires={partenaires} />;
}
