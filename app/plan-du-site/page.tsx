import Link from "next/link";

export const metadata = { title: "Plan du site — INP" };

const RUBRIQUES: { titre: string; liens: { href: string; label: string }[] }[] = [
  {
    titre: "L'Institut",
    liens: [
      { href: "/institut/presentation", label: "Présentation" },
      { href: "/institut/missions", label: "Missions" },
      { href: "/institut/organigramme", label: "Organisation" },
      { href: "/institut/axes-intervention", label: "Axes d'intervention" },
      { href: "/institut/mot-directeur", label: "Le mot du Directeur" },
      { href: "/institut/equipe", label: "Notre équipe" },
    ],
  },
  {
    titre: "Activités & Recherche",
    liens: [
      { href: "/activites", label: "Activités" },
      { href: "/recherche", label: "Recherche & Innovation" },
      { href: "/cartographie", label: "Cartographie des sols" },
      { href: "/partenaires", label: "Partenaires" },
    ],
  },
  {
    titre: "Ressources",
    liens: [
      { href: "/documentation", label: "Documentation" },
      { href: "/mediatheque", label: "Médiathèque" },
      { href: "/actualites", label: "Actualités" },
      { href: "/liens-utiles", label: "Liens utiles" },
    ],
  },
  {
    titre: "Services & Contact",
    liens: [
      { href: "/demande-analyse", label: "Demande d'analyse" },
      { href: "/candidature-spontanee", label: "Recrutement & candidatures" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Page() {
  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-8 font-medium">
          ← Retour à l&apos;accueil
        </Link>
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 border border-[#E5DCC2]">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2A1F18] mb-6">Plan du site</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {RUBRIQUES.map((r) => (
              <div key={r.titre}>
                <h2 className="text-lg font-bold text-[#7B4F2A] mb-3 pb-2 border-b border-[#C9A574]">{r.titre}</h2>
                <ul className="space-y-2 text-sm">
                  {r.liens.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[#5A4733] hover:text-[#7B4F2A]">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
