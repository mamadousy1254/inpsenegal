import Image from "next/image";
import Link from "next/link";
import SocialShare from "@/components/SocialShare";

/* ------------------------------------------------------------------ */
/*  Gabarit d'article d'actualité — modèle de référence (Vercel).      */
/*                                                                     */
/*  Fond crème, colonne article (cover arrondie, badge + catégorie +   */
/*  date, chapô italique, partage, contenu .prose-inp, source, nav     */
/*  précédent/suivant) + sidebar (À lire aussi, Restez informé, Une    */
/*  question ?) + section « Autres actualités » en bas.                */
/*                                                                     */
/*  Présentationnel : alimenté aussi bien par les articles CMS         */
/*  (back-office) que par les actualités statiques (demoActualites).   */
/* ------------------------------------------------------------------ */

export interface ShellArticleCard {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  /** Pastille type (COMMUNIQUÉ / URGENT / INFO) — optionnelle. */
  badge?: string;
  category: string;
  dateLabel: string;
}

export interface ShellArticle extends ShellArticleCard {
  contentHtml: string;
  source?: string;
  author?: string;
  sourceUrl?: string;
}

interface ArticleShellProps {
  article: ShellArticle;
  /** Autres actualités (hors article courant) — sidebar (4) + bas de page (3). */
  related: ShellArticleCard[];
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
  /** URL absolue de l'article (partage). */
  shareUrl: string;
}

const TYPE_COLORS: Record<string, string> = {
  URGENT: "bg-red-500 text-white",
  COMMUNIQUÉ: "bg-[#7B4F2A] text-white",
  INFO: "bg-[#8B5E3C] text-white",
};

function Badge({ badge }: { badge?: string }) {
  if (!badge) return null;
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full ${TYPE_COLORS[badge] || "bg-[#7B4F2A] text-white"}`}
    >
      {badge}
    </span>
  );
}

export function ArticleShell({
  article,
  related,
  prev,
  next,
  shareUrl,
}: ArticleShellProps) {
  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/actualites"
          className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-6 font-medium text-sm"
        >
          ← Retour aux actualités
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLONNE PRINCIPALE */}
          <article className="lg:col-span-2">
            {article.coverImage && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6 shadow-md">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  unoptimized={article.coverImage.startsWith("http")}
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge badge={article.badge} />
              <span className="text-xs font-semibold text-[#C9A574] uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-[#8B7355]">•</span>
              <span className="text-sm text-[#5A4733]">{article.dateLabel}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#2A1F18] leading-tight mb-4">
              {article.title}
            </h1>

            {(article.source || article.author) && (
              <div className="flex items-center gap-2 text-sm text-[#5A4733] mb-6 pb-6 border-b border-[#E5DCC2]">
                {article.source && (
                  <span className="text-xs font-bold text-[#7B4F2A] uppercase tracking-wider">
                    {article.source}
                  </span>
                )}
                {article.author && (
                  <>
                    {article.source && <span className="text-[#C9A574]">—</span>}
                    <span>{article.author}</span>
                  </>
                )}
              </div>
            )}

            {article.excerpt && (
              <p className="text-base md:text-lg text-[#5A4733] leading-relaxed italic mb-6 pb-6 border-b border-[#E5DCC2]">
                {article.excerpt}
              </p>
            )}

            <div className="mb-8">
              <SocialShare
                url={shareUrl}
                title={article.title}
                description={article.excerpt}
              />
            </div>

            <div
              className="prose-inp text-[#2A1F18] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {article.sourceUrl && (
              <div className="mt-8 pt-6 border-t border-[#E5DCC2]">
                <p className="text-xs text-[#5A4733] mb-1 font-semibold uppercase tracking-wider">
                  Source officielle
                </p>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#7B4F2A] hover:text-[#4A2F1A] hover:underline"
                >
                  Consulter l&apos;article sur le site source
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            )}

            <div className="mt-8">
              <SocialShare
                url={shareUrl}
                title={article.title}
                description={article.excerpt}
              />
            </div>

            {(prev || next) && (
              <nav className="mt-10 pt-8 border-t border-[#E5DCC2] grid grid-cols-1 md:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/actualites/${prev.slug}`}
                    className="group bg-white border border-[#E5DCC2] hover:border-[#C9A574] rounded-lg p-4 transition-colors"
                  >
                    <p className="text-xs font-semibold text-[#C9A574] uppercase tracking-wider mb-2">
                      ← Article précédent
                    </p>
                    <h4 className="font-bold text-[#2A1F18] line-clamp-2 group-hover:text-[#7B4F2A]">
                      {prev.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={`/actualites/${next.slug}`}
                    className="group bg-white border border-[#E5DCC2] hover:border-[#C9A574] rounded-lg p-4 transition-colors md:text-right"
                  >
                    <p className="text-xs font-semibold text-[#C9A574] uppercase tracking-wider mb-2">
                      Article suivant →
                    </p>
                    <h4 className="font-bold text-[#2A1F18] line-clamp-2 group-hover:text-[#7B4F2A]">
                      {next.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            )}
          </article>

          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {related.length > 0 && (
                <div className="bg-white border border-[#E5DCC2] rounded-xl p-5">
                  <h3 className="font-bold text-[#7B4F2A] text-sm uppercase tracking-wider mb-4 pb-2 border-b-2 border-[#C9A574]">
                    ★ À lire aussi
                  </h3>
                  <div className="space-y-4">
                    {related.slice(0, 4).map((r) => (
                      <Link
                        key={r.slug}
                        href={`/actualites/${r.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-3">
                          {r.coverImage && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#E5DCC2]">
                              <Image
                                src={r.coverImage}
                                alt={r.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                                unoptimized={r.coverImage.startsWith("http")}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-[#C9A574] uppercase tracking-wider mb-1">
                              {r.category}
                            </p>
                            <h4 className="text-sm font-bold text-[#2A1F18] leading-tight line-clamp-3 group-hover:text-[#7B4F2A] transition-colors">
                              {r.title}
                            </h4>
                            <p className="text-xs text-[#8B7355] mt-1">
                              {r.dateLabel}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/actualites"
                    className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#7B4F2A] hover:text-[#4A2F1A]"
                  >
                    Voir toutes les actualités
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}

              <div className="bg-gradient-to-br from-[#7B4F2A] to-[#4A2F1A] text-white rounded-xl p-5">
                <p className="text-xs font-semibold text-[#C9A574] uppercase tracking-wider mb-2">
                  📬 Restez informé
                </p>
                <h4 className="text-base font-bold mb-2">
                  Recevez les actualités de l&apos;INP
                </h4>
                <p className="text-xs text-white/80 mb-3">
                  Les communiqués officiels et publications directement dans
                  votre boîte mail.
                </p>
                <Link
                  href="/#newsletter"
                  className="inline-flex items-center gap-1 text-xs font-bold bg-white text-[#7B4F2A] hover:bg-[#F8F1E0] px-3 py-1.5 rounded-full transition-colors"
                >
                  S&apos;inscrire
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="bg-white border border-[#E5DCC2] rounded-xl p-5">
                <p className="text-xs font-semibold text-[#C9A574] uppercase tracking-wider mb-3">
                  💬 Une question ?
                </p>
                <p className="text-sm text-[#2A1F18] mb-3 leading-relaxed">
                  Contactez les services de l&apos;INP par WhatsApp ou par
                  email.
                </p>
                <div className="space-y-2">
                  <a
                    href="https://wa.me/221338326565?text=Bonjour%2C%20je%20vous%20contacte%20depuis%20le%20site%20de%20l%27INP."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold px-3 py-2 rounded-full transition-colors w-full"
                  >
                    💬 WhatsApp INP
                  </a>
                  <a
                    href="mailto:inppedologie@gmail.com"
                    className="flex items-center justify-center gap-2 bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white text-sm font-semibold px-3 py-2 rounded-full transition-colors w-full"
                  >
                    📧 Envoyer un email
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Section « Continuez votre lecture » */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t-2 border-[#E5DCC2]">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-[#C9A574] tracking-wider uppercase mb-2">
                Continuez votre lecture
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2A1F18]">
                Autres actualités de l&apos;INP
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.slice(0, 3).map((r) => (
                <Link
                  key={r.slug}
                  href={`/actualites/${r.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-[#E5DCC2] overflow-hidden hover:shadow-md hover:border-[#C9A574] transition-all"
                >
                  {r.coverImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={r.coverImage}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={r.coverImage.startsWith("http")}
                      />
                      {r.badge && (
                        <div className="absolute top-3 left-3">
                          <Badge badge={r.badge} />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs font-semibold text-[#C9A574] uppercase tracking-wider mb-2">
                      {r.category} • {r.dateLabel}
                    </p>
                    <h4 className="text-base font-bold text-[#2A1F18] leading-tight mb-2 line-clamp-2 group-hover:text-[#7B4F2A] transition-colors">
                      {r.title}
                    </h4>
                    {r.excerpt && (
                      <p className="text-sm text-[#5A4733] leading-relaxed line-clamp-2">
                        {r.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Voir toutes les actualités
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
