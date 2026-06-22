"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  FlaskConical,
  Map,
  BarChart3,
  Sprout,
  BookOpen,
  Globe,
  FileText,
  TrendingUp,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const SERVICES: ServiceItem[] = [
  {
    title: "Analyse physico-chimique des sols",
    description:
      "Caractérisation complète : texture, pH, matière organique, éléments nutritifs, capacité d'échange cationique, conductivité électrique.",
    icon: FlaskConical,
  },
  {
    title: "Cartographie pédologique",
    description:
      "Levés de terrain, prospection systématique, cartographie numérique (DSM) et production de cartes thématiques à différentes échelles.",
    icon: Map,
  },
  {
    title: "Études agro-écologiques",
    description:
      "Diagnostic territorial, évaluation du potentiel agronomique, zonage agro-écologique et recommandations d'aménagement.",
    icon: BarChart3,
  },
  {
    title: "Diagnostic de fertilité",
    description:
      "Évaluation de la fertilité chimique et biologique, formulation de recommandations de fertilisation adaptées aux cultures et aux zones.",
    icon: Sprout,
  },
  {
    title: "Expertise technique pour projets agricoles",
    description:
      "Accompagnement scientifique des projets d'irrigation, de développement rural, d'aménagement foncier et de restauration des terres.",
    icon: BookOpen,
  },
  {
    title: "Assistance aux collectivités",
    description:
      "Appui technique aux collectivités territoriales pour la planification de l'usage des sols, la gestion durable des terres et l'aménagement du territoire.",
    icon: Globe,
  },
  {
    title: "Élaboration de rapports techniques",
    description:
      "Rédaction de rapports d'expertise, études d'impact environnemental, notes techniques et avis scientifiques pour les décideurs.",
    icon: FileText,
  },
  {
    title: "Appui aux politiques publiques",
    description:
      "Contribution à la formulation des politiques agricoles, production de données de référence et participation aux cadres de concertation nationaux.",
    icon: TrendingUp,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CatalogueServices() {
  return (
    <section className="py-20 px-4 sm:py-24 lg:py-28" aria-labelledby="catalogue-title">
      <div className="container mx-auto max-w-6xl">
        <SectionTitle
          id="catalogue-title"
          align="center"
          label="Nos prestations"
          subtitle="Un catalogue complet couvrant l'ensemble de la chaîne d'expertise pédologique."
        >
          Catalogue des services
        </SectionTitle>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((svc, i) => (
            <motion.article
              key={svc.title}
              className="group flex flex-col rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--inp-vert)]/10 text-[var(--inp-vert)] transition-colors duration-300 group-hover:bg-[var(--inp-vert)] group-hover:text-white">
                <svc.icon className="h-5 w-5" />
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold leading-snug text-foreground">
                {svc.title}
              </h3>

              {/* Description */}
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                {svc.description}
              </p>

              {/* Link */}
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--inp-vert)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                En savoir plus <ArrowRight className="h-3 w-3" />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
