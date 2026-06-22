"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";
import type { TextesLegalCategory } from "@/lib/constants/documentation";

function DocCard({
  doc,
  variant,
}: {
  doc: SerializedDocumentationResource;
  variant: "list" | "grid";
}) {
  const href = `/documentation/textes-reglementaires/${doc.slug}`;

  if (variant === "grid") {
    return (
      <Link
        href={href}
        className="group block rounded-2xl bg-white shadow-md border border-green-100 hover:shadow-xl transition duration-300 overflow-hidden"
      >
        <div className="h-1 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c]" />
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
              {doc.legalType ?? "Texte"}
            </span>
            <span className="text-xs bg-gradient-to-r from-[#0f3d2e] to-[#8b5e3c] bg-clip-text text-transparent font-semibold">
              {doc.legalDate ?? doc.year}
            </span>
          </div>
          <h3 className="font-semibold text-green-800 mb-4 group-hover:text-green-900 transition">
            {doc.title}
          </h3>
          <p className="text-gray-600 text-sm">{doc.description}</p>
          <span className="inline-flex items-center gap-1 mt-4 text-sm text-green-700 font-medium group-hover:gap-2 transition-all">
            Consulter <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-green-100 shadow-md bg-gradient-to-r from-green-50 to-white hover:shadow-xl transition duration-300 overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c]" />
      <div className="p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                {doc.legalType ?? "Texte"}
              </span>
              <span className="text-xs bg-gradient-to-r from-[#0f3d2e] to-[#8b5e3c] bg-clip-text text-transparent font-semibold">
                {doc.legalDate ?? doc.year}
              </span>
            </div>
            <p className="text-green-800 font-semibold mb-2">{doc.title}</p>
            <p className="text-gray-600 text-sm">{doc.description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}

export function TextesReglementairesClient({
  textes,
}: {
  textes: SerializedDocumentationResource[];
}) {
  const byCategory = (category: TextesLegalCategory) =>
    textes.filter((t) => t.category === category);

  const baseLegale = byCategory("base-legale");
  const nationaux = byCategory("national");
  const internationaux = byCategory("international");

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        label="Documentation — INP"
        title="Textes réglementaires"
        subtitle="Cadre juridique et réglementaire encadrant les missions de l'Institut National de Pédologie et la gestion des sols au Sénégal."
      />

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-green-900 mb-4">
            Base légale de l&apos;Institut
          </h2>
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] mb-12" />

          {baseLegale.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun texte publié pour le moment.</p>
          ) : (
            <div className="space-y-6">
              {baseLegale.map((doc) => (
                <DocCard key={doc._id} doc={doc} variant="list" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-green-900 mb-4">
            Textes nationaux relatifs aux sols
          </h2>
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] mb-12" />

          {nationaux.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun texte publié pour le moment.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {nationaux.map((doc) => (
                <DocCard key={doc._id} doc={doc} variant="grid" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-green-900 mb-4">
            Conventions internationales
          </h2>
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] mb-12" />

          {internationaux.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun texte publié pour le moment.</p>
          ) : (
            <div className="space-y-6">
              {internationaux.map((doc) => (
                <DocCard key={doc._id} doc={doc} variant="list" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6">Documents officiels</h2>

          <p className="text-lg opacity-90 mb-10">
            L&apos;ensemble des textes réglementaires et décrets officiels est disponible sur
            demande. Contactez-nous pour recevoir les documents.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-green-900 font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Demander les textes officiels
          </Link>
        </div>
      </section>
    </main>
  );
}
