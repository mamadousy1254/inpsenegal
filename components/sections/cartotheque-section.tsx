import { CartothequeHome } from "@/components/sections/cartotheque-home";
import { getPublishedCartothequeMaps } from "@/lib/services/cms/get-published-content";

const HOME_CARTOTHEQUE_LIMIT = 4;

export async function CartothequeSection() {
  const maps = await getPublishedCartothequeMaps(HOME_CARTOTHEQUE_LIMIT);
  return <CartothequeHome maps={maps} />;
}
