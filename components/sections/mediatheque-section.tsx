import { Mediatheque } from "@/components/sections/mediatheque";
import { getPublishedGallery } from "@/lib/services/cms/get-published-content";

export async function MediathequeSection() {
  const gallery = await getPublishedGallery();
  return <Mediatheque gallery={gallery} />;
}
