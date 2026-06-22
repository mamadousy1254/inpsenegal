import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InfosContact } from "@/components/contact/InfosContact";
import { FormulaireContact } from "@/components/contact/FormulaireContact";
import { Localisation } from "@/components/contact/Localisation";
import { HorairesCanaux } from "@/components/contact/HorairesCanaux";

export const metadata: Metadata = {
  title: "Contact — INP",
  description:
    "Contactez l'Institut national de Pédologie : coordonnées, formulaire de contact, localisation et horaires d'ouverture.",
  openGraph: {
    title: "Contact — Institut national de Pédologie",
    description:
      "Adresse, téléphone, email et formulaire de contact de l'INP à Dakar, Sénégal.",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact"
        subtitle="Coordonnées officielles, formulaire de contact et informations pratiques pour nous joindre."
        label="Nous contacter"
      />

      {/* ── Section 1 + 2: Infos + Formulaire (2 colonnes) ── */}
      <section
        className="py-20 px-4 sm:py-24 lg:py-28"
        style={{ backgroundColor: "#F8F1E0" }}
        aria-labelledby="contact-main-title"
      >
        <div className="container mx-auto max-w-6xl">
          <SectionTitle
            id="contact-main-title"
            align="center"
            label="Échangeons"
            className="mb-14"
          >
            Prenez contact avec l&apos;INP
          </SectionTitle>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
            <InfosContact />
            <FormulaireContact />
          </div>
        </div>
      </section>

      {/* ── Section 3: Localisation ── */}
      <Localisation />

      {/* ── Section 4: Horaires & canaux ── */}
      <HorairesCanaux />
    </>
  );
}
