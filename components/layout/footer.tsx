"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_OFFICIEL = "221338326565"; // numéro officiel INP (standard +221 33 832 65 65)
const WHATSAPP_CANAL = "https://whatsapp.com/channel/221338326565"; // TODO: remplacer par le vrai canal WhatsApp INP


export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Veuillez saisir votre adresse e-mail.");
      return;
    }

    setSubmitting(true);
    try {
      const form = e.currentTarget;
      const website = (form.elements.namedItem("website") as HTMLInputElement)?.value ?? "";

      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "footer", website }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Inscription impossible");
      }

      toast.success(data.message ?? "Inscription enregistrée !");
      setEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Inscription impossible");
    } finally {
      setSubmitting(false);
    }
  }

  return pathname.includes("/dashboard") || pathname.includes("/login") ? null : (
    <footer className="bg-white border-t border-[#E5DCC2]" role="contentinfo">
      {/* ─────────────────────────────────────────── */}
      {/* BANDE DRAPEAU SÉNÉGAL                       */}
      {/* ─────────────────────────────────────────── */}
      <div className="relative h-2">
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-[#00853F]" />
          <div className="flex-1 bg-[#FDEF42] relative">
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00853F] text-sm"
              aria-hidden="true"
            >
              ★
            </span>
          </div>
          <div className="flex-1 bg-[#E31B23]" />
        </div>
      </div>

      {/* ÉTAGE 1 — CONTACT RAPIDE WHATSAPP */}
      <div className="bg-gradient-to-r from-[#7B4F2A] to-[#4A2F1A] text-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold text-[#C9A574] tracking-wider uppercase mb-1">
                Contact rapide
              </p>
              <h3 className="text-xl font-bold">Restez en contact</h3>
              <p className="text-sm text-white/80 mt-1">
                L&apos;INP à votre écoute, en ligne ou en personne.
              </p>
            </div>

            <a
              href={WHATSAPP_CANAL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1DA851] text-white p-4 rounded-xl transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L0 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.523 5.263l-.999 3.648 3.965-.61zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-white/90 leading-tight">Rejoindre le canal</p>
                <p className="font-bold">WhatsApp Officiel</p>
              </div>
            </a>

            <a
              href={`tel:+${WHATSAPP_OFFICIEL}`}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white p-4 rounded-xl transition-colors flex items-center gap-3 border border-white/20"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-white/90 leading-tight">Standard téléphonique</p>
                <p className="font-bold">+221 33 832 65 65</p>
              </div>
            </a>

            <a
              href="mailto:inppedologie@gmail.com"
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white p-4 rounded-xl transition-colors flex items-center gap-3 border border-white/20"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-white/90 leading-tight">Email général</p>
                <p className="font-bold">inppedologie@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ÉTAGE 2 — FOOTER PRINCIPAL 5 COLONNES */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* COLONNE 1 — Logo + description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src="/icon.png"
                  width={52}
                  height={52}
                  alt="Logo INP"
                  className="w-12 h-12 rounded-lg border border-[#E5DCC2]"
                />
                <div>
                  <p className="text-base font-bold text-[#7B4F2A] leading-tight">INP</p>
                  <p className="text-xs text-[#5A4733] uppercase tracking-wider leading-tight">
                    Institut national<br />de Pédologie
                  </p>
                </div>
              </div>
            </Link>

            <p className="text-sm text-[#5A4733] leading-relaxed mb-4">
              Institut parapublic à caractère scientifique et technologique dédié
              à la science des sols du Sénégal.
            </p>

            {/* Drapeau Sénégal officiel */}
            <div className="inline-flex items-center gap-2 bg-[#F8F1E0] border border-[#E5DCC2] rounded-full px-3 py-1.5 mb-4">
              <div className="flex w-5 h-3.5 rounded-sm overflow-hidden border border-[#E5DCC2]">
                <span className="flex-1 bg-[#00853F]" />
                <span className="flex-1 bg-[#FDEF42] relative">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00853F] text-[6px]" aria-hidden="true">★</span>
                </span>
                <span className="flex-1 bg-[#E31B23]" />
              </div>
              <span className="text-xs font-semibold text-[#5A4733]">Institution officielle</span>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-2">
              <a href="https://web.facebook.com/gestiondessols/" target="_blank" rel="noopener noreferrer" aria-label="Facebook INP" className="w-9 h-9 rounded-full bg-[#F8F1E0] hover:bg-[#7B4F2A] hover:text-white text-[#7B4F2A] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://x.com/INP_Senegal" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter) INP" className="w-9 h-9 rounded-full bg-[#F8F1E0] hover:bg-[#7B4F2A] hover:text-white text-[#7B4F2A] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.youtube.com/@inpsenegal7401/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube INP" className="w-9 h-9 rounded-full bg-[#F8F1E0] hover:bg-[#7B4F2A] hover:text-white text-[#7B4F2A] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://instagram.com/inp_senegal" target="_blank" rel="noopener noreferrer" aria-label="Instagram INP" className="w-9 h-9 rounded-full bg-[#F8F1E0] hover:bg-[#7B4F2A] hover:text-white text-[#7B4F2A] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* COLONNE 2 — L'INSTITUT */}
          <div>
            <h4 className="font-bold text-[#7B4F2A] tracking-wider uppercase text-xs mb-4">
              L&apos;Institut
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/institut/mot-directeur" className="text-[#5A4733] hover:text-[#7B4F2A]">Le mot du Directeur</Link></li>
              <li><Link href="/institut/presentation" className="text-[#5A4733] hover:text-[#7B4F2A]">Présentation</Link></li>
              <li><Link href="/institut/missions" className="text-[#5A4733] hover:text-[#7B4F2A]">Missions</Link></li>
              <li><Link href="/institut/organigramme" className="text-[#5A4733] hover:text-[#7B4F2A]">Organisation</Link></li>
              <li><Link href="/institut/cadre-juridique" className="text-[#5A4733] hover:text-[#7B4F2A]">Cadre juridique</Link></li>
              <li><Link href="/institut/axes-intervention" className="text-[#5A4733] hover:text-[#7B4F2A]">Axes d&apos;intervention</Link></li>
              <li>
                <Link href="/institut/equipe" className="text-[#5A4733] hover:text-[#7B4F2A] font-semibold inline-flex items-center gap-1">
                  Notre équipe
                  <span className="text-[10px] bg-[#C9A574] text-white px-1.5 py-0.5 rounded-full">NEW</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLONNE 3 — ACTIVITÉS & RECHERCHE */}
          <div>
            <h4 className="font-bold text-[#7B4F2A] tracking-wider uppercase text-xs mb-4">
              Activités &amp; Recherche
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/activites" className="text-[#5A4733] hover:text-[#7B4F2A]">Activités</Link></li>
              <li><Link href="/recherche" className="text-[#5A4733] hover:text-[#7B4F2A]">Recherche &amp; Innovation</Link></li>
              <li><Link href="/cartographie" className="text-[#5A4733] hover:text-[#7B4F2A]">Cartographie des sols</Link></li>
              <li><Link href="/activites/appui-aux-politiques-agricoles" className="text-[#5A4733] hover:text-[#7B4F2A]">Appui aux politiques agricoles</Link></li>
              <li><Link href="/partenaires" className="text-[#5A4733] hover:text-[#7B4F2A]">Partenaires</Link></li>
            </ul>
          </div>

          {/* COLONNE 4 — RESSOURCES */}
          <div>
            <h4 className="font-bold text-[#7B4F2A] tracking-wider uppercase text-xs mb-4">
              Ressources
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/documentation" className="text-[#5A4733] hover:text-[#7B4F2A]">Documentation</Link></li>
              <li><Link href="/documentation/guides-techniques" className="text-[#5A4733] hover:text-[#7B4F2A]">Guides techniques</Link></li>
              <li><Link href="/documentation/bulletins-scientifiques" className="text-[#5A4733] hover:text-[#7B4F2A]">Bulletins scientifiques</Link></li>
              <li><Link href="/documentation/open-data" className="text-[#5A4733] hover:text-[#7B4F2A]">Open Data</Link></li>
              <li><Link href="/mediatheque" className="text-[#5A4733] hover:text-[#7B4F2A]">Médiathèque</Link></li>
              <li><Link href="/actualites" className="text-[#5A4733] hover:text-[#7B4F2A]">Actualités</Link></li>
            </ul>
          </div>

          {/* COLONNE 5 — CONTACT + HORAIRES */}
          <div>
            <h4 className="font-bold text-[#7B4F2A] tracking-wider uppercase text-xs mb-4">
              Nous trouver
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#C9A574] mt-0.5 flex-shrink-0">📍</span>
                <span className="text-[#5A4733]">BP 10709 Hann Maristes,<br />Dakar, Sénégal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C9A574] mt-0.5 flex-shrink-0">🕐</span>
                <div className="text-[#5A4733]">
                  <p className="font-semibold text-[#2A1F18] mb-1">Heures d&apos;ouverture</p>
                  <p>Lun. – Ven. : 8h – 17h</p>
                  <p>Sam. : 8h – 13h</p>
                  <p className="text-[#8B7355] italic text-xs">Fermé dim. et jours fériés</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ÉTAGE 3 — DÉMARCHES EN LIGNE */}
      <div className="bg-[#F8F1E0] border-y border-[#E5DCC2]">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <p className="text-xs font-bold text-[#7B4F2A] tracking-wider uppercase text-center mb-3">
            🚀 Démarches en ligne
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Link href="/demande-analyse" className="bg-white hover:bg-[#7B4F2A] hover:text-white text-[#5A4733] text-sm font-semibold px-4 py-2 rounded-full text-center transition-colors border border-[#E5DCC2]">
              🧪 Demande d&apos;analyse
            </Link>
            <Link href="/candidature-spontanee" className="bg-white hover:bg-[#7B4F2A] hover:text-white text-[#5A4733] text-sm font-semibold px-4 py-2 rounded-full text-center transition-colors border border-[#E5DCC2]">
              💼 Recrutement
            </Link>
            <Link href="/contact" className="bg-white hover:bg-[#7B4F2A] hover:text-white text-[#5A4733] text-sm font-semibold px-4 py-2 rounded-full text-center transition-colors border border-[#E5DCC2]">
              📅 Rendez-vous
            </Link>
            <Link href="/documentation/open-data" className="bg-white hover:bg-[#7B4F2A] hover:text-white text-[#5A4733] text-sm font-semibold px-4 py-2 rounded-full text-center transition-colors border border-[#E5DCC2]">
              📊 Open Data
            </Link>
          </div>
        </div>
      </div>

      {/* ÉTAGE 4 — NEWSLETTER */}
      <div id="newsletter" className="bg-white border-b border-[#E5DCC2]">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <p className="font-bold text-[#2A1F18]">📬 Restez informé</p>
              <p className="text-sm text-[#5A4733]">Recevez les actualités et publications de l&apos;INP.</p>
            </div>
            <form
              className="md:col-span-2 flex flex-col sm:flex-row gap-2"
              onSubmit={handleNewsletterSubmit}
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.sn"
                disabled={submitting}
                required
                className="flex-1 px-4 py-2.5 border border-[#E5DCC2] rounded-full focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20 text-sm disabled:opacity-60"
                aria-label="Votre adresse email"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#7B4F2A] hover:bg-[#4A2F1A] disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Envoi…
                  </>
                ) : (
                  "S'inscrire ↗"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ÉTAGE 5 — MENTIONS LÉGALES */}
      <div className="bg-[#2A1F18] text-white/80">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
            <p>© 2026 INP — Institut national de Pédologie. Tous droits réservés.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
              <span className="text-white/30">•</span>
              <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
              <span className="text-white/30">•</span>
              <Link href="/accessibilite" className="hover:text-white">Accessibilité</Link>
              <span className="text-white/30">•</span>
              <Link href="/faq" className="hover:text-white">FAQ</Link>
              <span className="text-white/30">•</span>
              <Link href="/plan-du-site" className="hover:text-white">Plan du site</Link>
            </div>
          </div>
          <p className="text-center text-xs text-white/50 italic mt-3">
            Institution officielle de la République du Sénégal — Science des sols
          </p>
        </div>
      </div>

      {/* Bande drapeau de fermeture */}
      <div className="h-1 flex">
        <div className="flex-1 bg-[#00853F]" />
        <div className="flex-1 bg-[#FDEF42]" />
        <div className="flex-1 bg-[#E31B23]" />
      </div>
    </footer>
  );
}
