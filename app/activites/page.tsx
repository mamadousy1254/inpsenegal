import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Leaf, GraduationCap, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Activités | INP",
    description:
        "Découvrez les domaines d'intervention de l'Institut national de Pédologie : gestion durable des terres, formation, appui aux politiques agricoles.",
};

const activites = [
    {
        title: "Gestion durable des terres",
        description:
            "Programmes de lutte contre la dégradation des sols et de restauration des terres agricoles au Sénégal.",
        icon: Leaf,
        href: "/activites/gestion-durable-des-terres",
    },
    {
        title: "Formation & Renforcement des capacités",
        description:
            "Formations techniques destinées aux agents de terrain, techniciens et partenaires institutionnels.",
        icon: GraduationCap,
        href: "/activites/formation-renforcement-des-capacites",
    },
    {
        title: "Appui aux politiques agricoles",
        description:
            "Accompagnement scientifique et technique des décideurs pour l'élaboration de politiques agricoles fondées sur les données pédologiques.",
        icon: ShieldCheck,
        href: "/activites/appui-aux-politiques-agricoles",
    },
];

export default function ActivitesPage() {
    return (
        <main className="min-h-screen bg-white">
            <PageHero
                label="INP — Institut national de Pédologie"
                title="Activités"
                subtitle="L'INP intervient sur l'ensemble du territoire national à travers des programmes de gestion durable des terres, de formation et d'appui aux politiques agricoles."
            />

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-4 text-center">
                        Nos domaines d&apos;intervention
                    </h2>
                    <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] mb-16" />

                    <div className="grid md:grid-cols-3 gap-10">
                        {activites.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group rounded-2xl border border-amber-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="h-1.5 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c]" />
                                    <div className="p-10 space-y-5">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 group-hover:bg-amber-100 transition">
                                            <Icon className="h-7 w-7 text-amber-700" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-amber-900 transition">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-r from-[#4A2F1A] via-[#7B4F2A] to-[#8b5e3c] text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-6">
                        Collaborer avec l&apos;INP
                    </h2>
                    <p className="text-lg opacity-90 mb-10">
                        Vous souhaitez un appui technique ou un partenariat ?
                        Contactez-nous pour discuter de vos besoins.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-amber-900 font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                        Nous contacter
                    </Link>
                </div>
            </section>
        </main>
    );
}
