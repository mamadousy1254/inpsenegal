import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import TricolorUnderline from "@/components/TricolorUnderline";

export const metadata: Metadata = {
    title: "Liens Utiles | INP",
    description:
        "Liens vers les sites officiels des institutions gouvernementales, partenaires et médias du Sénégal.",
};

const links = [
    {
        name: "Site du Gouvernement",
        url: "https://www.sec.gouv.sn",
        description: "Portail officiel du Gouvernement de la République du Sénégal.",
    },
    {
        name: "Ministère de l'Agriculture",
        url: "https://www.agriculture.gouv.sn",
        description:
            "Ministère de l'Agriculture, de la Souveraineté Alimentaire et de l'Élevage.",
    },
    {
        name: "Gendarmerie Nationale",
        url: "https://www.gendarmerie.sn",
        description: "Site officiel de la Gendarmerie Nationale du Sénégal.",
    },
    {
        name: "Brigade Nationale des Sapeurs-Pompiers",
        url: "https://www.pompiers.sn",
        description: "Portail des sapeurs-pompiers du Sénégal.",
    },
    {
        name: "RTS — Radiodiffusion Télévision du Sénégal",
        url: "https://www.rts.sn",
        description: "Média audiovisuel public du Sénégal.",
    },
    {
        name: "APS — Agence de Presse Sénégalaise",
        url: "https://www.aps.sn",
        description: "Agence nationale d'information et de presse.",
    },
    {
        name: "Le Soleil",
        url: "https://www.lesoleil.sn",
        description: "Quotidien national d'information.",
    },
];

export default function LiensUtilesPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* HERO */}
            <section className="relative py-28 text-white bg-[var(--inp-vert)] overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />

                <div className="relative max-w-6xl mx-auto px-6 text-center">
                    <p className="uppercase tracking-widest text-sm opacity-80 mb-6">
                        Ressources — INP
                    </p>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Liens Utiles
                    </h1>

                    <TricolorUnderline width={96} height={4} starSize={16} className="mx-auto mb-8" />

                    <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                        Accédez aux sites officiels des institutions gouvernementales,
                        partenaires et médias du Sénégal.
                    </p>
                </div>
            </section>

            {/* LIENS */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold text-amber-900 mb-4">
                        Sites institutionnels & médias
                    </h2>
                    <div className="w-20 h-1 rounded-full bg-[var(--inp-vert)] mb-12" />

                    <div className="space-y-4">
                        {links.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-6 rounded-2xl border border-amber-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:bg-[var(--inp-vert)] hover:text-white"
                            >
                                <div>
                                    <p className="font-semibold text-amber-800 group-hover:text-white transition mb-1">
                                        {link.name}
                                    </p>
                                    <p className="text-sm text-gray-500 group-hover:text-white/80 transition">
                                        {link.description}
                                    </p>
                                </div>
                                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-white flex-shrink-0 ml-4 transition" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
