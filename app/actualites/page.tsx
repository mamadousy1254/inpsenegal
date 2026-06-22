import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { IntroActualites } from "@/components/actualites/IntroActualites";
import { ActualitesClient } from "@/components/actualites/ActualitesClient";
import { VideosSection } from "@/components/actualites/VideosSection";
import {
  getPublishedActualitesAsNews,
  getPublishedVideos,
} from "@/lib/services/cms/get-published-content";

export const metadata: Metadata = {
  title: "Actualités — INP",
  description:
    "Suivez les actualités, événements, projets et communications officielles de l'Institut National de Pédologie du Sénégal.",
  openGraph: {
    title: "Actualités — Institut National de Pédologie",
    description:
      "Activités, événements, partenariats et projets de l'INP.",
  },
};

export const dynamic = "force-dynamic";

export default async function ActualitesPage() {
  const [news, videos] = await Promise.all([
    getPublishedActualitesAsNews(),
    getPublishedVideos(),
  ]);

  return (
    <>
      <PageHero
        title="Actualités"
        subtitle="Activités, événements, projets et communications officielles de l'Institut National de Pédologie."
        label="Vie institutionnelle"
      />

      <IntroActualites />
      <ActualitesClient news={news} />
      <VideosSection videos={videos} />
    </>
  );
}
