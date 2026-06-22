import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import {
  FileText,
  Download,
  ScrollText,
  Building2,
  Landmark,
  Coins,
  MapPin,
  CheckCircle2,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cadre juridique & décret de création",
  description:
    "L'INP a été créé par le décret n° 2004-802 du 28 juin 2004. Statut d'EPST, missions officielles (Article 2), organes (Article 3) et téléchargement du décret de création.",
};

const PDF_URL = "/documents/decret-creation-inp-2004-802.pdf";

const FICHE = [
  {
    icon: ScrollText,
    label: "Texte fondateur",
    value: "Décret n° 2004-802 du 28 juin 2004",
  },
  {
    icon: Building2,
    label: "Statut",
    value:
      "Établissement public à caractère scientifique et technologique (EPST), en application de la loi n° 97-13 du 2 juillet 1997",
  },
  {
    icon: Landmark,
    label: "Tutelle technique",
    value: "Ministère chargé de l'Agriculture",
  },
  {
    icon: Coins,
    label: "Tutelle financière",
    value: "Ministère chargé des Finances",
  },
  {
    icon: MapPin,
    label: "Siège",
    value:
      "Dakar — démembrements au sein des Centres Polyvalents de Formation des Producteurs (CPFP)",
  },
];

const MISSIONS = [
  "Identification et maîtrise des caractéristiques des ressources en sols : cartographie pédologique, évaluation des aptitudes agricoles, forestières, pastorales, aquacoles et urbaines",
  "Sauvegarde du patrimoine foncier : paquets techniques de gestion durable des terroirs selon les caractéristiques pédoclimatiques",
  "Formation et sensibilisation des producteurs et opérateurs économiques sur le rôle de la science du sol",
  "Mise en œuvre de modules de formation à l'exploitation et à la gestion durable et rentable des activités rurales",
  "Coordination, réglementation et contrôle des travaux pédologiques sur le territoire national",
  "Établissement de normes en matière de sols et d'eaux pour l'agriculture",
  "Mise en œuvre de centres polyvalents de formation des producteurs, vitrines des techniques d'exploitation durable",
  "Dynamisation et développement de la coopération sous-régionale, régionale et internationale en agro-pédologie",
];

const ORGANES = [
  "Le Conseil d'administration",
  "Le Comité scientifique et technique",
  "La Direction générale et les services rattachés",
];

export default function CadreJuridiquePage() {
  return (
    <>
      <PageHero
        label="L'Institut"
        title="Cadre juridique & décret de création"
        subtitle="Le texte fondateur de l'INP : statut, missions et organisation définis par le décret n° 2004-802 du 28 juin 2004."
      />

      {/* Fil d'ariane */}
      <nav aria-label="Fil d'ariane" className="border-b border-[#E5DCC2] bg-[#F8F1E0]/60">
        <div className="container mx-auto max-w-4xl px-4 py-3">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[#5A4733]">
            <li>
              <Link href="/" className="hover:text-[#7B4F2A]">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#C9A574]">›</li>
            <li>
              <Link href="/institut/presentation" className="hover:text-[#7B4F2A]">
                L&apos;Institut
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#C9A574]">›</li>
            <li aria-current="page" className="font-semibold text-[#7B4F2A]">
              Cadre juridique
            </li>
          </ol>
        </div>
      </nav>

      <section className="py-16 px-4 sm:py-20">
        <div className="container mx-auto max-w-4xl space-y-14">
          {/* 1. Intro */}
          <div className="relative bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm">
            <div className="absolute left-0 top-0 h-full w-2 bg-[var(--inp-vert)] rounded-l-2xl" />
            <p className="text-lg leading-relaxed text-gray-700">
              L&apos;Institut national de pédologie (INP) a été créé par le{" "}
              <span className="font-semibold text-amber-900">
                décret n° 2004-802 du 28 juin 2004
              </span>{" "}
              portant création, organisation et fonctionnement de l&apos;Institut. Ce texte
              définit son statut, ses missions et son organisation.
            </p>

            {/* Bouton de téléchargement (bien visible) */}
            <a
              href={PDF_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#7B4F2A] hover:bg-[#4A2F1A] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
            >
              <FileText className="h-5 w-5" aria-hidden="true" />
              Télécharger le décret de création (PDF)
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* 2. Fiche d'identité */}
          <div>
            <SectionHeading icon={ScrollText} title="Fiche d'identité" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FICHE.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-xl border border-[#E5DCC2] bg-white p-5 shadow-sm"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-[#7B4F2A]">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8B7355] mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm text-[#2A1F18] leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Missions officielles (Article 2) */}
          <div>
            <SectionHeading
              icon={CheckCircle2}
              title="Missions officielles"
              subtitle="Article 2 du décret"
            />
            <ul className="space-y-3">
              {MISSIONS.map((m, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[#E5DCC2] bg-white p-4 shadow-sm"
                >
                  <CheckCircle2
                    className="h-5 w-5 flex-shrink-0 text-[var(--inp-vert)] mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-[#2A1F18] leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Organes de l'Institut (Article 3) */}
          <div>
            <SectionHeading
              icon={Users}
              title="Organes de l'Institut"
              subtitle="Article 3 du décret"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ORGANES.map((o, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#E5DCC2] bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm text-center"
                >
                  <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--inp-vert)] text-white font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-[#2A1F18] leading-snug">{o}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Rappel téléchargement */}
          <div className="rounded-2xl bg-[#F8F1E0] border border-[#E5DCC2] p-8 text-center">
            <h3 className="text-lg font-bold text-[#7B4F2A] mb-2">Document officiel</h3>
            <p className="text-sm text-[#5A4733] mb-5 max-w-xl mx-auto">
              Consultez l&apos;intégralité du texte fondateur de l&apos;INP — décret n° 2004-802
              du 28 juin 2004.
            </p>
            <a
              href={PDF_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#7B4F2A] hover:bg-[#4A2F1A] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
            >
              <FileText className="h-5 w-5" aria-hidden="true" />
              Télécharger le décret de création (PDF)
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sous-composant : titre de section avec souligné tricolore          */
/* ------------------------------------------------------------------ */

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#7B4F2A]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          {subtitle && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">
              {subtitle}
            </span>
          )}
          <h2 className="text-2xl font-bold leading-tight text-[#5E3D20]">{title}</h2>
        </div>
      </div>
      {/* Souligné tricolore (drapeau sénégalais) + étoile */}
      <span className="relative mt-4 block w-24">
        <span
          className="block h-[3px] w-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #00853F 0%, #00853F 33%, #FDEF42 33%, #FDEF42 66%, #E31B23 66%, #E31B23 100%)",
          }}
          aria-hidden="true"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <polygon
            fill="#00853F"
            points="50,10 61.8,38.2 92.2,38.2 67.2,57.3 79,85.5 50,67.5 21,85.5 32.8,57.3 7.8,38.2 38.2,38.2"
          />
        </svg>
      </span>
    </div>
  );
}
