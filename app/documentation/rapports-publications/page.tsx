import type { Metadata } from "next";
import { RapportsPublicationsClient } from "@/components/documentation/RapportsPublicationsClient";
import { getPublishedDocumentation } from "@/lib/services/documentation/get-published-documentation";

export const metadata: Metadata = {
  title: "Rapports & Publications | INP",
  description: "Rapports et publications documentaires de l'INP.",
};

export const dynamic = "force-dynamic";

export default async function RapportsPublicationsPage() {
  const reports = await getPublishedDocumentation("rapports-publications");
  return <RapportsPublicationsClient reports={reports} />;
}
