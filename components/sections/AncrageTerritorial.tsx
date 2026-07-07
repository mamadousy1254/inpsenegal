import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Ancrage territorial — accueil                                      */
/*                                                                     */
/*  Section « Nos délégations pédoclimatiques » : carte pédologique à  */
/*  gauche, grille des 8 délégations à droite. Les barres de couleur   */
/*  reprennent la LÉGENDE de la carte (couleurs de données : les       */
/*  verts Niayes / Sédhiou / Ziguinchor sont légitimes — ne pas les    */
/*  convertir en ocre). Seuls sur-titre, liens et bouton suivent la    */
/*  charte ocre/brun/sable.                                            */
/* ------------------------------------------------------------------ */

const ORGANIGRAMME_HREF = "/institut/organigramme";

// Couleurs = légende de la carte pédologique (cf. OrganigrammeAncrage).
// Slugs = pages /institut/delegations/[slug] (cf. lib/demoDelegations.ts).
const DELEGATIONS: {
  name: string;
  city: string;
  color: string;
  slug: string;
}[] = [
  { name: "Niayes", city: "Thiès", color: "#7A8B2E", slug: "niayes" },
  { name: "Sylvo Pastorale", city: "Louga", color: "#E5E5E5", slug: "sylvo-pastorale" },
  { name: "Fleuve", city: "Saint-Louis", color: "#1E5FD8", slug: "fleuve" },
  { name: "Bassin Arachidier", city: "Kaolack", color: "#D49A5A", slug: "bassin-arachidier" },
  { name: "Tamba", city: "Tambacounda", color: "#E76F6F", slug: "tamba" },
  { name: "Kédougou", city: "Kédougou", color: "#F4EA6A", slug: "kedougou" },
  { name: "Sédhiou", city: "Sédhiou", color: "#63D1C1", slug: "sedhiou" },
  { name: "Ziguinchor", city: "Ziguinchor", color: "#39FF14", slug: "ziguinchor" },
];

export function AncrageTerritorial() {
  return (
    <section
      className="py-20 px-4 sm:py-24 bg-white"
      aria-labelledby="ancrage-territorial-title"
    >
      <div className="container mx-auto max-w-6xl">
        {/* En-tête */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-inp-marron mb-2">
            Ancrage territorial
          </p>
          <h2
            id="ancrage-territorial-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Nos délégations pédoclimatiques
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            La Direction Centrale de l&apos;INP est basée à Dakar, avec 8
            délégations pédoclimatiques couvrant l&apos;ensemble du territoire
            national. Chaque délégation est spécialisée selon les enjeux
            pédologiques de sa zone.
          </p>
        </div>

        {/* Bloc 2 colonnes */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Carte pédologique */}
          <div className="flex flex-col rounded-2xl border border-[#EADFC9] bg-[#F8F1E0] p-4 sm:p-6">
            <div className="relative flex-1 overflow-hidden rounded-xl bg-white p-3">
              <Image
                src="/images/institut/carte-senegal.png"
                alt="Carte des 8 délégations pédoclimatiques de l'INP au Sénégal (Niayes, Sylvo Pastorale, Fleuve, Bassin Arachidier, Tamba, Kédougou, Sédhiou, Ziguinchor)"
                width={1200}
                height={800}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
            <div className="mt-4 text-center">
              <Link
                href={ORGANIGRAMME_HREF}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7B4F2A] transition-colors hover:text-[#4A2F1A]"
              >
                Voir l&apos;organigramme complet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Grille des 8 délégations */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DELEGATIONS.map((d) => (
              <Link
                key={d.slug}
                href={`/institut/delegations/${d.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-[#EADFC9] bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A574] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4F2A] focus-visible:ring-offset-2"
              >
                {/* Barre de couleur = légende de la carte (donnée, pas charte) */}
                <span
                  className="h-10 w-1.5 flex-shrink-0 rounded-full ring-1 ring-black/5"
                  style={{ backgroundColor: d.color }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold text-foreground">
                    {d.name}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {d.city}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 flex-shrink-0 text-[#C9A574] transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href={ORGANIGRAMME_HREF}
            className="inline-flex items-center gap-2 rounded-full bg-[#7B4F2A] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#5F3C20] hover:shadow-lg"
          >
            Découvrir l&apos;organigramme complet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
