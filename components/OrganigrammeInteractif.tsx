"use client";

import { useState } from "react";
import Image from "next/image";
import {
  demoOrganisation,
  niveauLabels,
  niveauColors,
  getPostesByNiveau,
  type NiveauHierarchique,
  type PosteOrganisation,
} from "@/lib/demoOrganisation";

const NIVEAUX_ORDER: NiveauHierarchique[] = [
  "direction",
  "division-technique",
  "support",
  "territorial",
  "laboratoire",
];

export default function OrganigrammeInteractif() {
  const [selectedPoste, setSelectedPoste] = useState<PosteOrganisation | null>(null);

  return (
    <div>
      {/* ───── ORGANIGRAMME VISUEL INTERACTIF ───── */}
      <div className="bg-white rounded-xl border border-[#E5DCC2] p-6 md:p-10 shadow-sm overflow-x-auto mb-12">
        <div className="min-w-[640px]">
          {/* DG */}
          <div className="flex justify-center mb-1">
            <OrgNode
              poste={demoOrganisation.find((p) => p.id === "directeur-general")!}
              onClick={setSelectedPoste}
              highlight
            />
          </div>
          <Connector />

          {/* CST + DT */}
          <div className="flex justify-center gap-6 mb-1">
            <OrgNode
              poste={demoOrganisation.find((p) => p.id === "conseiller-scientifique-technique")!}
              onClick={setSelectedPoste}
            />
            <OrgNode
              poste={demoOrganisation.find((p) => p.id === "directeur-technique")!}
              onClick={setSelectedPoste}
            />
          </div>
          <Connector color="#5A6F47" />

          {/* Divisions techniques */}
          <SectionLabel label="Divisions techniques" color="#5A6F47" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            {getPostesByNiveau("division-technique").map((poste) => (
              <OrgNodeSmall key={poste.id} poste={poste} onClick={setSelectedPoste} variant="technique" />
            ))}
          </div>

          {/* Support */}
          <SectionLabel label="Support administratif & financier" color="#C9A574" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {getPostesByNiveau("support").map((poste) => (
              <OrgNodeSmall key={poste.id} poste={poste} onClick={setSelectedPoste} variant="support" />
            ))}
          </div>

          {/* Territorial */}
          <SectionLabel label="Réseau territorial" color="#9B59B6" />
          <div className="grid grid-cols-2 gap-2 mb-6 max-w-md mx-auto">
            {getPostesByNiveau("territorial").map((poste) => (
              <OrgNodeSmall key={poste.id} poste={poste} onClick={setSelectedPoste} variant="territorial" />
            ))}
          </div>

          {/* Laboratoires */}
          <SectionLabel label="Laboratoires" color="#1877F2" />
          <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
            {getPostesByNiveau("laboratoire").map((poste) => (
              <OrgNodeSmall key={poste.id} poste={poste} onClick={setSelectedPoste} variant="laboratoire" />
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#8B7355] mt-6 italic">
          💡 Cliquez sur une fonction pour découvrir sa finalité et ses missions détaillées.
        </p>
      </div>

      {/* ───── MODAL / PANNEAU DE DÉTAIL ───── */}
      {selectedPoste && (
        <PosteDetailModal poste={selectedPoste} onClose={() => setSelectedPoste(null)} />
      )}

      {/* ───── ACCORDÉON DÉTAILLÉ PAR NIVEAU ───── */}
      <div>
        <h3 className="text-2xl font-bold text-[#7B4F2A] text-center mb-2">
          Missions détaillées par fonction
        </h3>
        <p className="text-center text-[#5A4733] text-sm mb-8">
          Toutes les fonctions et leurs missions officielles.
        </p>

        {NIVEAUX_ORDER.map((niveau) => {
          const postes = getPostesByNiveau(niveau);
          if (postes.length === 0) return null;
          return (
            <div key={niveau} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${niveauColors[niveau]}`}>
                  {niveauLabels[niveau]}
                </span>
                <div className="flex-1 h-px bg-[#E5DCC2]" />
              </div>
              <div className="space-y-3">
                {postes.map((poste) => (
                  <PosteAccordion key={poste.id} poste={poste} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Connector({ color = "#C9A574" }: { color?: string }) {
  return (
    <div className="flex justify-center">
      <div className="w-px h-6" style={{ backgroundColor: color }} />
    </div>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <p className="text-center text-xs font-bold uppercase tracking-wider mb-3" style={{ color }}>
      {label}
    </p>
  );
}

function OrgNode({
  poste,
  onClick,
  highlight,
}: {
  poste: PosteOrganisation;
  onClick: (p: PosteOrganisation) => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={() => onClick(poste)}
      className={`rounded-xl border-2 p-4 text-center min-w-[180px] transition-all hover:scale-105 hover:shadow-md cursor-pointer ${
        highlight
          ? "bg-[#7B4F2A] border-[#C9A574] text-white"
          : "bg-[#F8F1E0] border-[#E5DCC2] text-[#2A1F18] hover:border-[#C9A574]"
      }`}
    >
      {poste.photo && (
        <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-2 border-[#C9A574]">
          <Image src={poste.photo} alt={poste.titulaire || poste.intitule} fill className="object-cover" sizes="64px" />
        </div>
      )}
      <p className={`font-bold text-sm leading-tight ${highlight ? "text-white" : ""}`}>
        {poste.acronyme || poste.intitule}
      </p>
      {poste.acronyme && (
        <p className={`text-xs mt-0.5 leading-tight ${highlight ? "text-white/80" : "text-[#5A4733]"}`}>
          {poste.intitule}
        </p>
      )}
      {poste.titulaire && (
        <p className={`text-xs mt-1 ${highlight ? "text-[#C9A574]" : "text-[#7B4F2A]"}`}>
          {poste.titulaire}
        </p>
      )}
    </button>
  );
}

function OrgNodeSmall({
  poste,
  onClick,
  variant,
}: {
  poste: PosteOrganisation;
  onClick: (p: PosteOrganisation) => void;
  variant: "technique" | "support" | "territorial" | "laboratoire";
}) {
  const borderColors = {
    technique: "border-[#5A6F47] hover:bg-[#5A6F47]",
    support: "border-[#C9A574] hover:bg-[#C9A574]",
    territorial: "border-[#9B59B6] hover:bg-[#9B59B6]",
    laboratoire: "border-[#1877F2] hover:bg-[#1877F2]",
  };
  return (
    <button
      onClick={() => onClick(poste)}
      className={`group bg-white rounded-lg border ${borderColors[variant]} p-2.5 text-center transition-all hover:shadow-md cursor-pointer`}
    >
      <p className="text-xs font-semibold text-[#2A1F18] leading-tight group-hover:text-white">
        {poste.acronyme || poste.intitule}
      </p>
      {poste.acronyme && (
        <p className="text-[10px] text-[#8B7355] leading-tight mt-0.5 group-hover:text-white/80 line-clamp-2">
          {poste.intitule}
        </p>
      )}
    </button>
  );
}

function PosteDetailModal({
  poste,
  onClose,
}: {
  poste: PosteOrganisation;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#7B4F2A] text-white p-5 flex items-start justify-between gap-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            {poste.photo && (
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C9A574]">
                <Image src={poste.photo} alt={poste.titulaire || poste.intitule} fill className="object-cover" sizes="56px" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg leading-tight">{poste.intitule}</h3>
              {poste.titulaire ? (
                <p className="text-sm text-[#C9A574]">{poste.titulaire}</p>
              ) : (
                <p className="text-xs text-white/70 italic">Titulaire à préciser</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none flex-shrink-0"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {poste.rattachement && (
            <p className="text-xs text-[#8B7355] mb-4">
              Rattaché à : <strong className="text-[#5A4733]">{poste.rattachement}</strong>
            </p>
          )}

          <div className="mb-5">
            <p className="text-xs font-bold text-[#C9A574] uppercase tracking-wider mb-2">
              Finalité du poste
            </p>
            <p className="text-sm text-[#5A4733] leading-relaxed">{poste.finalite}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-[#C9A574] uppercase tracking-wider mb-2">
              Missions principales
            </p>
            <ul className="space-y-1.5">
              {poste.missions.map((mission, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#2A1F18]">
                  <span className="text-[#5A6F47] mt-1 flex-shrink-0" aria-hidden="true">▸</span>
                  <span className="leading-relaxed">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PosteAccordion({ poste }: { poste: PosteOrganisation }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#E5DCC2] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left hover:bg-[#F8F1E0] transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {poste.photo ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C9A574]">
              <Image src={poste.photo} alt={poste.titulaire || poste.intitule} fill className="object-cover" sizes="48px" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#F8F1E0] border border-[#E5DCC2] flex items-center justify-center flex-shrink-0">
              <span className="text-[#7B4F2A] font-bold text-sm">
                {poste.acronyme || poste.intitule.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#2A1F18] text-base leading-tight">{poste.intitule}</h4>
            {poste.titulaire ? (
              <p className="text-sm text-[#7B4F2A] font-semibold">{poste.titulaire}</p>
            ) : (
              <p className="text-xs text-[#8B7355] italic">Titulaire à préciser</p>
            )}
          </div>
        </div>
        <span
          className={`text-[#7B4F2A] text-xl flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>

      {open && (
        <div className="px-4 md:px-5 pb-5 border-t border-[#E5DCC2]">
          {poste.rattachement && (
            <p className="text-xs text-[#8B7355] pt-3 mb-3">
              Rattaché à : <strong className="text-[#5A4733]">{poste.rattachement}</strong>
            </p>
          )}
          <div className="pt-2 mb-4">
            <p className="text-xs font-bold text-[#C9A574] uppercase tracking-wider mb-2">Finalité du poste</p>
            <p className="text-sm text-[#5A4733] leading-relaxed">{poste.finalite}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#C9A574] uppercase tracking-wider mb-2">Missions principales</p>
            <ul className="space-y-1.5">
              {poste.missions.map((mission, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[#2A1F18]">
                  <span className="text-[#5A6F47] mt-1 flex-shrink-0" aria-hidden="true">▸</span>
                  <span className="leading-relaxed">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
