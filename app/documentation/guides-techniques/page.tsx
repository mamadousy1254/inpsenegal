import type { Metadata } from "next";
import { GuidesTechniquesClient } from "@/components/documentation/GuidesTechniquesClient";
import { getPublishedDocumentation } from "@/lib/services/documentation/get-published-documentation";

export const metadata: Metadata = {
  title: "Guides Techniques | INP",
  description: "Guides méthodologiques et protocoles techniques de l'INP.",
};

export const dynamic = "force-dynamic";

export default async function GuidesTechniquesPage() {
  const guides = await getPublishedDocumentation("guides-techniques");
  return <GuidesTechniquesClient guides={guides} />;
}
