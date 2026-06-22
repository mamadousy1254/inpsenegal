import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import ProjetsPosters from "@/components/recherche/ProjetsPosters";

export const metadata: Metadata = {
    title: "Projets Scientifiques | INP",
    description:
        "Les réalisations concrètes et localisées des programmes de l'INP : études de terrain dans des zones agroécologiques ciblées, produisant données, diagnostics et solutions pour des territoires précis.",
};

export default function ProjetsScientifiques() {
    return (
        <main className="min-h-screen bg-white">
            {/* 1️⃣ HERO INSTITUTIONNEL */}
            <PageHero
                label="INP — Institut national de Pédologie"
                title="Projets Scientifiques"
                subtitle="Les projets scientifiques sont les réalisations concrètes des programmes de l'INP : des études localisées, menées sur le terrain, qui produisent des données et des solutions pour des territoires précis."
            />

            {/* 2️⃣ CONTEXTE */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6 space-y-8">
                    <h2 className="text-3xl font-semibold text-amber-900">
                        Des réalisations ancrées dans les territoires
                    </h2>
                    <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c]" />
                    <p className="text-lg leading-relaxed text-gray-700">
                        Conduits dans des zones agroécologiques ciblées — vallée du fleuve Sénégal,
                        bassin arachidier, Sahel — ces projets traduisent les{" "}
                        <Link
                            href="/recherche/programmes-de-recherche"
                            className="font-semibold text-[#7B4F2A] underline underline-offset-2 hover:text-[#4A2F1A]"
                        >
                            programmes de recherche
                        </Link>{" "}
                        en résultats mesurables : cartes, diagnostics, recommandations et bases de
                        données exploitables par les décideurs et les producteurs.
                    </p>
                </div>
            </section>

            {/* 3️⃣ SECTION PROJETS AVEC IMAGES */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-semibold text-center mb-4">
                        Projets en cours et réalisés
                    </h2>
                    <div className="w-20 h-1 mx-auto rounded-full bg-white/30 mb-16" />

                    <ProjetsPosters />
                </div>
            </section>

            {/* 4️⃣ SECTION STATISTIQUES PROJETS */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-16">
                        Chiffres clés
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                +80
                            </p>
                            <p className="text-gray-600 mt-2">Projets réalisés</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                14
                            </p>
                            <p className="text-gray-600 mt-2">Régions couvertes</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                Depuis 2004
                            </p>
                            <p className="text-gray-600 mt-2">Au service des sols du Sénégal</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5️⃣ CTA */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-6">
                        Nous rejoindre ou collaborer
                    </h2>

                    <p className="text-lg opacity-90 mb-10">
                        L&apos;INP s&apos;engage au quotidien pour bâtir une recherche d&apos;excellence.
                        Contactez-nous pour toute proposition de collaboration ou projet scientifique.
                    </p>

                    <Link
                        href="/contact"
                        className="px-8 py-4 rounded-xl bg-white text-[#4A2F1A] font-semibold hover:bg-gray-100 transition shadow-lg inline-flex"
                    >
                        Nous contacter
                    </Link>
                </div>
            </section>
        </main>
    );
}
