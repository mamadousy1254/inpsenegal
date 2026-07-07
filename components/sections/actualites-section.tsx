import { Actualites } from "@/components/sections/actualites";
import { getPublishedActualitesAsNews } from "@/lib/services/cms/get-published-content";

export async function ActualitesSection() {
  const news = await getPublishedActualitesAsNews(3);
  return <Actualites news={news} />;
}
