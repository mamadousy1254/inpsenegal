"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Maximize2 } from "lucide-react";

interface Projet {
  title: string;
  image: string;
  alt: string;
}

const projets: Projet[] = [
  {
    title: "Cartographie détaillée des sols de la vallée du fleuve Sénégal",
    image: "/projets/projet-cartographie-vallee-fleuve-senegal.png",
    alt: "Poster INP — Cartographie détaillée des sols de la vallée du fleuve Sénégal",
  },
  {
    title: "Évaluation de la fertilité des sols en zone arachidière",
    image: "/projets/projet-fertilite-zone-arachidiere.png",
    alt: "Poster INP — Évaluation de la fertilité des sols en zone arachidière",
  },
  {
    title: "Restauration des terres dégradées au Sahel",
    image: "/projets/projet-restauration-terres-sahel.png",
    alt: "Poster INP — Restauration des terres dégradées au Sahel",
  },
  {
    title: "Impact du changement climatique sur les sols agricoles",
    image: "/projets/projet-impact-changement-climatique.png",
    alt: "Poster INP — Impact du changement climatique sur les sols agricoles",
  },
  {
    title: "Base de données pédologiques nationale numérique",
    image: "/projets/projet-base-donnees-pedologiques.png",
    alt: "Poster INP — Base de données pédologiques nationale numérique",
  },
  {
    title: "Systèmes innovants de gestion durable des terres",
    image: "/projets/projet-systemes-innovants-gdt.png",
    alt: "Poster INP — Systèmes innovants de gestion durable des terres",
  },
];

export default function ProjetsPosters() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? projets[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);

  // Fermeture au clavier (Échap) + blocage du scroll de fond quand la lightbox est ouverte
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close]);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-10">
        {projets.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Agrandir le poster : ${item.title}`}
            className="group relative block w-full overflow-hidden rounded-2xl text-left shadow-2xl cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
          >
            <Image
              src={item.image}
              alt={item.alt}
              width={600}
              height={400}
              className="w-full h-64 object-cover object-top transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#4A2F1A]/90 via-[#7B4F2A]/60 to-transparent" />

            {/* Indice « agrandir » au survol */}
            <span className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </span>

            <div className="absolute bottom-0 p-6 z-10 text-left">
              <h3 className="text-lg font-semibold leading-snug text-white">{item.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox plein écran */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={close}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          {/* Bouton fermer */}
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Poster en grand (scroll si très grand) */}
          <div
            className="max-h-[88vh] w-full max-w-6xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.image}
              alt={active.alt}
              width={1536}
              height={1024}
              className="mx-auto h-auto w-full object-contain"
              sizes="(max-width: 1152px) 100vw, 1152px"
              unoptimized
              priority
            />
          </div>

          <p className="mt-4 max-w-3xl text-center text-sm text-white/80">
            {active.title}
          </p>
          <p className="mt-1 text-xs text-white/50">
            Cliquez en dehors de l&apos;image ou appuyez sur Échap pour fermer.
          </p>
        </div>
      )}
    </>
  );
}
