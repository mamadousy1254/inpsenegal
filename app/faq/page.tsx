import Link from "next/link";

export const metadata = { title: "FAQ — INP" };

export default function Page() {
  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-8 font-medium">
          ← Retour à l&apos;accueil
        </Link>
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 border border-[#E5DCC2]">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2A1F18] mb-4">Foire aux questions</h1>
          <p className="text-[#5A4733] leading-relaxed">
            La foire aux questions de l&apos;Institut national de Pédologie est en cours
            d&apos;enrichissement par les services de l&apos;INP. Elle regroupera prochainement
            les réponses aux questions les plus fréquentes (demandes d&apos;analyse, recrutement,
            accès aux données pédologiques, partenariats).
          </p>
        </div>
      </div>
    </main>
  );
}
