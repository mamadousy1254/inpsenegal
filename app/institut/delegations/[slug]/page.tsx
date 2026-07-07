import Link from "next/link";
import type { Metadata } from "next";
import { demoDelegations, getDelegationBySlug } from "@/lib/demoDelegations";
import { DelegationsSidePanel } from "@/components/institut/DelegationsSidePanel";
import {
  getPublishedInstitutDelegationBySlug,
  getPublishedInstitutDelegationSlugs,
} from "@/lib/services/institut/get-published-institut";
import type { PublicInstitutDelegation } from "@/lib/services/institut/serialize-institut-delegation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function resolveDelegation(slug: string): Promise<PublicInstitutDelegation | null> {
  try {
    const fromDb = await getPublishedInstitutDelegationBySlug(slug);
    if (fromDb) return fromDb;
  } catch {
    /* repli sur les données de démo */
  }

  const demo = getDelegationBySlug(slug);
  if (!demo) return null;

  return {
    slug: demo.slug,
    name: demo.name,
    shortName: demo.shortName,
    organigrammeLabel: `Délégation ${demo.shortName}`,
    color: demo.color,
    chefLieu: demo.chefLieu,
    regionsCouvertes: demo.regionsCouvertes,
    superficie: demo.superficie,
    population: demo.population,
    typesDeSols: demo.typesDeSols,
    cultureDominantes: demo.cultureDominantes,
    enjeuxPedologiques: demo.enjeuxPedologiques,
    missionsSpecifiques: demo.missionsSpecifiques,
    delegueNom: demo.delegueNom,
    delegueFonction: demo.delegueFonction,
    contact: demo.contact,
    description: demo.description,
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedInstitutDelegationSlugs();
    if (slugs.length > 0) return slugs.map((slug) => ({ slug }));
  } catch {
    /* repli */
  }
  return demoDelegations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const delegation = await resolveDelegation(slug);
  if (!delegation) {
    return { title: "Délégation — Institut national de Pédologie" };
  }
  return {
    title: `${delegation.name} — INP`,
    description: delegation.description,
  };
}

export default async function DelegationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const delegation = await resolveDelegation(slug);

  // PAS de notFound() — afficher une page propre si slug inconnu
  if (!delegation) {
    return (
      <main className="min-h-[70vh] bg-[#F8F1E0]">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <Link
            href="/institut/organigramme"
            className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-8 font-medium"
          >
            ← Retour à l&apos;organigramme
          </Link>
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 border border-[#E5DCC2]">
            <h1 className="text-2xl md:text-3xl font-bold text-[#7B4F2A] mb-4">
              Délégation introuvable
            </h1>
            <p className="text-[#2A1F18] leading-relaxed mb-6">
              La délégation demandée n&apos;existe pas dans nos données actuelles.
              Consultez l&apos;organigramme pour retrouver l&apos;ensemble des délégations pédoclimatiques de l&apos;INP.
            </p>
            <Link
              href="/institut/organigramme"
              className="inline-block bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Voir toutes les délégations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Fil d'Ariane */}
        <Link
          href="/institut/organigramme"
          className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-6 font-medium"
        >
          ← Retour à l&apos;organigramme
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          {/* Colonne principale — contenu de la délégation */}
          <div className="min-w-0">
        {/* En-tête de la délégation */}
        <header className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] overflow-hidden mb-8">
          <div
            className="h-3 w-full"
            style={{ backgroundColor: delegation.color }}
            aria-hidden="true"
          />
          <div className="p-6 md:p-10">
            <p className="text-sm font-semibold text-[#C9A574] tracking-wider uppercase mb-2">
              Ancrage territorial — INP
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#2A1F18] mb-4">
              {delegation.name}
            </h1>
            <p className="text-lg md:text-xl text-[#5A4733] leading-relaxed italic">
              {delegation.description}
            </p>
          </div>
        </header>

        {/* Grille d'informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Informations générales */}
          <article className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-6">
            <h2 className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574]">
              📍 Informations générales
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-[#5A4733]">Chef-lieu</dt>
                <dd className="text-[#2A1F18]">{delegation.chefLieu}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5A4733]">Régions couvertes</dt>
                <dd className="text-[#2A1F18]">{delegation.regionsCouvertes.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5A4733]">Superficie</dt>
                <dd className="text-[#2A1F18]">{delegation.superficie}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5A4733]">Population</dt>
                <dd className="text-[#2A1F18]">{delegation.population}</dd>
              </div>
            </dl>
          </article>

          {/* Délégué et contact */}
          <article className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-6">
            <h2 className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574]">
              👤 Délégué et contact
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-[#5A4733]">Délégué</dt>
                <dd className="text-[#2A1F18] font-medium">{delegation.delegueNom}</dd>
                <dd className="text-[#5A4733] text-xs italic">{delegation.delegueFonction}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5A4733]">Adresse</dt>
                <dd className="text-[#2A1F18]">{delegation.contact.adresse}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5A4733]">Téléphone</dt>
                <dd>
                  <a href={`tel:${delegation.contact.telephone}`} className="text-[#7B4F2A] hover:underline">
                    {delegation.contact.telephone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#5A4733]">Email</dt>
                <dd>
                  <a href={`mailto:${delegation.contact.email}`} className="text-[#7B4F2A] hover:underline">
                    {delegation.contact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </article>

          {/* Types de sols */}
          <article className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-6">
            <h2 className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574]">
              🌱 Principaux types de sols
            </h2>
            <ul className="space-y-2 text-sm text-[#2A1F18]">
              {delegation.typesDeSols.map((sol, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#C9A574] mt-1">▪</span>
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Cultures dominantes */}
          <article className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-6">
            <h2 className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574]">
              🌾 Cultures dominantes
            </h2>
            <ul className="space-y-2 text-sm text-[#2A1F18]">
              {delegation.cultureDominantes.map((culture, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#C9A574] mt-1">▪</span>
                  <span>{culture}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Enjeux pédologiques (pleine largeur) */}
        <article className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-6 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574]">
            ⚠️ Enjeux pédologiques de la zone
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#2A1F18]">
            {delegation.enjeuxPedologiques.map((enjeu, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#C9A574] mt-1 flex-shrink-0">▪</span>
                <span>{enjeu}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Missions spécifiques (pleine largeur) */}
        <article className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-6 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574]">
            🎯 Missions spécifiques de la délégation
          </h2>
          <ul className="space-y-3 text-[#2A1F18]">
            {delegation.missionsSpecifiques.map((mission, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#5A6F47] mt-1 flex-shrink-0 font-bold">✓</span>
                <span>{mission}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Note disclaimer */}
        <div className="p-4 bg-[#FBF3E2] border-l-4 border-[#C9A574] rounded mb-8">
          <p className="text-sm text-[#7B4F2A]">
            <strong>Note :</strong> Contenu géré par les services de l&apos;INP. Pour toute
            question relative à cette délégation, utilisez les coordonnées ci-dessus.
          </p>
        </div>

        {/* Navigation entre délégations */}
        <div className="text-center">
          <Link
            href="/institut/organigramme"
            className="inline-block bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-6 py-3 rounded-full font-medium transition-colors mr-3"
          >
            ← Toutes les délégations
          </Link>
          <Link
            href="/contact"
            className="inline-block bg-white hover:bg-[#F8F1E0] text-[#7B4F2A] border-2 border-[#7B4F2A] px-6 py-3 rounded-full font-medium transition-colors"
          >
            Nous contacter
          </Link>
        </div>
          </div>

          {/* Colonne latérale — navigation entre délégations (sticky desktop) */}
          <aside className="lg:sticky lg:top-24">
            <DelegationsSidePanel currentSlug={delegation.slug} />
          </aside>
        </div>
      </div>
    </main>
  );
}
