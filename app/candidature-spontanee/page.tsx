import Link from "next/link";
import {
  RECRUTEMENT_TYPE_COLORS,
  RECRUTEMENT_TYPE_LABELS,
} from "@/lib/constants/recrutement";
import { getPublishedRecrutements } from "@/lib/services/recrutement/get-published-recrutements";

export const metadata = {
  title: "Recrutements & candidatures — Institut national de Pédologie",
  description:
    "Découvrez les opportunités de recrutement et de stage à l'Institut national de Pédologie du Sénégal, et déposez votre candidature spontanée.",
};

export const dynamic = "force-dynamic";

export default async function CandidatureSpontaneePage() {
  const recrutements = await getPublishedRecrutements();

  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-8 font-medium"
        >
          ← Retour à l&apos;accueil
        </Link>

        <header className="text-center mb-12">
          <p className="text-sm font-semibold text-[#C9A574] tracking-wider uppercase mb-3">
            Travailler à l&apos;INP
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[#2A1F18] mb-4">
            Recrutements &amp; candidatures
          </h1>
          <p className="text-base md:text-lg text-[#5A4733] max-w-2xl mx-auto leading-relaxed">
            Rejoignez l&apos;Institut national de Pédologie et participez à la mission
            scientifique au service de l&apos;agriculture et des sols du Sénégal.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-5 text-center">
            <div className="text-3xl font-bold text-[#7B4F2A] mb-1">40+</div>
            <p className="text-sm text-[#5A4733] leading-snug">
              Années d&apos;expertise pédologique au service du Sénégal
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-5 text-center">
            <div className="text-3xl font-bold text-[#7B4F2A] mb-1">8</div>
            <p className="text-sm text-[#5A4733] leading-snug">
              Délégations couvrant l&apos;ensemble du territoire national
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-5 text-center">
            <div className="text-3xl font-bold text-[#7B4F2A] mb-1">17+</div>
            <p className="text-sm text-[#5A4733] leading-snug">
              Partenaires institutionnels, techniques et internationaux
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8 pb-4 border-b-2 border-[#C9A574]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#7B4F2A] mb-2">
              Opportunités actuelles
            </h2>
            <p className="text-[#5A4733] text-sm md:text-base">
              Consultez les recrutements, appels à candidatures et offres de stage actuellement ouverts à l&apos;INP.
            </p>
          </div>

          {recrutements.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-8 text-center">
              <p className="text-[#5A4733]">
                Aucune offre n&apos;est actuellement publiée. Consultez régulièrement cette page
                ou envoyez votre candidature spontanée ci-dessous.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recrutements.map((r) => {
                const typeColors = RECRUTEMENT_TYPE_COLORS[r.type];

                return (
                  <article
                    key={r.slug}
                    className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div
                      className="h-2 w-full"
                      style={{ backgroundColor: typeColors.bg }}
                      aria-hidden="true"
                    />

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full tracking-wide"
                          style={{
                            backgroundColor: typeColors.bg,
                            color: typeColors.text,
                          }}
                        >
                          {RECRUTEMENT_TYPE_LABELS[r.type].toUpperCase()}
                        </span>
                        <span className="text-xs text-[#8B7355] font-mono">
                          {r.references}
                        </span>
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-[#2A1F18] mb-3 leading-tight">
                        {r.title}
                      </h3>

                      <p className="text-sm text-[#5A4733] leading-relaxed mb-4 flex-1">
                        {r.shortDescription}
                      </p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-start gap-2 text-[#5A4733]">
                          <span className="text-[#C9A574] flex-shrink-0 mt-0.5">📍</span>
                          <span>{r.location}</span>
                        </div>
                        <div className="flex items-start gap-2 text-[#5A4733]">
                          <span className="text-[#C9A574] flex-shrink-0 mt-0.5">📋</span>
                          <span>{r.contractType}</span>
                        </div>
                      </div>

                      {r.deadline && (
                        <div className="bg-[#FBF3E2] border border-[#C9A574] rounded px-3 py-2 mb-4 text-sm">
                          <span className="text-[#7B4F2A] font-semibold">Date limite :</span>{" "}
                          <span className="text-[#2A1F18] font-bold">{r.deadline}</span>
                        </div>
                      )}

                      <Link
                        href={`/candidature-spontanee/postuler/${r.slug}`}
                        className="inline-flex items-center justify-center gap-2 bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
                      >
                        Postuler en ligne
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] overflow-hidden mb-12">
          <div className="h-2 w-full bg-[#5A6F47]" />
          <div className="p-6 md:p-10">
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#5A6F47] tracking-wider uppercase mb-2">
                Pas d&apos;offre qui correspond à votre profil ?
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2A1F18] mb-3">
                Envoyez-nous votre candidature spontanée
              </h2>
              <p className="text-[#5A4733] leading-relaxed">
                L&apos;INP examine toutes les candidatures spontanées et constitue une base de
                profils pour les recrutements futurs. Si votre profil correspond à nos
                besoins, vous serez contacté(e) par les services RH.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-[#7B4F2A] mb-3 pb-2 border-b border-[#C9A574]">
                  Profils recherchés
                </h3>
                <ul className="space-y-2 text-sm text-[#2A1F18]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Ingénieurs agronomes et pédologues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Techniciens de laboratoire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Cartographes SIG / géomaticiens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Chercheurs en sciences du sol</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Personnel administratif et logistique</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#7B4F2A] mb-3 pb-2 border-b border-[#C9A574]">
                  Pièces du dossier
                </h3>
                <ul className="space-y-2 text-sm text-[#2A1F18]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Curriculum vitae détaillé (PDF)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Lettre de motivation (PDF)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Copies des diplômes et attestations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Extrait d&apos;acte de naissance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C9A574] mt-1">▪</span>
                    <span>Certificat de nationalité</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[#F8F1E0] rounded-lg p-6 border border-[#E5DCC2]">
              <h3 className="text-lg font-bold text-[#2A1F18] mb-4">
                Comment adresser votre dossier
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg p-5 border border-[#C9A574]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📝</span>
                    <h4 className="font-bold text-[#7B4F2A]">Par formulaire en ligne</h4>
                  </div>
                  <p className="text-sm text-[#5A4733] mb-3">
                    Remplissez le formulaire de candidature en ligne et joignez directement
                    vos pièces (CV et lettre de motivation au format PDF). Un numéro de
                    référence vous sera attribué à la soumission.
                  </p>

                  <Link
                    href="/candidature-spontanee/postuler/spontanee"
                    className="inline-flex items-center justify-center gap-2 bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors mt-4 w-full"
                  >
                    Remplir le formulaire en ligne
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="bg-white rounded-lg p-5 border border-[#E5DCC2]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📬</span>
                    <h4 className="font-bold text-[#7B4F2A]">Par courrier postal</h4>
                  </div>
                  <p className="text-sm text-[#5A4733] mb-3">
                    Adressez votre dossier complet sous pli fermé à :
                  </p>
                  <address className="not-italic text-sm text-[#2A1F18] leading-relaxed">
                    Monsieur le Directeur Général<br />
                    <strong>Institut national de Pédologie</strong><br />
                    Direction des Ressources Humaines<br />
                    Dakar, Sénégal
                  </address>
                  <p className="text-xs text-[#5A4733] italic mt-3">
                    Mention : « Candidature spontanée — [votre profil] »
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#5A4733] italic">
                ℹ️ Toutes les candidatures sont accusées de réception sous 7 jours ouvrés.
                Les dossiers retenus font l&apos;objet d&apos;un entretien avec la Direction des
                Ressources Humaines.
              </div>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-6 py-3 rounded-full font-medium transition-colors mr-3"
          >
            Nous contacter
          </Link>
          <Link
            href="/"
            className="inline-block bg-white hover:bg-[#F8F1E0] text-[#7B4F2A] border-2 border-[#7B4F2A] px-6 py-3 rounded-full font-medium transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
