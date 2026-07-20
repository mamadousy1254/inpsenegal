import type { Metadata } from "next";
import { CartothequePageClient } from "@/components/cartotheque/CartothequePageClient";
import { getPublishedCartothequePaginated } from "@/lib/services/cms/get-published-content";

export const metadata: Metadata = {
  title: "Cartothèque — INP",
  description:
    "Cartothèque de l'Institut National de Pédologie : cartes pédologiques et ressources cartographiques du Sénégal.",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function CartothequePublicPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const rawPage = Number(sp.page);
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  const result = await getPublishedCartothequePaginated(page, PAGE_SIZE);

  const safePage = Math.min(result.page, result.totalPages);
  if (page !== safePage && result.total > 0) {
    const { redirect } = await import("next/navigation");
    redirect(safePage <= 1 ? "/cartotheque" : `/cartotheque?page=${safePage}`);
  }

  return (
    <CartothequePageClient
      items={result.items}
      page={result.page}
      totalPages={result.totalPages}
      total={result.total}
    />
  );
}
