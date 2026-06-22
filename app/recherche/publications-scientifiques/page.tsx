import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { TYPE_LABELS } from "@/components/publications/publication-data";
import { PublicationDownloadLink } from "@/components/publications/PublicationDownloadLink";
import { getPublishedScientificPublicationsAsItems } from "@/lib/services/cms/get-published-content";

export const metadata: Metadata = {
  title: "Publications Scientifiques | INP",
  description:
    "L'INP contribue à la diffusion des connaissances pédologiques à travers des publications scientifiques, rapports techniques et articles spécialisés.",
};

export const dynamic = "force-dynamic";

export default async function PublicationsScientifiques() {
  const publications = await getPublishedScientificPublicationsAsItems();

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="INP — Institut national de Pédologie"
        title="Publications Scientifiques"
        subtitle="L'INP contribue à la diffusion des connaissances pédologiques à travers des publications scientifiques, rapports techniques et articles spécialisés."
      />

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-amber-900 mb-4 text-center">
            Publications récentes
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] mb-16" />

          {publications.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              Aucune publication publiée pour le moment.
            </p>
          ) : (
            <div className="space-y-8">
              {publications.map((pub) => (
                <div
                  key={pub.slug}
                  className="rounded-2xl border border-amber-100 shadow-md hover:shadow-xl transition duration-300 bg-white overflow-hidden"
                >
                  <div className="h-1 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c]" />

                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                            {TYPE_LABELS[pub.type]}
                          </span>
                          <span className="text-sm font-semibold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                            {pub.year}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          <Link
                            href={`/publications/${pub.slug}`}
                            className="hover:text-amber-900 transition"
                          >
                            {pub.title}
                          </Link>
                        </h3>

                        <p className="text-gray-600 text-sm">{pub.authors.join(", ")}</p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-3">
                        <Link
                          href={`/publications/${pub.slug}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-200 text-amber-900 text-sm font-medium hover:bg-amber-50 transition"
                        >
                          Voir détail
                          <ArrowRight size={16} />
                        </Link>
                        <PublicationDownloadLink
                          publication={pub}
                          label="Télécharger"
                          className="rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] px-6 py-3 text-sm font-medium text-white shadow-sm hover:brightness-110 hover:shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-16">Contribution scientifique</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <p className="text-4xl font-bold mb-2">{publications.length}+</p>
              <p className="opacity-80">Publications publiées</p>
            </div>

            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <p className="text-4xl font-bold mb-2">+15</p>
              <p className="opacity-80">Années de diffusion scientifique</p>
            </div>

            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
              <p className="text-4xl font-bold mb-2">National &amp; International</p>
              <p className="opacity-80">Partenariats académiques</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-amber-900 mb-6">
            Vous cherchez une publication spécifique ?
          </h2>

          <p className="text-lg text-gray-700 mb-10">
            Consultez l&apos;ensemble de nos publications ou contactez-nous pour une
            demande documentaire.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/publications"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white font-semibold hover:brightness-110 transition shadow-lg inline-flex items-center gap-2"
            >
              Catalogue complet
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl border border-amber-200 text-amber-900 font-semibold hover:bg-amber-50 transition inline-flex"
            >
              Faire une demande
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
