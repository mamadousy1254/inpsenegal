import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import TricolorUnderline from "@/components/TricolorUnderline";
import { ArticleSidebar } from "@/components/actualites/ArticleSidebar";
import type { NewsItem } from "@/components/actualites/actualites-data";

// Sidebar — métadonnées de l'article du DG + URL canonique de partage.
const SHARE_URL = "https://inp.sn/actualites/interview-dg-sante-des-sols";
const INFO = [
  { label: "Catégorie", value: "Interview · Direction générale" },
  { label: "Date", value: "8 décembre 2025" },
  { label: "Source", value: "Le Soleil — Assane Fall" },
];

/* ------------------------------------------------------------------ */
/*  Article du DG — page d'interview ÉDITORIALE (statique)            */
/*                                                                     */
/*  Composant serveur (aucun état client) : rendu 100 % statique,     */
/*  sans risque d'hydratation. Contenu rédigé par l'INP (format Q/R), */
/*  avec crédit + lien vers Le Soleil (pas de copie de l'article).    */
/* ------------------------------------------------------------------ */

// Couverture : portrait paysage (16:9) du DG, déjà présent sur le site,
// sans filigrane (≠ photo de presse APS/Le Soleil).
const COVER = "/images/direction/Dr-TINE.webp";
const COVER_CAPTION = "Dr Alfred Kouly Tine, Directeur général de l'INP.";
const SOURCE_URL =
  "https://lesoleil.sn/actualites/environnement/alfred-kouly-tine-sans-terre-fertile-et-saine-impossible-dobtenir-des-rendements-eleves-et-durables/";

const TITLE =
  "« Sans terre fertile et saine, impossible d'obtenir des rendements élevés et durables »";

const CHAPO =
  "À l'occasion de la Journée mondiale des sols, le Directeur général de l'Institut national de Pédologie (INP), Alfred Kouly Tine, livre un plaidoyer fort pour la protection de sols sénégalais déjà fragilisés par l'érosion, l'acidification, la salinisation et l'épuisement en matière organique. Au-delà du constat, il détaille les solutions concrètes que l'Institut déploie sur le terrain, à travers son programme prioritaire « Santé des sols ».";

const PULL_QUOTE =
  "Sans terre fertile et saine, il est impossible d'obtenir des rendements élevés et durables.";

type QA = {
  q: string;
  a: string[];
  pullQuote?: string;
  aAfter?: string[];
};

const INTERVIEW: QA[] = [
  {
    q: "Quel est aujourd'hui l'état de santé global des sols au Sénégal ?",
    a: [
      "Il est très fragile. Le pays présente une grande diversité de sols, mais ceux-ci connaissent des dégradations de natures très différentes. Nos travaux montrent une fertilité globalement faible, d'abord parce que les éléments nutritifs essentiels aux cultures y sont présents en quantité très réduite.",
    ],
  },
  {
    q: "Quelles sont les principales causes de cet appauvrissement ?",
    a: [
      "Elles se cumulent : les changements climatiques, une déforestation massive, des terres cultivées chaque année sans jachère ni repos, des pratiques agricoles inadaptées, une forte exportation de biomasse, le manque d'apports organiques, et une acidification souvent provoquée par un usage déséquilibré d'engrais chimiques. À cela s'ajoutent l'érosion et la salinisation.",
    ],
  },
  {
    q: "Quelles solutions l'INP préconise-t-il ?",
    a: [
      "Il faut d'abord distinguer les types de dégradation. Au Sénégal, les plus répandues sont l'érosion éolienne, l'érosion hydrique liée au ruissellement, et la salinisation — très présente dans les vallées ouvertes sur les domaines fluvio-marins (Sine-Saloum, Casamance, Niayes, delta du fleuve Sénégal) et jusqu'à Kédougou, où l'altération de roches riches en sodium est en cause.",
      "À chaque dégradation, sa parade. Contre l'érosion éolienne : planter des arbres adaptés à chaque zone pédoclimatique, réintroduire l'arbre dans les parcelles (agroforesterie), installer des brise-vents et pratiquer le paillage. Contre la salinisation : la lutte biologique — des espèces capables de rabattre la nappe salée et de favoriser l'infiltration — et des ouvrages comme les digues anti-sel, qui freinent l'avancée de l'eau de mer et retiennent les eaux de ruissellement.",
      "Au cœur du dispositif, le programme « Santé des sols », mené avec le ministère de l'Agriculture : le chaulage pour corriger l'acidité et libérer les éléments utiles aux plantes ; le phosphatage, car nos sols sont très pauvres en phosphore ; et les amendements organiques, indispensables à ces sols sableux trop poreux et à faible rétention d'eau. Ces méthodes doivent être combinées, ce qui plaide pour des engrais organo-minéraux capables de préserver durablement la santé des sols.",
    ],
  },
  {
    q: "À l'heure de la souveraineté alimentaire, quel est le niveau d'implication de l'INP ?",
    a: [
      "Il est total et déterminant. On ne peut pas atteindre la souveraineté alimentaire avec des sols pauvres et malades.",
    ],
    pullQuote: PULL_QUOTE,
    aAfter: [
      "L'INP a été le précurseur du programme « Santé des sols » : en restaurant la fertilité, on crée la seule base productive capable de soutenir une agriculture à la fois intensive et durable.",
    ],
  },
  {
    q: "Vous avez noué un partenariat avec la SOGAS pour produire du compost. Pouvez-vous nous en dire plus ?",
    a: [
      "C'est un partenariat exemplaire et gagnant-gagnant. Les déchets d'abattage de la SOGAS polluaient gravement la baie de Hann ; nous y avons vu l'occasion de transformer un problème en solution. La SOGAS a mis à disposition un terrain et des moyens, l'INP a apporté son expertise scientifique — analyses, formulation, suivi de maturation.",
      "Résultat : plus de 300 tonnes de compost de très haute qualité déjà produites et commercialisées, avec un processus qui tourne désormais en continu. Une source de pollution est devenue un amendement précieux pour les agriculteurs.",
    ],
  },
  {
    q: "Quels sont les projets phares de l'INP aujourd'hui ?",
    a: [
      "Ils s'organisent autour de quatre axes : mieux connaître et cartographier les sols ; restaurer concrètement la fertilité (programme « Santé des sols », chaulage, phosphatage, amendements organiques) ; mettre à l'échelle les technologies validées (compostage, agroforesterie, gestion intégrée de la fertilité) ; et former massivement producteurs, étudiants et techniciens, avec des parcelles de démonstration installées directement chez les paysans — c'est là que se voient les vrais résultats.",
    ],
  },
];

const A_RETENIR = [
  "Programme prioritaire « Santé des sols » : chaulage, phosphatage, amendements organiques",
  "Plus de 300 tonnes de compost produites avec la SOGAS (baie de Hann)",
  "4 axes : connaissance & cartographie · restauration de la fertilité · mise à l'échelle · formation",
];

const META =
  "8 décembre 2025 · Propos recueillis par Assane Fall — Le Soleil · ~5 min de lecture";

function PullQuote({ text }: { text: string }) {
  return (
    <figure className="relative my-12 overflow-hidden rounded-r-2xl border-l-[5px] border-[#7B4F2A] bg-[#7B4F2A]/[0.055] py-7 pl-9 pr-6 sm:pl-11">
      <span
        className="pointer-events-none absolute left-3 top-1 select-none text-[5rem] leading-none text-[#7B4F2A]/25 sm:left-4"
        style={{ fontFamily: "var(--font-serif)" }}
        aria-hidden
      >
        «
      </span>
      <blockquote
        className="text-[1.45rem] italic leading-snug text-[#7B4F2A] sm:text-[1.7rem]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {text}
      </blockquote>
      <figcaption className="mt-3 text-sm font-semibold not-italic text-[#7B4F2A]/80">
        Alfred Kouly Tine, Directeur général de l'INP
      </figcaption>
    </figure>
  );
}

export function InterviewDgArticle({ related }: { related: NewsItem[] }) {
  return (
    <article className="bg-[#FBF7EF]">
      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:py-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:items-start">
          {/* ════ Colonne principale : l'article ════ */}
          <div className="min-w-0">
            {/* ── En-tête éditorial ── */}
            <Link
              href="/actualites"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7B4F2A] transition-colors hover:text-[#4A2F1A]"
            >
              <ArrowLeft className="h-4 w-4" /> Retour aux actualités
            </Link>

            <div className="mt-6">
              <span className="inline-flex items-center rounded-full bg-[#7B4F2A] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                Interview · Direction générale
              </span>
            </div>

            <h1
              className="mt-5 text-[1.7rem] font-bold leading-[1.18] text-[#2A1F18] sm:text-[2.1rem] lg:text-[2.45rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {TITLE}
            </h1>

            {/* Soulignement tricolore avec étoile (composant partagé) */}
            <TricolorUnderline className="mt-5" width={120} height={4} starSize={15} />

            <p className="mt-5 text-sm text-[#6B5B4D]">{META}</p>

            {/* ── Image de couverture ── */}
            <figure className="mt-8">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
                <Image
                  src={COVER}
                  alt="Dr Alfred Kouly Tine, Directeur général de l'INP"
                  fill
                  priority
                  sizes="(max-width: 1100px) 100vw, 700px"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
                  aria-hidden
                />
              </div>
              <figcaption className="mt-3 text-center text-xs italic text-[#8A7A6B]">
                {COVER_CAPTION}
              </figcaption>
            </figure>

            {/* ── Corps (largeur de lecture ~680px) ── */}
            <div className="mt-12 max-w-[680px]">
              {/* Chapô — lettrine ocre + barre ocre à gauche */}
        <p
          className="border-l-[3px] border-[#7B4F2A] pl-5 text-[1.2rem] leading-[1.65] text-[#574a3d] first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-[#7B4F2A] sm:text-[1.28rem]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {CHAPO}
        </p>

        {/* Questions / Réponses */}
        <div className="mt-14 space-y-14">
          {INTERVIEW.map((item, i) => (
            <section key={i}>
              {/* En-tête de question : badge Qn ocre + filet */}
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-[#7B4F2A] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                  Q{i + 1}
                </span>
                <span className="h-px flex-1 bg-[#7B4F2A]/15" aria-hidden />
              </div>

              <h2
                className="text-[1.3rem] font-bold leading-snug text-[#2A1F18] sm:text-[1.45rem]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {item.q}
              </h2>

              <div className="mt-4 space-y-[1.15em] text-[1.075rem] leading-[1.85] text-[#43392F]">
                {item.a.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>

              {item.pullQuote && <PullQuote text={item.pullQuote} />}

              {item.aAfter && (
                <div className="mt-4 space-y-[1.15em] text-[1.075rem] leading-[1.85] text-[#43392F]">
                  {item.aAfter.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* À retenir */}
        <aside className="mt-16 rounded-2xl border border-[#7B4F2A]/20 bg-[#F8F1E0] p-6 sm:p-7">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#7B4F2A]">
            À retenir
          </h3>
          <ul className="mt-4 space-y-3">
            {A_RETENIR.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-[#43392F]"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#7B4F2A]/[0.12]">
                  <Check className="h-3 w-3 text-[#7B4F2A]" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </aside>

        {/* Source / crédit */}
        <div className="mt-10 rounded-2xl border border-[#7B4F2A]/15 bg-white p-6">
          <p className="text-sm leading-relaxed text-[#6B5B4D]">
            Entretien réalisé par Assane Fall — paru dans <em>Le Soleil</em>, 8
            décembre 2025.
          </p>
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#7B4F2A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5F3C20]"
          >
            Lire sur Le Soleil
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>

              {/* Pied d'article */}
              <div className="mt-10 border-t border-[#7B4F2A]/10 pt-8">
                <Link
                  href="/actualites"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7B4F2A] transition-colors hover:text-[#4A2F1A]"
                >
                  <ArrowLeft className="h-4 w-4" /> Retour aux actualités
                </Link>
              </div>
            </div>
          </div>

          {/* ════ Sidebar (sticky desktop · sous l'article en mobile) ════ */}
          <aside className="mt-12 lg:mt-1 lg:sticky lg:top-[90px]">
            <ArticleSidebar
              shareUrl={SHARE_URL}
              shareTitle={TITLE}
              info={INFO}
              related={related}
            />
          </aside>
        </div>
      </div>
    </article>
  );
}
