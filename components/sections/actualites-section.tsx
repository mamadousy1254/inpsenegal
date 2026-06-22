import { Actualites } from "@/components/sections/actualites";
import { getPublishedActualitesAsNews, getPublishedVideos } from "@/lib/services/cms/get-published-content";

export async function ActualitesSection() {
  const [news, videos] = await Promise.all([
    getPublishedActualitesAsNews(3),
    getPublishedVideos(4),
  ]);

  return <Actualites news={news} videos={videos} />;
}
