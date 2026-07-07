"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  FileSpreadsheet,
  Map,
  Filter,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentationDownloadLink } from "@/components/documentation/DocumentationDownloadLink";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

const categories = ["Tous", "Cartographie", "Laboratoire", "Terrain"];

const formatIcons: Record<string, React.ReactNode> = {
  GeoJSON: <Map className="h-5 w-5" />,
  CSV: <FileSpreadsheet className="h-5 w-5" />,
  XLS: <FileSpreadsheet className="h-5 w-5" />,
};

const formatColors: Record<string, string> = {
  GeoJSON: "bg-blue-100 text-blue-800",
  CSV: "bg-amber-100 text-amber-800",
  XLS: "bg-[#EADFC9] text-[#7B4F2A]",
};

export function OpenDataClient({ datasets }: { datasets: SerializedDocumentationResource[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filtered =
    selectedCategory === "Tous"
      ? datasets
      : datasets.filter((d) => d.category === selectedCategory);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="Documentation — INP"
        title="Données Ouvertes"
        subtitle="L'Institut met à disposition des jeux de données ouverts pour promouvoir la transparence, la recherche scientifique et l'innovation en gestion durable des terres."
      />

      <section className="py-6 bg-gray-50/80 border-y border-[#EADFC9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="h-5 w-5 text-[#7B4F2A]" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c] text-white shadow-md"
                      : "bg-white border border-[#DCC8A8] text-[#7B4F2A] hover:bg-[#F7F1E6] hover:border-[#C9A574]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#7B4F2A]">{filtered.length}</span> jeu
              {filtered.length > 1 ? "x" : ""} de données
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-[#5E3D20] mb-4">
            Jeux de données disponibles
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c] mb-16" />

          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Aucun jeu de données publié.</p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((dataset) => (
                <div
                  key={dataset._id}
                  className="group rounded-2xl border border-[#EADFC9] bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#5E3D20] via-[#8A5E38] to-[#8b5e3c]" />
                  <div className="p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#EADFC9] text-[#7B4F2A]">
                        {dataset.category ?? "Données"}
                      </span>
                      <span className="text-xs text-gray-500">MAJ {dataset.year}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#7B4F2A] mt-0.5 shrink-0">
                        {formatIcons[dataset.format ?? ""] ?? <Database className="h-5 w-5" />}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#5E3D20] transition leading-snug">
                        <Link href={`/documentation/${dataset.slug}`} className="hover:underline">
                          {dataset.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{dataset.description}</p>
                    <div className="pt-4 border-t border-[#F7F1E6] flex items-center justify-between gap-3">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          formatColors[dataset.format ?? ""] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {dataset.format ?? "Fichier"}
                      </span>
                      <DocumentationDownloadLink item={dataset} label="Télécharger" />
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
          <h2 className="text-3xl font-semibold mb-6">Vous exploitez nos données ?</h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#5E3D20] font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Proposer une collaboration
          </Link>
        </div>
      </section>
    </main>
  );
}
