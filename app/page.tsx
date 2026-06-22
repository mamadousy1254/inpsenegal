import { HeroSlider } from "@/components/sections/HeroSlider";
import { DirectorMessage } from "@/components/sections/DirectorMessage";
import { Missions } from "@/components/sections/missions";
import { ChiffresCles } from "@/components/sections/chiffres-cles";
import { RechercheInnovation } from "@/components/sections/recherche-innovation";
import { Cartographie } from "@/components/sections/cartographie";
import { PublicationsSection } from "@/components/sections/publications-section";
import { ActualitesSection } from "@/components/sections/actualites-section";
import { MediathequeSection } from "@/components/sections/mediatheque-section";
import { DirectorsTimeline } from "@/components/sections/DirectorsTimeline";
import { getDirector } from "@/lib/parse-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const director = await getDirector();
  return (
    <>
      <HeroSlider />
      <DirectorMessage director={director} />
      <Missions />
      <ChiffresCles />
      <RechercheInnovation />
      <Cartographie />
      <PublicationsSection />
      <ActualitesSection />
      <MediathequeSection />
      <DirectorsTimeline />
    </>
  );
}
