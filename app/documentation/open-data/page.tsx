import type { Metadata } from "next";
import { OpenDataClient } from "@/components/documentation/OpenDataClient";
import { getPublishedDocumentation } from "@/lib/services/documentation/get-published-documentation";

export const metadata: Metadata = {
  title: "Open Data | INP",
  description: "Jeux de données ouverts de l'Institut National de Pédologie.",
};

export const dynamic = "force-dynamic";

export default async function OpenDataPage() {
  const datasets = await getPublishedDocumentation("open-data");
  return <OpenDataClient datasets={datasets} />;
}
