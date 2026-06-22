"use client";

import { useState } from "react";
import Link from "next/link";
import { Archive, Calendar, Search, FileText } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentationDownloadLink } from "@/components/documentation/DocumentationDownloadLink";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

export function ArchivesClient({
  archives,
}: {
  archives: SerializedDocumentationResource[];
}) {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("Tous");

  const years = [
    "Tous",
    ...Array.from(new Set(archives.map((a) => String(a.year)))).sort(
      (a, b) => Number(b) - Number(a),
    ),
  ];

  const filteredArchives = archives.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesYear = selectedYear === "Tous" || String(item.year) === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="Documentation — INP"
        title="Archives Pédologiques"
        subtitle="Consultez les anciens rapports, publications scientifiques et bulletins historiques de l'Institut National de Pédologie."
      />

      <section className="py-12 bg-gray-50/80 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex items-center gap-3 max-w-xl">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Calendar className="h-5 w-5 text-green-700" />
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedYear === year
                    ? "bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] text-white shadow-md"
                    : "bg-white border border-green-200 text-green-800 hover:bg-green-50 hover:border-green-300"
                }`}
              >
                {year}
              </button>
            ))}

            <span className="ml-auto text-sm text-gray-500">
              <span className="font-semibold text-green-800">{filteredArchives.length}</span>{" "}
              résultat{filteredArchives.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-green-900 mb-4">
            Fonds documentaire
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] mb-16" />

          {filteredArchives.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Archive className="h-16 w-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">Aucun document trouvé</p>
              <p className="text-sm">
                Essayez avec d&apos;autres mots-clés ou une autre année.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredArchives.map((archive) => (
                <div
                  key={archive._id}
                  className="group rounded-2xl border border-green-100 bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c]" />

                  <div className="p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                        {archive.docType ?? "Archive"}
                      </span>
                      <span className="text-sm font-semibold bg-gradient-to-r from-[#0f3d2e] to-[#8b5e3c] bg-clip-text text-transparent">
                        {archive.year}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-green-700 mt-0.5 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-900 transition leading-snug">
                        {archive.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">{archive.description}</p>

                    <div className="pt-4 border-t border-green-50">
                      <DocumentationDownloadLink item={archive} label="Télécharger" fullWidth />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6">
            Vous recherchez un document ancien ?
          </h2>

          <p className="text-lg opacity-90 mb-10">
            L&apos;INP dispose d&apos;un fonds documentaire de plus de 50 ans. Nos archivistes
            peuvent vous accompagner dans vos recherches.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-green-900 font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Contacter les archives
          </Link>
        </div>
      </section>
    </main>
  );
}
