import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";

const formations = [
    {
        title: "Techniques de conservation des sols",
        image: "/programmes/programme-degradation-restauration.png",
        alt: "Conservation et restauration des sols par l'INP",
    },
    {
        title: "Interprétation des analyses pédologiques",
        image: "/programmes/programme-bases-donnees-pedologiques.png",
        alt: "Interprétation des données et analyses pédologiques de l'INP",
    },
    {
        title: "Cartographie et SIG appliqués",
        image: "/programmes/programme-cartographie-pedologique.png",
        alt: "Cartographie et SIG appliqués aux sols par l'INP",
    },
    {
        title: "Gestion durable des terres (GDT)",
        image: "/programmes/programme-innovation-gestion-durable.png",
        alt: "Gestion durable des terres : approche de l'INP",
    },
    {
        title: "Fertilité et gestion intégrée des nutriments",
        image: "/programmes/programme-fertilite-nutrition.png",
        alt: "Fertilité et gestion intégrée des nutriments par l'INP",
    },
    {
        title: "Adaptation au changement climatique",
        image: "/programmes/programme-sols-changement-climatique.png",
        alt: "Adaptation des sols au changement climatique par l'INP",
    },
];

export const metadata: Metadata = {
    title: "Formation & Renforcement des Capacités | INP",
    description:
        "L’INP développe les compétences techniques des acteurs du secteur agricole afin de promouvoir une gestion durable et scientifiquement fondée des sols.",
};

export default function FormationPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* 1️⃣ HERO INSTITUTIONNEL */}
            <PageHero
                label="INP — Institut national de Pédologie"
                title="Formation & Renforcement des Capacités"
                subtitle="L’INP développe les compétences techniques des acteurs du secteur agricole afin de promouvoir une gestion durable et scientifiquement fondée des sols."
            />

            {/* 2️⃣ CONTEXTE STRATÉGIQUE */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6 space-y-8">
                    <h2 className="text-3xl font-semibold text-amber-900">
                        Une mission stratégique pour le développement agricole
                    </h2>

                    <p className="text-lg text-gray-700 leading-relaxed">
                        Le renforcement des capacités constitue un levier essentiel pour assurer
                        l’adoption des bonnes pratiques de gestion des sols. L’INP forme les techniciens,
                        les collectivités territoriales, les producteurs et les partenaires institutionnels.
                    </p>
                </div>
            </section>

            {/* 3️⃣ DOMAINES DE FORMATION */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-semibold text-center mb-16">
                        Domaines de formation
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        {formations.map((item, index) => (
                            <div
                                key={index}
                                className="relative group rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                            >
                                {/* Image */}
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    width={600}
                                    height={400}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                                />

                                {/* Overlay dégradé INP */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2F1A]/90 via-[#7B4F2A]/70 to-transparent" />

                                {/* Titre */}
                                <div className="absolute bottom-0 p-6 z-10">
                                    <h3 className="text-xl font-semibold leading-snug text-white">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4️⃣ IMPACT */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-16">
                        Impact des formations
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-[var(--inp-vert)] bg-clip-text text-transparent">
                                Continue
                            </p>
                            <p className="text-gray-600">Formation des producteurs et techniciens</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-[var(--inp-vert)] bg-clip-text text-transparent">
                                Pratique
                            </p>
                            <p className="text-gray-600">Sessions et parcelles de démonstration</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-[var(--inp-vert)] bg-clip-text text-transparent">
                                National
                            </p>
                            <p className="text-gray-600">Couverture territoriale</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5️⃣ CTA */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-6">
                        Participer à nos formations
                    </h2>

                    <p className="text-lg opacity-90 mb-10">
                        L’INP organise régulièrement des sessions de formation
                        et d’ateliers techniques destinés aux professionnels et institutions.
                    </p>

                    <Link
                        href="/contact"
                        className="px-8 py-4 rounded-xl bg-white text-[#4A2F1A] font-semibold hover:bg-gray-100 transition shadow-lg inline-flex"
                    >
                        Demander une formation
                    </Link>
                </div>
            </section>
        </main>
    );
}
