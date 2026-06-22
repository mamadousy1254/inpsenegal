import type { Metadata } from "next";
import { BulletinsScientifiquesClient } from "@/components/documentation/BulletinsScientifiquesClient";
import { getPublishedDocumentation } from "@/lib/services/documentation/get-published-documentation";

export const metadata: Metadata = {
  title: "Bulletins Scientifiques | INP",
  description: "Bulletins scientifiques de l'Institut National de Pédologie.",
};

export const dynamic = "force-dynamic";

export default async function BulletinsScientifiquesPage() {
  const bulletins = await getPublishedDocumentation("bulletins-scientifiques");
  return <BulletinsScientifiquesClient bulletins={bulletins} />;
}
