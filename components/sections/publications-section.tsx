import { Publications } from "@/components/sections/publications";
import { getPublishedPublicationsAsItems } from "@/lib/services/cms/get-published-content";

export async function PublicationsSection() {
  const publications = await getPublishedPublicationsAsItems(3);
  return <Publications publications={publications} />;
}
