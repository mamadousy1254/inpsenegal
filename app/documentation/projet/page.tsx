import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";

const objectifs = [
    {
        title: "Modernisation des données",
        description: "Numérisation et structuration des bases de données pédologiques.",
        image: "/images/data-modernisation.jpg",
    },
    {
        title: "Gestion durable des terres",
        description: "Promotion des pratiques adaptées aux spécificités des sols.",
        image: "/images/gestion-terres.jpg",
    },
    {
        title: "Appui aux politiques publiques",
        description: "Production d'indicateurs scientifiques pour la prise de décision.",
        image: "/images/politiques-publiques.jpg",
    },
];

export const metadata: Metadata = {
    title: "Le Projet | Documentation — INP",
    description:
        "Programme national de modernisation, de valorisation et de gestion durable des ressources pédologiques du Sénégal.",
};

export default function ProjetINP() {
    return (
        <main className="min-h-screen bg-white">
            {/* 1️⃣ HERO */}
            <PageHero
                label="Documentation — INP"
                title="Le Projet"
                subtitle="Programme national de modernisation, de valorisation et de gestion durable des ressources pédologiques du Sénégal."
            />

            {/* 2️⃣ CONTEXTE & JUSTIFICATION */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-4">
                        Contexte et justification
                    </h2>
                    <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] mb-8" />

                    <p className="text-gray-700 leading-relaxed mb-6">
                        Face aux défis liés à la dégradation des terres, à la pression
                        démographique et au changement climatique, l&apos;Institut National de
                        Pédologie (INP) a initié un projet structurant visant à renforcer
                        la connaissance scientifique des sols et leur gestion durable.
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        Ce projet s&apos;inscrit dans les orientations stratégiques nationales
                        de souveraineté alimentaire et de développement agricole durable.
                    </p>
                </div>
            </section>

            {/* 3️⃣ OBJECTIFS STRATÉGIQUES */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-semibold text-center mb-4">
                        Objectifs stratégiques
                    </h2>
                    <div className="w-20 h-1 mx-auto rounded-full bg-white/30 mb-16" />

                    <div className="grid md:grid-cols-3 gap-10">
                        {objectifs.map((item, index) => (
                            <div
                                key={index}
                                className="relative group rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2F1A]/90 via-[#7B4F2A]/60 to-transparent" />

                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                                    <h3 className="text-xl font-semibold mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="opacity-90 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4️⃣ COMPOSANTES DU PROJET */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-semibold text-center text-amber-900 mb-4">
                        Composantes techniques
                    </h2>
                    <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] mb-16" />

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                title: "Cartographie pédologique nationale actualisée",
                                description: "Mise à jour et harmonisation des cartes pédologiques pour une meilleure planification territoriale.",
                                image: "/images/comp-cartographie.jpg",
                            },
                            {
                                title: "Analyse physico-chimique des sols",
                                description: "Caractérisation scientifique des propriétés physiques et chimiques pour orienter les pratiques agricoles.",
                                image: "/images/comp-analyse.jpg",
                            },
                            {
                                title: "Mise en place d'un portail SIG national",
                                description: "Développement d'une plateforme géospatiale interactive pour la consultation des données pédologiques.",
                                image: "/images/comp-sig.jpg",
                            },
                            {
                                title: "Digitalisation des archives historiques",
                                description: "Conversion numérique des documents et rapports anciens pour assurer leur conservation et accessibilité.",
                                image: "/images/comp-archives.jpg",
                            },
                            {
                                title: "Formation des acteurs territoriaux",
                                description: "Renforcement des capacités techniques des collectivités et services agricoles.",
                                image: "/images/comp-formation.jpg",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="relative group rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2F1A]/90 via-[#7B4F2A]/60 to-transparent" />

                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                                    <h3 className="text-xl font-semibold mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="opacity-90 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5️⃣ IMPACT ATTENDU */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold mb-16">
                        Impact attendu
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                            <p className="text-4xl font-bold mb-2">National</p>
                            <p className="opacity-80">Couverture territoriale complète</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                            <p className="text-4xl font-bold mb-2">Durable</p>
                            <p className="opacity-80">Protection des ressources en sols</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                            <p className="text-4xl font-bold mb-2">Stratégique</p>
                            <p className="opacity-80">Renforcement de la souveraineté alimentaire</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6️⃣ CTA */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-6">
                        En savoir plus
                    </h2>

                    <p className="text-lg text-gray-700 mb-10">
                        Consultez nos rapports, guides techniques et archives
                        pour approfondir votre compréhension du projet INP.
                    </p>

                    <Link
                        href="/documentation/rapports-publications"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white font-semibold hover:opacity-90 transition shadow-lg inline-flex"
                    >
                        Consulter les rapports
                    </Link>
                </div>
            </section>
        </main>
    );
}
