import { HeroSlider } from "@/components/sections/HeroSlider";
import { DirectorMessage } from "@/components/sections/DirectorMessage";
import { Missions } from "@/components/sections/missions";
import { AncrageTerritorial } from "@/components/sections/AncrageTerritorial";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { RechercheInnovation } from "@/components/sections/recherche-innovation";
import { Cartographie } from "@/components/sections/cartographie";
import { PublicationsSection } from "@/components/sections/publications-section";
import { ActualitesSection } from "@/components/sections/actualites-section";
import VideosSection from "@/components/VideosSection";
import { MediathequeSection } from "@/components/sections/mediatheque-section";
import { DirectorsTimeline } from "@/components/sections/DirectorsTimeline";
import PartnersMarquee from "@/components/PartnersMarquee";
import { getDirector } from "@/lib/parse-server";
import {
  getPublishedVideos,
  getPublishedResearchAxes,
} from "@/lib/services/cms/get-published-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [director, videos, researchAxes] = await Promise.all([
    getDirector(),
    getPublishedVideos(),
    getPublishedResearchAxes(),
  ]);
  return (
    <>
      <HeroSlider />
      <DirectorMessage director={director} />
      <Missions />
      <AncrageTerritorial />
      <ChiffresCles />
      <RechercheInnovation axes={researchAxes} />
      <Cartographie />
      <PublicationsSection />
      <ActualitesSection />
      {/* INP en vidéo — juste après Actualités */}
      <VideosSection videos={videos} />
      <MediathequeSection />
      <DirectorsTimeline />
      {/* Ils nous font confiance — après les Directeurs, avant le footer */}
      <PartnersMarquee />
    </>
  );
}
