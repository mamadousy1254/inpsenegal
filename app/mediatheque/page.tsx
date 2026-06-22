import type { Metadata } from "next";
import { MediathequePageClient } from "@/components/mediatheque/MediathequePageClient";
import { getPublishedGallery } from "@/lib/services/cms/get-published-content";

export const metadata: Metadata = {
  title: "Médiathèque — INP",
  description:
    "Galerie photographique officielle de l'Institut National de Pédologie : missions de terrain, laboratoires et événements institutionnels.",
};

export const dynamic = "force-dynamic";

export default async function MediathequePage() {
  const photos = await getPublishedGallery();
  return <MediathequePageClient photos={photos} />;
}
