import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, ShieldAlert, Droplets, Mountain, Sprout, Building2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
    title: "Gestion Durable des Terres | INP",
    description:
        "L'Institut national de Pédologie accompagne la préservation, la restauration et la valorisation durable des ressources en sols pour renforcer la résilience agricole et environnementale du Sénégal.",
};

const DOMAINES_INTERVENTION = [
    {
        title: "Conservation des sols",
        description: "Techniques de préservation de la structure et de la biodiversité des sols.",
        icon: Leaf,
    },
    {
        title: "Lutte contre l'érosion",
        description: "Aménagements anti-érosifs pour contrer l'érosion hydrique et éolienne.",
        icon: ShieldAlert,
    },
    {
        title: "Restauration des terres dégradées",
        description: "Réhabilitation des terres salées, acidifiées ou épuisées.",
        icon: Mountain,
    },
    {
        title: "Aménagement hydro-agricole",
        description: "Optimisation de la gestion de l'eau à la parcelle.",
        icon: Droplets,
    },
    {
        title: "Fertilité et gestion intégrée",
        description: "Recommandations sur la fertilisation organique et minérale optimisée.",
        icon: Sprout,
    },
    {
        title: "Appui aux collectivités territoriales",
        description: "Accompagnement dans la planification foncière et les schémas d'aménagement.",
        icon: Building2,
    },
];

export default function GestionDurableTerresPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* 1️⃣ HERO SECTION */}
            <PageHero
                label="INP — Institut national de Pédologie"
                title="Gestion Durable des Terres"
                subtitle="L'Institut national de Pédologie accompagne la préservation, la restauration et la valorisation durable des ressources en sols pour renforcer la résilience agricole et environnementale du Sénégal."
            />

            {/* 2️⃣ SECTION INTRODUCTION */}
            <section className="py-20">
                <div className="mx-auto max-w-5xl px-6 space-y-8">
                    <h2 className="text-3xl font-semibold text-amber-900">
                        Notre mission en matière de GDT
                    </h2>
                    <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c]" />
                    <p className="text-lg leading-relaxed text-gray-700">
                        La Gestion Durable des Terres (GDT) constitue un pilier stratégique de la
                        <strong className="font-semibold text-amber-900"> souveraineté alimentaire </strong>
                        et de la lutte contre la
                        <strong className="font-semibold text-amber-800"> dégradation des sols</strong>.
                        L&apos;INP met en œuvre des approches scientifiques adaptées aux réalités agroécologiques du Sénégal
                        pour assurer un développement durable.
                    </p>
                </div>
            </section>

            {/* 3️⃣ AXES D'INTERVENTION GDT */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="mb-4 text-4xl font-semibold">
                            Domaines d&apos;intervention
                        </h2>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Nos actions se déploient sur l&apos;ensemble du territoire à travers une approche intégrée et multidimensionnelle.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {DOMAINES_INTERVENTION.map((domaine, index) => {
                            const Icon = domaine.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-8 border border-white/15 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-2xl"
                                >
                                    <div className="mb-6 inline-flex rounded-xl bg-white/15 p-4 ring-1 ring-white/20 transition-colors group-hover:bg-white/25">
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">
                                        {domaine.title}
                                    </h3>
                                    <p className="text-white/75 leading-relaxed">
                                        {domaine.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4️⃣ MÉTHODOLOGIE SCIENTIFIQUE */}
            <section className="py-24 bg-white">
                <div className="mx-auto max-w-4xl px-6">
                    <h2 className="mb-4 text-3xl font-semibold text-amber-900">
                        Approche méthodologique
                    </h2>
                    <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] mb-12" />

                    <div className="space-y-6">
                        {[
                            "Diagnostic pédologique et cartographie des zones à risque",
                            "Analyses physico-chimiques en laboratoire",
                            "Recommandations techniques adaptées",
                            "Suivi et évaluation des impacts"
                        ].map((step, idx) => (
                            <div key={idx} className="group flex items-center gap-5 rounded-2xl bg-gradient-to-r from-amber-50 to-white p-6 shadow-sm border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#4A2F1A] to-[#7B4F2A] text-white font-bold text-lg shadow-md">
                                    {idx + 1}
                                </div>
                                <p className="text-lg font-medium text-gray-800">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5️⃣ IMPACT NATIONAL */}
            <section className="py-24 bg-white border-t border-amber-100">
                <div className="mx-auto max-w-6xl px-6 text-center">
                    <h2 className="mb-16 text-3xl font-semibold text-amber-900">
                        Impact et contribution nationale
                    </h2>

                    <div className="grid gap-12 sm:grid-cols-3">
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                +14
                            </p>
                            <p className="text-gray-600 mt-2">Régions couvertes</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                +200
                            </p>
                            <p className="text-gray-600 mt-2">Sites restaurés</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-md">
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A2F1A] to-[#8b5e3c] bg-clip-text text-transparent">
                                +5000
                            </p>
                            <p className="text-gray-600 mt-2">Producteurs accompagnés</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6️⃣ APPEL À COLLABORATION */}
            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white text-center">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 className="text-3xl font-semibold mb-6">
                        Partenariat et collaboration
                    </h2>
                    <p className="text-lg opacity-90 mb-10">
                        L&apos;INP collabore avec les collectivités territoriales, les partenaires techniques et financiers,
                        et les organisations agricoles pour promouvoir une gestion durable des terres à l&apos;échelle nationale.
                    </p>
                    <Link
                        href="/contact"
                        className="px-8 py-4 rounded-xl bg-white text-[#4A2F1A] font-semibold hover:bg-gray-100 transition shadow-lg inline-flex"
                    >
                        Nous contacter pour collaborer
                    </Link>
                </div>
            </section>
        </main>
    );
}
