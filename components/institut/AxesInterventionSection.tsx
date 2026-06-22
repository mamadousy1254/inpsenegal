"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layers,
  Sprout,
  GraduationCap,
  Handshake,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Métadonnées des axes (titres existants + descriptions de synthèse) */
/* ------------------------------------------------------------------ */

type AxeNumber = 1 | 2 | 3 | 4;

const AXES_META: {
  num: AxeNumber;
  badge: string;
  anchor: string;
  title: string;
  short: string;
  icon: LucideIcon;
}[] = [
  {
    num: 1,
    badge: "Axe 1",
    anchor: "axe-1",
    title: "Amélioration de la connaissance des caractéristiques des sols",
    short:
      "Cartographie pédologique nationale géoréférencée, évaluation des aptitudes (agricoles, forestières, pastorales, aquacoles, urbaines), analyses physico-chimiques et bases de données.",
    icon: Layers,
  },
  {
    num: 2,
    badge: "Axe 2",
    anchor: "axe-2",
    title: "Amélioration de la productivité des sols",
    short:
      "Diagnostic et restauration de la fertilité, lutte contre l'érosion, la salinisation et la dégradation, pratiques agroécologiques et fertilisation raisonnée.",
    icon: Sprout,
  },
  {
    num: 3,
    badge: "Axe 3",
    anchor: "axe-3",
    title: "Renforcement des capacités des acteurs dans la GDT",
    short:
      "Formation des producteurs dans les CPFP, sensibilisation et vulgarisation, appui-conseil aux collectivités.",
    icon: GraduationCap,
  },
  {
    num: 4,
    badge: "Axe 4",
    anchor: "axe-4",
    title: "Coordination, Partenariat et communication",
    short:
      "Coordination et contrôle des travaux pédologiques, coopération régionale et internationale, normes, communication et diffusion scientifique.",
    icon: Handshake,
  },
];

/* ------------------------------------------------------------------ */
/*  Bloc image + bandeau (présentation existante, recolorée charte INP) */
/* ------------------------------------------------------------------ */

function ContentBlock({
  banner,
  imageSrc,
  imageAlt,
  legend,
  children,
}: {
  banner: string;
  imageSrc?: string;
  imageAlt?: string;
  legend?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-[#E5DCC2] bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-6 text-center shadow-sm md:px-8 md:py-8">
        <p className="text-lg font-bold tracking-tight text-[#7B4F2A] md:text-xl">
          {banner}
        </p>
      </div>
      {imageSrc && (
        <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <div className="relative w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              width={1200}
              height={700}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 100vw, 1200px"
              unoptimized
            />
          </div>
          {legend && (
            <p className="border-t-2 border-gray-200 bg-gray-50/80 px-6 py-3 text-center text-sm font-medium text-gray-600">
              {legend}
            </p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contenu des axes — repris intégralement de l'existant (verbatim)   */
/* ------------------------------------------------------------------ */

function Axe1Content() {
  return (
    <div className="space-y-12">
      {/* Terrain — Processus */}
      <div>
        <p className="border-l-4 border-amber-700 pl-4 text-sm font-semibold uppercase tracking-wide text-amber-800">Terrain</p>
        <h3 className="mt-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 1 : Amélioration de la connaissance des caractéristiques des sols</h3>
        <div className="mt-8">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
            <Image
              src="/images/institut/axe1/processus-axe1.png"
              alt="Processus AXE 1 — Prospection, Délimitation, Plan d'échantillonnage, Plan géomètre, Prélèvement tarière et profil, Échantillons"
              width={1200}
              height={700}
              className="w-full object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Laboratoire — Analyse */}
      <div>
        <p className="border-l-4 border-amber-700 pl-4 text-sm font-semibold uppercase tracking-wide text-amber-800">Laboratoire</p>
        <h3 className="mt-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 1 : Amélioration de la productivité des sols</h3>
        <div className="mt-8 space-y-6">
          <ContentBlock
            banner="Labo : Analyse des échantillons"
            imageSrc="/images/institut/axe2/labo-collage.png"
            imageAlt="Laboratoire INP — salles de travail, équipements d'analyse (balance de précision, spectromètres, agitateur) et personnel en blouse"
            legend="Équipements et installations — analyse des échantillons"
          />
        </div>
      </div>

      {/* Résultats d'analyse */}
      <div>
        <p className="border-l-4 border-amber-700 pl-4 text-sm font-semibold uppercase tracking-wide text-amber-800">Résultats</p>
        <h3 className="mt-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 1 : Amélioration de la productivité des sols</h3>
        <div className="mt-8">
          <ContentBlock
            banner="Labo : Résultats d'analyse"
            imageSrc="/images/institut/axe1/resultats-analyse.png"
            imageAlt="Rapport d'analyses INP — Résultats d'analyse chimique et physique des sols"
            legend="Rapport d'analyses — résultats chimiques et physiques des échantillons de sol"
          />
        </div>
      </div>

      {/* DFRS */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 1 — Connaissance des caractéristiques des sols</h3>
        <div className="mt-8">
          <ContentBlock
            banner="DFRS : Interprétations des résultats d'analyses des sols et recommandations sur la GDT (cas du Fonio)"
            imageSrc="/images/institut/axe1/dfrs-fonio.png"
            imageAlt="Tableau DFRS — Paramètres étudiés, exigences du Fonio, caractéristiques de la zone et des sols, aptitude et recommandations"
            legend="Interprétations et recommandations GDT — cas du Fonio"
          />
        </div>
      </div>

      {/* DCCA */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 1 — Connaissance des caractéristiques des sols</h3>
        <div className="mt-8">
          <ContentBlock
            banner="DCCA : Localisation et cartes monoparamètriques"
            imageSrc="/images/institut/axe1/dcca-cartes.png"
            imageAlt="DCCA — Carte de localisation (site Dialikénié, Sédhiou) et carte monoparamétrique teneur en azote %"
            legend="Localisation et cartes monoparamètriques — site Dialikénié"
          />
        </div>
      </div>

      {/* Processus complet */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 1 — Connaissance des caractéristiques des sols</h3>
        <div className="mt-8">
          <ContentBlock
            banner="Processus : Terrain → Labo → DFRS → DCCA → DT → DG → Rapport de caractérisation"
            imageSrc="/images/institut/axe1/processus-rapport-characterisation.png"
            imageAlt="Processus INP : Terrain, Labo, DFRS, DCCA, DT, DG et Rapport de caractérisation des sols"
            legend="Chaîne de production jusqu'au rapport de caractérisation des sols"
          />
        </div>
      </div>
    </div>
  );
}

function Axe2Content() {
  return (
    <div className="space-y-12">
      {/* DRS/CES Mesures physiques */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 2 : Amélioration de la productivité des sols</h3>
        <div className="mt-8">
          <ContentBlock
            banner="DRS/CES : Mesures physiques — bonnes pratiques agricoles"
            imageSrc="/images/institut/axe2/drs-ces-mesures-physiques.png"
            imageAlt="DRS/CES mesures physiques : cordons pierreux, demi-lunes, diguette en cadre"
            legend="Cordons pierreux, demi-lunes, diguette en cadre"
          />
        </div>
      </div>

      {/* DRS/CES Mesures biologiques */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 2 : Amélioration de la productivité des sols</h3>
        <div className="mt-8">
          <ContentBlock
            banner="DRS/CES : Mesures biologiques"
            imageSrc="/images/institut/axe2/drs-ces-mesures-biologiques.png"
            imageAlt="DRS/CES mesures biologiques : paillage, fixation des dunes, bande enherbée, agroforesterie"
            legend="Paillage, fixation des dunes, bande enherbée, agroforesterie"
          />
        </div>
      </div>

      {/* Amendement */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 2 : Amélioration de la productivité des sols</h3>
        <div className="mt-8">
          <ContentBlock
            banner="Amendement — Santé des sols"
            imageSrc="/images/institut/axe2/amendement.png"
            imageAlt="Amendement : épandage PNM/Chaux, épandage MO, enfouissement — santé des sols"
            legend="Épandage PNM/Chaux, épandage MO, enfouissement"
          />
        </div>
      </div>

      {/* Recherche dispositif d'essai */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 2 : Amélioration de la productivité des sols</h3>
        <div className="mt-8">
          <ContentBlock
            banner="Recherche, dispositif d'essai : facteur amendement"
            imageSrc="/images/institut/axe2/recherche-dispositif-essai-amendement.png"
            imageAlt="Recherche INP : dispositif d'essai facteur amendement — schéma parcelles et essai en champ"
            legend="Dispositif d'essai — facteur amendement (parcelles, blocs)"
          />
        </div>
      </div>
    </div>
  );
}

function Axe3Content() {
  return (
    <div className="space-y-12">
      {/* Formation phosphatage/chaulage et compostage */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 3 : Renforcement des capacités des acteurs dans la GDT</h3>
        <div className="mt-8">
          <ContentBlock
            banner="Formation des producteurs — phosphatage/chaulage et compostage"
            imageSrc="/images/institut/axe3/formation-producteurs.png"
            imageAlt="Formation des producteurs : pratique du phosphatage/chaulage et pratique du compostage"
            legend="Pratique du phosphatage/chaulage et du compostage"
          />
        </div>
      </div>

      {/* Formation et pratiques GDT */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 3 : Renforcement des capacités des acteurs dans la GDT</h3>
        <div className="mt-8">
          <ContentBlock
            banner="Formation et pratiques GDT — diguette, demi-lune, cordon pierreux"
            imageSrc="/images/institut/axe3/formation-pratiques-gdt.png"
            imageAlt="Formation et pratiques GDT : diguette en pierres sèches, demi-lune avec zai, cordon pierreux, demi-lune classique"
            legend="Confection diguette en pierres sèches, demi-lune avec zai, cordon pierreux, demi-lune classique"
          />
        </div>
      </div>
    </div>
  );
}

function Axe4Content() {
  return (
    <div className="space-y-12">
      {/* Ateliers */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 4 : Coordination, Partenariat et communication</h3>
        <div className="mt-8">
          <ContentBlock
            banner="Ateliers — coordination, partenariat et communication"
            imageSrc="/images/institut/axe4/coordination-partenariat-communication.png"
            imageAlt="AXE 4 INP : ateliers de coordination, partenariat et communication — sessions plénières et travaux en groupe"
            legend="Sessions de travail et collaboration entre acteurs"
          />
        </div>
      </div>

      {/* Synergie / Convention / Communication */}
      <div>
        <h3 className="border-l-4 border-amber-700 pl-4 text-2xl font-semibold text-amber-900 md:text-3xl">AXE 4 : Coordination, Partenariat et communication</h3>
        <div className="mt-8">
          <ContentBlock
            banner="Synergie — Convention de partenariat — Communication"
            imageSrc="/images/institut/axe4/synergie-convention-communication.png"
            imageAlt="AXE 4 : Synergie, Convention de partenariat, Communication"
          >
            <div className="border-t-2 border-gray-200 bg-gray-50/80 px-6 py-6 md:px-8">
              <div className="space-y-6 text-sm text-gray-700 md:text-base">
                <div>
                  <p className="font-semibold uppercase tracking-wide text-amber-800">Synergie</p>
                  <p className="mt-1">Tous les services techniques, acteurs du développement, élus, autorités administratives, instituts.</p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-wide text-amber-800">Convention de partenariat</p>
                  <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    <span>FSRP</span><span>PDCVR</span><span>FNDAPS</span><span>Fond vert climat</span>
                    <span>PCAE</span><span>PIESAN</span><span>AGEROUTE</span><span>AUSO</span>
                    <span>FAO</span><span>PAM</span><span>SOGAS</span><span>OP</span><span>Ecoles</span>
                  </p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-wide text-amber-800">Communication</p>
                  <p className="mt-1">Tous les canaux.</p>
                </div>
              </div>
            </div>
          </ContentBlock>
        </div>
      </div>
    </div>
  );
}

const AXE_COMPONENTS: Record<AxeNumber, () => React.ReactNode> = {
  1: Axe1Content,
  2: Axe2Content,
  3: Axe3Content,
  4: Axe4Content,
};

/* ------------------------------------------------------------------ */
/*  Souligné tricolore (drapeau sénégalais) + étoile                   */
/* ------------------------------------------------------------------ */

function TricolorUnderline() {
  return (
    <span className="relative mt-4 block w-20">
      <span
        className="block h-[3px] w-full rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #00853F 0%, #00853F 33%, #FDEF42 33%, #FDEF42 66%, #E31B23 66%, #E31B23 100%)",
        }}
        aria-hidden="true"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <polygon
          fill="#00853F"
          points="50,10 61.8,38.2 92.2,38.2 67.2,57.3 79,85.5 50,67.5 21,85.5 32.8,57.3 7.8,38.2 38.2,38.2"
        />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Section principale                                                 */
/* ------------------------------------------------------------------ */

export function AxesInterventionSection() {
  return (
    <section className="bg-[#F6F5F2] py-20" aria-labelledby="axes-title">
      <div className="mx-auto max-w-6xl px-6">
        {/* Intro */}
        <div className="mb-12 text-center">
          <h2 id="axes-title" className="text-3xl font-bold text-[#5E3D20] sm:text-4xl">
            Axes d&apos;intervention
          </h2>
          <span className="mx-auto block w-20">
            <TricolorUnderline />
          </span>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#5A4733]">
            Quatre axes structurent l&apos;action de l&apos;INP, de la connaissance des sols
            jusqu&apos;à la coordination et au partenariat.
          </p>
        </div>

        {/* Grille 2×2 — cartes sommaire (toujours visibles) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {AXES_META.map((axe, i) => (
            <motion.a
              key={axe.num}
              href={`#${axe.anchor}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex flex-col rounded-2xl border border-[#E5DCC2] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A574] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)]"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#7B4F2A] transition-colors group-hover:bg-[#C9A574]/20">
                  <axe.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-[var(--inp-vert)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {axe.badge}
                </span>
                <span className="ml-auto text-2xl font-black text-amber-100 transition-colors group-hover:text-[#C9A574]">
                  0{axe.num}
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-[#2A1F18] transition-colors group-hover:text-[#7B4F2A]">
                {axe.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5A4733]">{axe.short}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7B4F2A]">
                Découvrir cet axe
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </motion.a>
          ))}
        </div>

        {/* Sections détaillées — contenu complet, toujours affiché (plus d'accordéon) */}
        <div className="mt-16 space-y-12">
          {AXES_META.map((axe) => {
            const AxeContent = AXE_COMPONENTS[axe.num];
            return (
              <motion.article
                key={axe.num}
                id={axe.anchor}
                className="scroll-mt-32 rounded-3xl border border-[#E5DCC2] bg-white p-6 shadow-sm md:p-10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
              >
                {/* En-tête de l'axe (badge + icône + titre + souligné tricolore) */}
                <header className="mb-8 border-b border-[#E5DCC2] pb-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-[#7B4F2A]">
                      <axe.icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="inline-block rounded-full bg-[var(--inp-vert)] px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                        {axe.badge}
                      </span>
                      <h3 className="mt-2 text-2xl font-bold leading-tight text-[#5E3D20] md:text-3xl">
                        {axe.title}
                      </h3>
                    </div>
                  </div>
                  <TricolorUnderline />
                </header>

                <AxeContent />
              </motion.article>
            );
          })}
        </div>

        {/* Liens de bas de page */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/institut/missions"
            className="inline-flex items-center gap-2 rounded-full border border-[#8A5E38] px-6 py-3 text-sm font-semibold text-[#5E3D20] transition-all hover:bg-amber-50"
          >
            Voir nos missions
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/institut/cadre-juridique"
            className="inline-flex items-center gap-2 rounded-full border border-[#8A5E38] px-6 py-3 text-sm font-semibold text-[#5E3D20] transition-all hover:bg-amber-50"
          >
            Cadre juridique
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
