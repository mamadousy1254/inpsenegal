import Link from "next/link";

export const metadata = { title: "Politique de confidentialité — INP" };

export default function Page() {
  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-8 font-medium">
          ← Retour à l&apos;accueil
        </Link>
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 border border-[#E5DCC2]">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2A1F18] mb-4">Politique de confidentialité</h1>
          <p className="text-[#5A4733] leading-relaxed mb-4">
            L&apos;Institut national de Pédologie attache une grande importance à la protection
            des données personnelles. Les informations collectées via ce site (formulaires de
            contact, candidatures, newsletter) sont traitées de manière confidentielle et
            utilisées uniquement aux fins pour lesquelles elles ont été recueillies.
          </p>
          <p className="text-[#5A4733] leading-relaxed">
            Le traitement des données est conforme à la législation sénégalaise sur la
            protection des données personnelles (loi n°2008-12). Cette page sera prochainement
            complétée par la déclaration détaillée de traitement et les modalités d&apos;exercice
            de vos droits.
          </p>
        </div>
      </div>
    </main>
  );
}
