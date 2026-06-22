import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
    title: "Innovation & SIG | INP",
    description:
        "L'INP intègre les technologies géospatiales et les systèmes d'information géographique (SIG) pour moderniser la gestion et la diffusion des données pédologiques nationales.",
};

const innovations = [
    {
        title: "Cartographie numérique interactive",
        image: "/images/sig-cartographie.jpg",
    },
    {
        title: "Base de données pédologique nationale",
        image: "/images/sig-database.jpg",
    },
    {
        title: "Analyse spatiale et modélisation",
        image: "/images/sig-analyse.jpg",
    },
    {
        title: "Télédétection et imagerie satellitaire",
        image: "/images/sig-satellite.jpg",
    },
    {
        title: "Portail national de consultation des sols",
        image: "/images/sig-portail.jpg",
    },
    {
        title: "Digitalisation des archives pédologiques",
        image: "/images/sig-archives.jpg",
    },
];

export default function InnovationSIG() {
    return (
        <main className="min-h-screen bg-white">
            {/* 1️⃣ HERO INSTITUTIONNEL */}
            <PageHero
                label="INP — Institut national de Pédologie"
                title="Innovation & SIG"
                subtitle="L'INP intègre les technologies géospatiales et les systèmes d'information géographique (SIG) pour moderniser la gestion et la diffusion des données pédologiques nationales."
            />

            {/* 2️⃣ CONTEXTE */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6 space-y-8">
                    <h2 className="text-3xl font-semibold text-amber-900">
                        La technologie au service de la pédologie
                    </h2>
                    <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c]" />
                    <p className="text-lg leading-relaxed text-gray-700">
                        L&apos;INP exploite les technologies de pointe — systèmes d&apos;information
                        géographique, télédétection, modélisation spatiale — pour produire
                        des données pédologiques précises et accessibles. Ces outils permettent
                        de moderniser la gestion des ressources en sols et d&apos;appuyer
                        la planification territoriale du Sénégal. Ces outils soutiennent
                        l&apos;ensemble des{" "}
                        <Link
                            href="/recherche/programmes-de-recherche"
                            className="font-semibold text-[#7B4F2A] underline underline-offset-2 hover:text-[#4A2F1A]"
                        >
                            programmes
                        </Link>{" "}
                        et{" "}
                        <Link
                            href="/recherche/projets-scientifiques"
                            className="font-semibold text-[#7B4F2A] underline underline-offset-2 hover:text-[#4A2F1A]"
                        >
                            projets
                        </Link>{" "}
                        de l&apos;Institut.
                    </p>
                </div>
            </section>

            {/* 3️⃣ SECTION DOMAINES D'INNOVATION (AVEC IMAGES) */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-semibold text-center mb-4">
                        Domaines d&apos;innovation
                    </h2>
                    <div className="w-20 h-1 mx-auto rounded-full bg-white/30 mb-16" />

                    <div className="grid md:grid-cols-3 gap-10">
                        {innovations.map((item, index) => (
                            <div
                                key={index}
                                className="relative group rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
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

            {/* 4️⃣ SECTION CAPACITÉS TECHNOLOGIQUES */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-16">
                        Capacités technologiques
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                SIG
                            </p>
                            <p className="text-gray-600 mt-3">
                                QGIS, ArcGIS, analyse spatiale avancée
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                Data
                            </p>
                            <p className="text-gray-600 mt-3">
                                Bases de données pédologiques géoréférencées
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                Web GIS
                            </p>
                            <p className="text-gray-600 mt-3">
                                Portails interactifs et visualisation en ligne
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5️⃣ CTA */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-6">
                        Explorez nos données spatiales
                    </h2>

                    <p className="text-lg opacity-90 mb-10">
                        L&apos;INP a vocation à rendre accessible son patrimoine numérique
                        pédologique à travers des cartes et services interactifs.
                    </p>

                    <Link
                        href="/cartographie"
                        className="px-8 py-4 rounded-xl bg-white text-[#4A2F1A] font-semibold hover:bg-gray-100 transition shadow-lg inline-flex"
                    >
                        Accéder à la Cartographie
                    </Link>
                </div>
            </section>
        </main>
    );
}
