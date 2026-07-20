"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers, ZoomIn } from "lucide-react";

import { PageHero } from "@/components/ui/PageHero";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PublicCartothequeMap } from "@/lib/services/cms/serialize-cartotheque";

type CartothequePageClientProps = {
  items: PublicCartothequeMap[];
  page: number;
  totalPages: number;
  total: number;
};

export function CartothequePageClient({
  items,
  page,
  totalPages,
  total,
}: CartothequePageClientProps) {
  const [selected, setSelected] = useState<PublicCartothequeMap | null>(null);

  const prevHref = page > 1 ? `/cartotheque?page=${page - 1}` : null;
  const nextHref = page < totalPages ? `/cartotheque?page=${page + 1}` : null;

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="Cartes — INP"
        title="Cartothèque"
        subtitle="Parcourez les cartes cartographiques de l'Institut National de Pédologie. Cliquez sur une carte pour l'agrandir."
      />

      <section className="border-b border-[#EADFC9] bg-gradient-to-br from-[#F7F1E6] via-white to-[#EADFC9] py-10">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 text-sm text-gray-500">
          <Layers className="size-4" aria-hidden />
          <span>
            <span className="font-semibold text-[#7B4F2A]">{total}</span> carte
            {total > 1 ? "s" : ""} publiée{total > 1 ? "s" : ""}
            {totalPages > 1 && (
              <>
                {" "}
                — page{" "}
                <span className="font-semibold text-[#7B4F2A]">
                  {page}
                </span>{" "}
                sur {totalPages}
              </>
            )}
          </span>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-4 text-center text-4xl font-semibold text-[#5E3D20]">
            Fonds cartographique
          </h2>
          <div className="mx-auto mb-14 h-1 w-20 rounded-full bg-[var(--inp-vert)]" />

          {items.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              Aucune carte publiée pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((map) => (
                <button
                  key={map.id}
                  type="button"
                  onClick={() => setSelected(map)}
                  className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2 rounded-2xl"
                >
                  <div className="overflow-hidden rounded-2xl border border-[#EADFC9]/80 bg-gradient-to-b from-white to-[#FAF7F2] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F1E6]/50">
                      <Image
                        src={map.imageUrl}
                        alt={map.alt}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-4 right-4 rounded-full bg-white/90 p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
                        <ZoomIn className="size-4 text-[var(--inp-vert)]" aria-hidden />
                      </div>
                    </div>
                    <div className="border-t border-[#EADFC9]/60 p-5">
                      <p className="text-sm font-semibold text-[#5E3D20]">{map.alt}</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-gray-600 line-clamp-3">
                        {map.legende}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              className="mt-14 flex flex-wrap items-center justify-center gap-3"
              aria-label="Pagination"
            >
              {prevHref ? (
                <Button variant="outline" render={<Link href={prevHref} />}>
                  <ChevronLeft className="size-4" />
                  Précédent
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <ChevronLeft className="size-4" />
                  Précédent
                </Button>
              )}
              <span className="px-2 text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              {nextHref ? (
                <Button variant="outline" render={<Link href={nextHref} />}>
                  Suivant
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Suivant
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </nav>
          )}
        </div>
      </section>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="flex max-h-[min(92vh,720px)] w-[min(calc(100%-2rem),44rem)] max-w-[44rem] flex-col gap-0 overflow-hidden p-0">
          {selected && (
            <>
              <DialogHeader className="shrink-0 border-b border-[#EADFC9] px-5 py-4 pr-12 text-left">
                <DialogTitle className="text-lg font-semibold text-[#5E3D20]">
                  {selected.alt}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Carte agrandie avec légende
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 overflow-auto bg-gradient-to-b from-[#F7F1E6]/80 to-white">
                <div className="flex items-center justify-center p-4 sm:p-6">
                  <Image
                    src={selected.imageUrl}
                    alt={selected.alt}
                    width={1400}
                    height={1000}
                    className="h-auto max-h-[min(55vh,480px)] w-full object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="shrink-0 border-t border-[#EADFC9] bg-[#FAF7F2] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7B4F2A]/80">
                  Légende
                </p>
                <p className="mt-2 max-h-36 overflow-y-auto text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {selected.legende}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
