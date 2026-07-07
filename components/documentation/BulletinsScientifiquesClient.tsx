"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookMarked, Calendar, Filter } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentationDownloadLink } from "@/components/documentation/DocumentationDownloadLink";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

export function BulletinsScientifiquesClient({
  bulletins,
}: {
  bulletins: SerializedDocumentationResource[];
}) {
  const years = useMemo(
    () => ["Tous", ...Array.from(new Set(bulletins.map((b) => String(b.year))))],
    [bulletins],
  );
  const [selectedYear, setSelectedYear] = useState("Tous");

  const filtered =
    selectedYear === "Tous"
      ? bulletins
      : bulletins.filter((b) => String(b.year) === selectedYear);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="Documentation — INP"
        title="Bulletins Scientifiques"
        subtitle="Publication officielle de l'Institut National de Pédologie dédiée à la diffusion des travaux de recherche en science des sols et en gestion durable des terres."
      />

      <section className="py-6 bg-gray-50/80 border-y border-[#EADFC9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="h-5 w-5 text-[#7B4F2A]" />
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedYear === year
                      ? "bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c] text-white shadow-md"
                      : "bg-white border border-[#DCC8A8] text-[#7B4F2A] hover:bg-[#F7F1E6] hover:border-[#C9A574]"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#7B4F2A]">{filtered.length}</span> bulletin
              {filtered.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-[#5E3D20] mb-4">
            Éditions disponibles
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c] mb-16" />

          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Aucun bulletin publié pour le moment.</p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((bulletin) => (
                <div
                  key={bulletin._id}
                  className="group rounded-2xl border border-[#EADFC9] bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c]" />
                  <div className="p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-[#EADFC9] to-[#F7F1E6] text-[#7B4F2A] border border-[#DCC8A8]">
                        {bulletin.issue ?? `Vol. ${bulletin.year}`}
                      </span>
                      <span className="text-sm font-semibold flex items-center gap-1.5 bg-gradient-to-r from-[#5E3D20] to-[#8b5e3c] bg-clip-text text-transparent">
                        <Calendar size={14} className="text-[#7B4F2A]" />
                        {bulletin.year}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <BookMarked className="h-5 w-5 text-[#7B4F2A] mt-0.5 shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#5E3D20] transition leading-snug">
                        <Link href={`/documentation/${bulletin.slug}`} className="hover:underline">
                          {bulletin.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{bulletin.description}</p>
                    <div className="pt-4 border-t border-[#F7F1E6]">
                      <DocumentationDownloadLink
                        item={bulletin}
                        label="Télécharger le bulletin"
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6">Vous souhaitez contribuer ?</h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#5E3D20] font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Soumettre un article
          </Link>
        </div>
      </section>
    </main>
  );
}
