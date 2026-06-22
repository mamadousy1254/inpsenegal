import type { Metadata } from "next";
import { ArchivesClient } from "@/components/documentation/ArchivesClient";
import { getPublishedDocumentation } from "@/lib/services/documentation/get-published-documentation";

export const metadata: Metadata = {
  title: "Archives Pédologiques | Documentation — INP",
  description:
    "Consultez les anciens rapports, publications scientifiques et bulletins historiques de l'Institut National de Pédologie.",
};

export const dynamic = "force-dynamic";

export default async function ArchivesPage() {
  const archives = await getPublishedDocumentation("archives");
  return <ArchivesClient archives={archives} />;
}
