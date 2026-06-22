import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { IntroPublications } from "@/components/publications/IntroPublications";
import { PublicationsClient } from "@/components/publications/PublicationsClient";
import { getPublishedPublicationsAsItems } from "@/lib/services/cms/get-published-content";

export const metadata: Metadata = {
  title: "Publications — INP",
  description:
    "Consultez les rapports techniques, articles scientifiques, études nationales et fiches de référence publiés par l'Institut National de Pédologie.",
  openGraph: {
    title: "Publications — Institut National de Pédologie",
    description:
      "Productions scientifiques et techniques de l'INP : rapports, articles, études et fiches de référence.",
  },
};

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const publications = await getPublishedPublicationsAsItems();

  return (
    <>
      <PageHero
        title="Publications"
        subtitle="Rapports techniques, articles scientifiques, études nationales et fiches de référence au service de la science des sols."
        label="Productions scientifiques"
      />

      <IntroPublications />
      <PublicationsClient publications={publications} />
    </>
  );
}
