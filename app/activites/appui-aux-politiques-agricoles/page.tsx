import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
    title: "Appui aux Politiques Agricoles | INP",
    description:
        "L’INP met son expertise scientifique au service de l’élaboration, du suivi et de l’évaluation des politiques agricoles nationales pour garantir une gestion durable des ressources en sols.",
};

const domaines = [
    {
        title: "Élaboration des stratégies agricoles",
        image: "/programmes/programme-cartographie-pedologique.png",
        alt: "Équipe de l'INP analysant la carte pédologique nationale",
    },
    {
        title: "Conseil en fertilité des sols",
        image: "/programmes/programme-fertilite-nutrition.png",
        alt: "Conseil en fertilité : agent de l'INP au champ",
    },
    {
        title: "Appui aux programmes nationaux",
        image: "/programmes/programme-sols-changement-climatique.png",
        alt: "Appui de l'INP aux programmes nationaux sur le terrain",
    },
    {
        title: "Évaluation des projets agricoles",
        image: "/programmes/programme-degradation-restauration.png",
        alt: "Évaluation et diagnostic des terres par l'INP",
    },
    {
        title: "Intégration des données pédologiques dans les politiques publiques",
        image: "/programmes/programme-bases-donnees-pedologiques.png",
        alt: "Intégration des données pédologiques de l'INP",
    },
    {
        title: "Production d’indicateurs scientifiques",
        image: "/projets/projet-base-donnees-pedologiques.png",
        alt: "Production d'indicateurs et de rapports scientifiques de l'INP",
    },
];

export default function AppuiPolitiquesAgricoles() {
    return (
        <main className="min-h-screen bg-white">
            {/* 1️⃣ HERO INSTITUTIONNEL (Design unifié Activités) */}
            <PageHero
                label="INP — Institut national de Pédologie"
                title="Appui aux Politiques Agricoles"
                subtitle="L’INP met son expertise scientifique au service de l’élaboration, du suivi et de l’évaluation des politiques agricoles nationales pour garantir une gestion durable des ressources en sols."
            />

            {/* 2️⃣ SECTION CONTEXTE STRATÉGIQUE */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6 space-y-8">
                    <h2 className="text-3xl font-semibold text-amber-900">
                        Rôle stratégique de l’INP
                    </h2>

                    <p className="text-lg text-gray-700 leading-relaxed">
                        En tant qu’établissement public scientifique et technique,
                        l’INP accompagne l’État du Sénégal dans la conception de
                        stratégies agricoles fondées sur des données pédologiques fiables.
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                        Nos analyses contribuent à l’orientation des politiques
                        de fertilisation, d’aménagement du territoire,
                        de sécurité alimentaire et d’adaptation au changement climatique.
                    </p>
                </div>
            </section>

            {/* 3️⃣ DOMAINES D’INTERVENTION */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-semibold text-center mb-16">
                        Domaines d’appui
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        {domaines.map((item, index) => (
                            <div
                                key={index}
                                className="relative group rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                            >
                                {/* Image */}
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    width={600}
                                    height={400}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-700"
                                />

                                {/* Overlay INP */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2F1A]/90 via-[#7B4F2A]/70 to-transparent" />

                                {/* Contenu */}
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

            {/* 4️⃣ IMPACT INSTITUTIONNEL */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-16">
                        Contribution nationale
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-[var(--inp-vert)] bg-clip-text text-transparent">
                                Continu
                            </p>
                            <p className="text-gray-600">Appui aux programmes nationaux</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-[var(--inp-vert)] bg-clip-text text-transparent">
                                100%
                            </p>
                            <p className="text-gray-600">Couverture nationale</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-[var(--inp-vert)] bg-clip-text text-transparent">
                                +20 ans
                            </p>
                            <p className="text-gray-600">Expertise scientifique</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5️⃣ SECTION PARTENARIATS */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-6">
                        Collaboration institutionnelle
                    </h2>

                    <p className="text-lg opacity-90 mb-10">
                        L’INP travaille en étroite collaboration avec les ministères,
                        les agences publiques et les partenaires techniques et financiers
                        pour renforcer la prise de décision basée sur des données scientifiques fiables.
                    </p>

                    <button className="px-8 py-4 rounded-xl bg-white text-[#4A2F1A] font-semibold hover:bg-gray-100 transition">
                        Nous contacter
                    </button>
                </div>
            </section>
        </main>
    );
}
