import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FlaskConical, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  CTA — une seule source de saisie : /demande-analyse               */
/* ------------------------------------------------------------------ */

export function DemandeAnalyse() {
  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "var(--inp-vert)" }}
      aria-labelledby="demande-title"
    >
      {/* Geometric texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="container relative mx-auto max-w-3xl text-center">
        <SectionTitle id="demande-title" align="center" light label="Services d'analyse">
          Besoin d&apos;une analyse ?
        </SectionTitle>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85">
          Pour soumettre un échantillon ou demander une analyse de sol, utilisez le
          formulaire officiel de l&apos;INP. Vous y précisez votre profil, la localisation
          de la parcelle, les analyses souhaitées et la logistique d&apos;envoi.
        </p>

        <div className="mt-9">
          <Link
            href="/demande-analyse"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--inp-vert)] shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105"
          >
            <FlaskConical className="h-4 w-4" aria-hidden />
            Faire une demande d&apos;analyse
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
