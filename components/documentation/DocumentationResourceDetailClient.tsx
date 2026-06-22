import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
} from "lucide-react";

import { DocumentationDownloadLink } from "@/components/documentation/DocumentationDownloadLink";
import {
  DOCUMENTATION_RUBRIQUE_LABELS,
  DOCUMENTATION_RUBRIQUE_PATHS,
} from "@/lib/constants/documentation";
import type { SerializedDocumentationResource } from "@/lib/services/documentation/serialize-documentation-resource";

function metaBadge(item: SerializedDocumentationResource) {
  if (item.rubrique === "bulletins-scientifiques" && item.issue) return item.issue;
  if (item.rubrique === "open-data" && item.format) return item.format;
  if (item.docType) return item.docType;
  if (item.category) return item.category;
  return DOCUMENTATION_RUBRIQUE_LABELS[item.rubrique];
}

export function DocumentationResourceDetailClient({
  item,
}: {
  item: SerializedDocumentationResource;
}) {
  const listPath = DOCUMENTATION_RUBRIQUE_PATHS[item.rubrique];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[var(--inp-vert)] pb-14 pt-20 sm:pb-16 sm:pt-24">
        <div className="container mx-auto max-w-4xl px-4">
          <Link
            href={listPath}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à {DOCUMENTATION_RUBRIQUE_LABELS[item.rubrique]}
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              <FileText className="h-3 w-3" />
              {metaBadge(item)}
            </span>
            <span className="flex items-center gap-1 text-sm text-white/70">
              <Calendar className="h-3.5 w-3.5" />
              {item.year}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {item.title}
          </h1>

          {item.author && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-white/60">
              <User className="h-3.5 w-3.5" /> {item.author}
            </p>
          )}
        </div>
      </section>

      <section className="py-14 px-4 sm:py-20">
        <div className="container mx-auto max-w-3xl">
          <p className="text-base leading-relaxed text-gray-700">{item.description}</p>

          <div className="mt-10">
            <DocumentationDownloadLink
              item={item}
              label="Télécharger le document"
              className="px-6 py-3 text-sm font-semibold shadow-md"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
