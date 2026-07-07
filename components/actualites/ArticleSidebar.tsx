import Image from "next/image";
import Link from "next/link";
import { Share2, Facebook, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { formatDate, type NewsItem } from "./actualites-data";

/* ------------------------------------------------------------------ */
/*  Sidebar d'article — charte INP (ocre/brun, crème, bordures sable). */
/*  Réutilisée par les articles du back-office (ArticleDetailClient)   */
/*  ET par l'article statique du DG. Composant présentationnel :       */
/*  l'URL de partage est passée en prop (pas de dépendance à window).  */
/* ------------------------------------------------------------------ */

export interface SidebarInfoRow {
  label: string;
  value: string;
}

interface ArticleSidebarProps {
  /** URL absolue de l'article (pour les liens de partage). */
  shareUrl: string;
  shareTitle: string;
  info: SidebarInfoRow[];
  /** Dernières actualités (hors article courant) — pour rebondir. */
  related: NewsItem[];
}

function ShareButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Partager sur ${label}`}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7B4F2A] text-white shadow-sm transition-colors hover:bg-[#5F3C20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4F2A] focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4.02a7.94 7.94 0 0 0-6.88 11.9L4 20.02l4.2-1.1A7.94 7.94 0 1 0 17.6 6.32ZM12 18.6c-1.18 0-2.34-.32-3.35-.92l-.24-.14-2.49.65.66-2.43-.16-.25A6.6 6.6 0 1 1 12 18.6Zm3.62-4.94c-.2-.1-1.17-.58-1.35-.64s-.31-.1-.44.1-.5.63-.62.76-.23.15-.43.05a5.4 5.4 0 0 1-1.59-.98 6 6 0 0 1-1.1-1.37c-.12-.2-.01-.3.09-.4l.3-.35c.1-.12.13-.2.2-.34a.37.37 0 0 0-.02-.35c-.05-.1-.44-1.06-.6-1.45s-.32-.33-.44-.33h-.38a.73.73 0 0 0-.53.24 2.23 2.23 0 0 0-.69 1.66 3.88 3.88 0 0 0 .81 2.05 8.86 8.86 0 0 0 3.4 3c.48.2.85.33 1.14.43.48.15.91.13 1.26.08.38-.06 1.17-.48 1.33-.94s.17-.86.12-.94-.18-.13-.38-.23Z" />
    </svg>
  );
}

export function ArticleSidebar({
  shareUrl,
  shareTitle,
  info,
  related,
}: ArticleSidebarProps) {
  const u = encodeURIComponent(shareUrl);
  const t = encodeURIComponent(shareTitle);

  return (
    <div className="space-y-6">
      {/* ── Partager ── */}
      <div className="rounded-2xl border border-[#7B4F2A]/15 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#2A1F18]">
          <Share2 className="h-4 w-4 text-[#7B4F2A]" aria-hidden /> Partager
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <ShareButton
            href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
            label="Facebook"
          >
            <Facebook className="h-[18px] w-[18px]" aria-hidden />
          </ShareButton>
          <ShareButton
            href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}
            label="X (Twitter)"
          >
            <Twitter className="h-[18px] w-[18px]" aria-hidden />
          </ShareButton>
          <ShareButton
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
            label="LinkedIn"
          >
            <Linkedin className="h-[18px] w-[18px]" aria-hidden />
          </ShareButton>
          <ShareButton
            href={`https://wa.me/?text=${encodeURIComponent(`${shareTitle} — ${shareUrl}`)}`}
            label="WhatsApp"
          >
            <WhatsAppIcon />
          </ShareButton>
        </div>
      </div>

      {/* ── Informations ── */}
      <div className="rounded-2xl border border-[#7B4F2A]/15 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-[#2A1F18]">Informations</h3>
        <dl className="space-y-3 text-[13px]">
          {info.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-4 border-b border-[#7B4F2A]/[0.07] pb-3 last:border-0 last:pb-0"
            >
              <dt className="flex-shrink-0 text-[#8A7A6B]">{row.label}</dt>
              <dd className="text-right font-semibold text-[#7B4F2A]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Actualités similaires ── */}
      {related.length > 0 && (
        <div className="rounded-2xl border border-[#7B4F2A]/15 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#2A1F18]">
            <span className="h-4 w-1 rounded-full bg-[#7B4F2A]" aria-hidden />
            Actualités similaires
          </h3>
          <ul className="space-y-1">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/actualites/${r.slug}`}
                  className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#F8F1E0]"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg ring-1 ring-black/5">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#2A1F18] transition-colors group-hover:text-[#7B4F2A]">
                      {r.title}
                    </p>
                    <p className="mt-1 text-[11px] text-[#8A7A6B]">
                      {formatDate(r.publishedAt)}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 flex-shrink-0 self-center text-[#7B4F2A]/50 transition-colors group-hover:text-[#7B4F2A]"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
