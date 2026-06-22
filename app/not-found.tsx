import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F1E0]">
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-lg border border-[#E5DCC2] bg-white p-8 shadow-sm md:p-12">
          <h1 className="mb-4 text-4xl font-bold text-[#7B4F2A] md:text-5xl">
            Page introuvable
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-[#2A1F18]">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-block rounded-full bg-[#7B4F2A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4A2F1A]"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/actualites"
              className="inline-block rounded-full border-2 border-[#7B4F2A] bg-white px-6 py-3 font-medium text-[#7B4F2A] transition-colors hover:bg-[#F8F1E0]"
            >
              Voir les actualités
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
