"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Filter, FileText, FlaskConical, Map, Shovel } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentationDownloadLink } from "@/components/documentation/DocumentationDownloadLink";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

const categories = ["Tous", "Terrain", "Laboratoire", "Cartographie"];

const categoryIcons: Record<string, React.ReactNode> = {
  Terrain: <Shovel className="h-5 w-5" />,
  Laboratoire: <FlaskConical className="h-5 w-5" />,
  Cartographie: <Map className="h-5 w-5" />,
};

export function GuidesTechniquesClient({
  guides,
}: {
  guides: SerializedDocumentationResource[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredGuides =
    selectedCategory === "Tous"
      ? guides
      : guides.filter((g) => g.category === selectedCategory);

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="Documentation — INP"
        title="Guides Techniques"
        subtitle="Guides méthodologiques et protocoles techniques destinés aux chercheurs, techniciens, décideurs et partenaires institutionnels."
      />

      <section className="py-12 bg-gray-50/80 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              <Filter className="h-5 w-5 text-green-700" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] text-white shadow-md"
                      : "bg-white border border-green-200 text-green-800 hover:bg-green-50 hover:border-green-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-green-800">{filteredGuides.length}</span>{" "}
              guide{filteredGuides.length > 1 ? "s" : ""} disponible
              {filteredGuides.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center text-green-900 mb-4">
            Ressources méthodologiques
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] mb-16" />

          {filteredGuides.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Aucun guide publié pour le moment.</p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredGuides.map((guide) => (
                <div
                  key={guide._id}
                  className="group rounded-2xl border border-green-100 bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c]" />
                  <div className="p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-700">
                        {categoryIcons[guide.category ?? ""] || (
                          <BookOpen className="h-5 w-5" />
                        )}
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                          {guide.category ?? "Guide"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold bg-gradient-to-r from-[#0f3d2e] to-[#8b5e3c] bg-clip-text text-transparent">
                        {guide.year}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-green-700 mt-0.5 shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-900 transition leading-snug">
                        <Link href={`/documentation/${guide.slug}`} className="hover:underline">
                          {guide.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{guide.description}</p>
                    <div className="pt-4 border-t border-green-50">
                      <DocumentationDownloadLink item={guide} label="Télécharger le guide" fullWidth />
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
          <h2 className="text-3xl font-semibold mb-6">Besoin d&apos;un accompagnement technique ?</h2>
          <p className="text-lg opacity-90 mb-10">
            Nos équipes peuvent vous fournir un appui méthodologique adapté à vos projets.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-green-900 font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Demander un appui technique
          </Link>
        </div>
      </section>
    </main>
  );
}
