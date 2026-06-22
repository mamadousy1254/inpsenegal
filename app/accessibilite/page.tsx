import Link from "next/link";

export const metadata = { title: "Accessibilité — INP" };

export default function Page() {
  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-8 font-medium">
          ← Retour à l&apos;accueil
        </Link>
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 border border-[#E5DCC2]">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2A1F18] mb-4">Accessibilité</h1>
          <p className="text-[#5A4733] leading-relaxed mb-4">
            L&apos;Institut national de Pédologie s&apos;engage à rendre son site web accessible
            conformément aux standards internationaux (WCAG 2.1) et à la réglementation
            sénégalaise sur l&apos;accessibilité numérique.
          </p>
          <p className="text-[#5A4733] leading-relaxed">
            Cette page détaillera prochainement notre déclaration d&apos;accessibilité,
            le niveau de conformité atteint et nos engagements pour l&apos;amélioration continue.
          </p>
        </div>
      </div>
    </main>
  );
}
