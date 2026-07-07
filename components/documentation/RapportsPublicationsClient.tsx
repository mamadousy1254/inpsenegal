"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Filter, BookOpen, ClipboardList, Beaker } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentationDownloadLink } from "@/components/documentation/DocumentationDownloadLink";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

const typeFilters = [
  "Tous",
  "Rapport technique",
  "Publication scientifique",
  "Guide technique",
  "Fiche technique",
  "Étude",
  "Carte",
];

const typeIcons: Record<string, React.ReactNode> = {
  "Rapport technique": <ClipboardList className="h-5 w-5" />,
  "Publication scientifique": <Beaker className="h-5 w-5" />,
  "Guide technique": <BookOpen className="h-5 w-5" />,
};

export function RapportsPublicationsClient({
  reports,
}: {
  reports: SerializedDocumentationResource[];
}) {
  const [selectedType, setSelectedType] = useState("Tous");

  const filteredReports =
    selectedType === "Tous"
      ? reports
      : reports.filter((r) => r.docType === selectedType);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="Documentation — INP"
        title="Rapports & Publications"
        subtitle="Rapports techniques, publications scientifiques et documents méthodologiques produits par l'Institut National de Pédologie."
      />

      <section className="py-12 bg-gray-50/80 border-b border-[#EADFC9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="h-5 w-5 text-[#7B4F2A]" />
              {typeFilters.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedType === type
                      ? "bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c] text-white shadow-md"
                      : "bg-white border border-[#DCC8A8] text-[#7B4F2A] hover:bg-[#F7F1E6] hover:border-[#C9A574]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#7B4F2A]">{filteredReports.length}</span> document
              {filteredReports.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {filteredReports.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Aucun document publié pour le moment.</p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  className="group rounded-2xl border border-[#EADFC9] bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c]" />
                  <div className="p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#EADFC9] text-[#7B4F2A]">
                        {report.docType ?? "Document"}
                      </span>
                      <span className="text-sm font-semibold bg-gradient-to-r from-[#5E3D20] to-[#8b5e3c] bg-clip-text text-transparent">
                        {report.year}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      {typeIcons[report.docType ?? ""] || <FileText className="h-5 w-5 text-[#7B4F2A] mt-0.5 shrink-0" />}
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#5E3D20] transition leading-snug">
                        <Link href={`/documentation/${report.slug}`} className="hover:underline">
                          {report.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{report.description}</p>
                    <div className="pt-4 border-t border-[#F7F1E6]">
                      <DocumentationDownloadLink item={report} label="Télécharger" fullWidth />
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
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#5E3D20] font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Faire une demande documentaire
          </Link>
        </div>
      </section>
    </main>
  );
}
