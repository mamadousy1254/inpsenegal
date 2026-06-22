"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ArrowLeft, FileText } from "lucide-react";
import { DocumentationDownloadLink } from "@/components/documentation/DocumentationDownloadLink";
import { getDocumentationViewHref, hasDocumentationFile } from "@/lib/services/documentation/documentation-download";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

export function TexteReglementaireDetailClient({
  doc,
}: {
  doc: SerializedDocumentationResource;
}) {
  const hasFile = hasDocumentationFile(doc);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative py-20 sm:py-24 lg:py-28 text-white bg-[var(--inp-vert)] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />

        <div className="relative container mx-auto max-w-6xl px-4 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Documentation officielle
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {doc.title}
          </h1>

          <span
            className="mx-auto mt-5 block h-[3px] w-24 rounded-full sm:w-32"
            style={{
              background:
                "linear-gradient(90deg, #00853F 0%, #00853F 33%, #FDEF42 33%, #FDEF42 66%, #E31B23 66%, #E31B23 100%)",
            }}
            aria-hidden
          />

          <p className="mx-auto mt-5 max-w-2xl text-base text-white/75 sm:text-lg">
            {doc.description}
          </p>
        </div>
      </section>

      <section className="py-6 bg-gray-50 border-b border-green-100">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/documentation/textes-reglementaires"
            className="inline-flex items-center gap-2 text-sm text-green-800 hover:text-green-600 transition font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux textes réglementaires
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-2xl shadow-xl border border-green-100 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c]" />

            <div className="bg-white p-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h2 className="text-xl font-semibold text-green-900 mb-6">
                    Informations du document
                  </h2>

                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-green-800 min-w-[100px]">Type :</span>
                      <span>{doc.legalType ?? "—"}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-green-800 min-w-[100px]">Date :</span>
                      <span>{doc.legalDate ?? doc.year}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-green-800 min-w-[100px]">Référence :</span>
                      <span>{doc.reference ?? "—"}</span>
                    </div>
                    {doc.fileSize && (
                      <div className="flex items-start gap-3">
                        <span className="font-semibold text-green-800 min-w-[100px]">Taille :</span>
                        <span>{doc.fileSize}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-green-800 min-w-[100px]">Format :</span>
                      <span className="inline-flex items-center gap-1">
                        <FileText className="h-4 w-4 text-red-600" /> PDF
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-6">
                  <DocumentationDownloadLink
                    item={doc}
                    label="Télécharger le document"
                    fullWidth
                    className="flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold shadow-lg"
                  />
                  {hasFile && (
                    <button
                      type="button"
                      onClick={() => setShowPreview((visible) => !visible)}
                      className="flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-green-700 text-green-900 font-semibold hover:bg-green-50 transition"
                    >
                      <Eye size={20} />
                      {showPreview ? "Masquer l'aperçu" : "Voir le document"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showPreview && hasFile && (
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Aperçu du document</h2>
            <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#0f3d2e] via-[#1f5c3f] to-[#8b5e3c] mb-8" />

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-green-100 bg-gray-50">
              <iframe
                title={doc.title}
                src={getDocumentationViewHref(doc)}
                className="w-full h-[500px] border-0"
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
