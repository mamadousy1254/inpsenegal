import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
    title: "Programmes de Recherche | INP",
    description:
        "Les axes thématiques de long terme de l'INP : programmes structurant, dans la durée, la production de connaissances sur les sols du Sénégal, de la cartographie à l'innovation.",
};

const programmes = [
    {
        title: "Cartographie pédologique nationale",
        image: "/programmes/programme-cartographie-pedologique.png",
        alt: "Équipe de l'INP présentant la carte pédologique nationale du Sénégal",
    },
    {
        title: "Fertilité et nutrition des sols",
        image: "/programmes/programme-fertilite-nutrition.png",
        alt: "Agent de l'INP réalisant une analyse de fertilité et de nutrition des sols",
    },
    {
        title: "Dégradation et restauration des terres",
        image: "/programmes/programme-degradation-restauration.png",
        alt: "Agents de l'INP évaluant la dégradation et la restauration des terres",
    },
    {
        title: "Sols et changement climatique",
        image: "/programmes/programme-sols-changement-climatique.png",
        alt: "Suivi des sols face au changement climatique par l'INP",
    },
    {
        title: "Bases de données pédologiques nationales",
        image: "/programmes/programme-bases-donnees-pedologiques.png",
        alt: "Gestion des bases de données pédologiques nationales de l'INP",
    },
    {
        title: "Innovation en gestion durable des terres",
        image: "/programmes/programme-innovation-gestion-durable.png",
        alt: "Infographie de l'INP sur l'innovation en gestion durable des terres",
    },
];

export default function ProgrammesRecherche() {
    return (
        <main className="min-h-screen bg-white">
            {/* 1️⃣ HERO INSTITUTIONNEL */}
            <PageHero
                label="INP — Institut national de Pédologie"
                title="Programmes de Recherche"
                subtitle="Les programmes de recherche de l'INP structurent, sur le long terme, la production de connaissances sur les sols du Sénégal — de la cartographie à l'innovation."
            />

            {/* 2️⃣ CONTEXTE STRATÉGIQUE */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6 space-y-8">
                    <h2 className="text-3xl font-semibold text-amber-900">
                        Le rôle de nos programmes
                    </h2>
                    <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c]" />
                    <p className="text-lg leading-relaxed text-gray-700">
                        Un programme rassemble, autour d&apos;une grande thématique, plusieurs projets
                        et activités conduits dans la durée. Ces programmes fixent les priorités
                        scientifiques de l&apos;Institut et alimentent les politiques publiques
                        agricoles et environnementales. Chaque programme se concrétise ensuite par
                        des <strong>projets de terrain</strong>, présentés dans la rubrique{" "}
                        <Link
                            href="/recherche/projets-scientifiques"
                            className="font-semibold text-[#7B4F2A] underline underline-offset-2 hover:text-[#4A2F1A]"
                        >
                            Projets scientifiques
                        </Link>
                        .
                    </p>
                </div>
            </section>

            {/* 3️⃣ SECTION PROGRAMMES AVEC IMAGES */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-semibold text-center mb-4">
                        Nos principaux programmes
                    </h2>
                    <div className="w-20 h-1 mx-auto rounded-full bg-white/30 mb-16" />

                    <div className="grid md:grid-cols-3 gap-10">
                        {programmes.map((item, index) => (
                            <div
                                key={index}
                                className="relative group rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    width={600}
                                    height={400}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2F1A]/90 via-[#7B4F2A]/60 to-transparent" />

                                <div className="absolute bottom-0 p-6 z-10 text-left">
                                    <h3 className="text-xl font-semibold leading-snug text-white">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4️⃣ IMPACT SCIENTIFIQUE */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-16">
                        Impact scientifique
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                6
                            </p>
                            <p className="text-gray-600 mt-2">Programmes thématiques</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                +120
                            </p>
                            <p className="text-gray-600 mt-2">Publications scientifiques</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                Nationale
                            </p>
                            <p className="text-gray-600 mt-2">Couverture territoriale</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5️⃣ CTA */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-6">
                        Collaborer avec nos chercheurs
                    </h2>

                    <p className="text-lg opacity-90 mb-10">
                        L&apos;INP est ouvert aux partenariats scientifiques nationaux et internationaux
                        pour faire avancer la recherche en sciences du sol.
                    </p>

                    <Link
                        href="/contact"
                        className="px-8 py-4 rounded-xl bg-white text-[#4A2F1A] font-semibold hover:bg-gray-100 transition shadow-lg inline-flex"
                    >
                        Proposer un partenariat de recherche
                    </Link>
                </div>
            </section>
        </main>
    );
}
