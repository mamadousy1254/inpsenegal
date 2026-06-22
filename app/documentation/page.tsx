import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { FileText, BookOpen, Database, Archive, ClipboardList, Scale } from "lucide-react";
import {
  DOCUMENTATION_RUBRIQUE_PATHS,
  type DocumentationRubrique,
} from "@/lib/constants/documentation";
import { getPublishedDocumentationCounts } from "@/lib/services/documentation/get-published-documentation";

export const metadata: Metadata = {
  title: "Documentation | INP",
  description:
    "Accédez à l'ensemble de la documentation de l'Institut National de Pédologie : rapports, guides techniques, bulletins scientifiques et données ouvertes.",
};

export const dynamic = "force-dynamic";

const sections: {
  title: string;
  description: string;
  icon: typeof FileText;
  href: string;
  rubrique?: DocumentationRubrique;
}[] = [
  {
    title: "Rapports & Publications",
    description: "Rapports techniques, publications scientifiques et documents méthodologiques.",
    icon: FileText,
    href: DOCUMENTATION_RUBRIQUE_PATHS["rapports-publications"],
    rubrique: "rapports-publications",
  },
  {
    title: "Guides Techniques",
    description: "Guides méthodologiques et protocoles pour les chercheurs et techniciens.",
    icon: BookOpen,
    href: DOCUMENTATION_RUBRIQUE_PATHS["guides-techniques"],
    rubrique: "guides-techniques",
  },
  {
    title: "Bulletins Scientifiques",
    description: "Publication officielle de l'INP dédiée à la diffusion des travaux de recherche.",
    icon: ClipboardList,
    href: DOCUMENTATION_RUBRIQUE_PATHS["bulletins-scientifiques"],
    rubrique: "bulletins-scientifiques",
  },
  {
    title: "Open Data",
    description: "Jeux de données ouverts pour la recherche et l'innovation.",
    icon: Database,
    href: DOCUMENTATION_RUBRIQUE_PATHS["open-data"],
    rubrique: "open-data",
  },
  {
    title: "Archives Pédologiques",
    description: "Anciens rapports, publications et bulletins historiques de l'INP.",
    icon: Archive,
    href: DOCUMENTATION_RUBRIQUE_PATHS.archives,
    rubrique: "archives",
  },
  {
    title: "Textes Réglementaires",
    description: "Cadre juridique encadrant les missions de l'INP et la gestion des sols.",
    icon: Scale,
    href: DOCUMENTATION_RUBRIQUE_PATHS["textes-reglementaires"],
    rubrique: "textes-reglementaires",
  },
];

export default async function DocumentationPage() {
  const counts = await getPublishedDocumentationCounts();

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="INP — Institut National de Pédologie"
        title="Documentation"
        subtitle="Accédez à l'ensemble de la documentation scientifique, technique et réglementaire produite par l'Institut National de Pédologie."
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-green-900 mb-4 text-center">
            Nos ressources documentaires
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] mb-16" />

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {sections.map((section) => {
              const Icon = section.icon;
              const count = section.rubrique ? counts[section.rubrique] : null;

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group rounded-2xl border border-green-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-1.5 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c]" />
                  <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 border border-green-100 group-hover:bg-green-100 transition">
                        <Icon className="h-6 w-6 text-green-700" />
                      </div>
                      {count !== null && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                          {count} publié{count > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-900 transition">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6">
            Besoin d&apos;un document spécifique ?
          </h2>
          <p className="text-lg opacity-90 mb-10">
            Nos archives sont accessibles sur demande pour les chercheurs,
            institutions et partenaires.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-green-900 font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Faire une demande
          </Link>
        </div>
      </section>
    </main>
  );
}
