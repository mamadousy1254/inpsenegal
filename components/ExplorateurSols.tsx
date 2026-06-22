"use client";

import { useState, useMemo } from "react";
import {
  demoSols,
  filtrerSols,
  compterFiltresActifs,
  FILTRES_VIDES,
  REGIONS_SENEGAL,
  TYPES_SOL,
  NIVEAUX_FERTILITE,
  RISQUES_EROSION,
  NIVEAUX_SALINISATION,
  USAGES_AGRICOLES,
  type FiltresSols,
  type TypeSol,
} from "@/lib/demoSols";

type CategorieFiltre = keyof FiltresSols;

export default function ExplorateurSols() {
  const [filtres, setFiltres] = useState<FiltresSols>(FILTRES_VIDES);
  const [solDetail, setSolDetail] = useState<TypeSol | null>(null);
  const [filtresOuvertsMobile, setFiltresOuvertsMobile] = useState(false);

  const resultats = useMemo(() => filtrerSols(demoSols, filtres), [filtres]);
  const nbFiltresActifs = compterFiltresActifs(filtres);

  const toggleFiltre = (categorie: CategorieFiltre, valeur: string) => {
    setFiltres((prev) => {
      const actuels = prev[categorie];
      const nouveaux = actuels.includes(valeur)
        ? actuels.filter((v) => v !== valeur)
        : [...actuels, valeur];
      return { ...prev, [categorie]: nouveaux };
    });
  };

  const reinitialiser = () => setFiltres(FILTRES_VIDES);

  return (
    <section className="container mx-auto px-4 py-12 max-w-6xl" aria-labelledby="explorateur-title">
      {/* En-tête section */}
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#C9A574] tracking-wider uppercase mb-2">
          Exploration
        </p>
        <h2 id="explorateur-title" className="text-3xl md:text-4xl font-bold text-[#7B4F2A]">
          Explorer les sols du Sénégal
        </h2>
        <p className="text-[#5A4733] mt-3 max-w-2xl mx-auto">
          Filtrez les grands types de sols par région, fertilité, risque d&apos;érosion,
          salinisation et usage agricole.
        </p>
      </div>

      {/* Bouton filtres mobile */}
      <button
        onClick={() => setFiltresOuvertsMobile((v) => !v)}
        className="lg:hidden w-full mb-4 flex items-center justify-between bg-white border border-[#E5DCC2] rounded-xl px-4 py-3 font-semibold text-[#7B4F2A]"
      >
        <span>🔎 Filtres {nbFiltresActifs > 0 && `(${nbFiltresActifs})`}</span>
        <span className={`transition-transform ${filtresOuvertsMobile ? "rotate-180" : ""}`}>⌄</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* ───── SIDEBAR FILTRES ───── */}
        <aside className={`${filtresOuvertsMobile ? "block" : "hidden"} lg:block`}>
          <div className="bg-white rounded-xl border border-[#E5DCC2] p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2A1F18]">Filtres</h3>
              {nbFiltresActifs > 0 && (
                <button
                  onClick={reinitialiser}
                  className="text-xs font-semibold text-[#7B4F2A] hover:text-[#4A2F1A] underline"
                >
                  Réinitialiser ({nbFiltresActifs})
                </button>
              )}
            </div>

            <div className="space-y-2">
              <GroupeFiltre titre="Type de sol" categorie="type" options={TYPES_SOL} filtres={filtres} onToggle={toggleFiltre} defaultOpen />
              <GroupeFiltre titre="Région" categorie="region" options={REGIONS_SENEGAL} filtres={filtres} onToggle={toggleFiltre} />
              <GroupeFiltre titre="Niveau de fertilité" categorie="fertilite" options={NIVEAUX_FERTILITE} filtres={filtres} onToggle={toggleFiltre} />
              <GroupeFiltre titre="Risque d'érosion" categorie="erosion" options={RISQUES_EROSION} filtres={filtres} onToggle={toggleFiltre} />
              <GroupeFiltre titre="Salinisation" categorie="salinisation" options={NIVEAUX_SALINISATION} filtres={filtres} onToggle={toggleFiltre} />
              <GroupeFiltre titre="Usage agricole" categorie="usage" options={USAGES_AGRICOLES} filtres={filtres} onToggle={toggleFiltre} />
            </div>
          </div>
        </aside>

        {/* ───── ZONE RÉSULTATS ───── */}
        <div>
          {/* Barre de résultats */}
          <div className="flex items-center justify-between mb-5 bg-[#F8F1E0] rounded-lg px-4 py-3">
            <p className="text-sm text-[#5A4733]">
              <strong className="text-[#7B4F2A]">{resultats.length}</strong> type{resultats.length > 1 ? "s" : ""} de sol
              {nbFiltresActifs > 0 ? ` correspond${resultats.length > 1 ? "ent" : ""} à votre sélection` : " au total"}
            </p>
            {nbFiltresActifs > 0 && (
              <button
                onClick={reinitialiser}
                className="text-xs font-semibold text-[#7B4F2A] hover:text-[#4A2F1A] hidden sm:block"
              >
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Résultats */}
          {resultats.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-[#E5DCC2]">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-[#5A4733] text-lg font-semibold mb-2">Aucun sol ne correspond</p>
              <p className="text-[#8B7355] text-sm mb-4">
                Essayez d&apos;élargir vos critères de recherche.
              </p>
              <button
                onClick={reinitialiser}
                className="inline-block bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-5 py-2 rounded-full text-sm font-semibold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resultats.map((sol) => (
                <SolCard key={sol.id} sol={sol} onVoirDetail={() => setSolDetail(sol)} />
              ))}
            </div>
          )}

          {/* Note honnêteté */}
          <div className="mt-6 p-4 bg-[#FBF3E2] border-l-4 border-[#C9A574] rounded text-sm text-[#7B4F2A]">
            <strong>Note :</strong> Caractérisations pédologiques générales fournies à titre
            indicatif. Pour des données parcellaires précises (analyses physico-chimiques,
            cartographie détaillée), adressez une demande d&apos;analyse à l&apos;INP.
          </div>
        </div>
      </div>

      {/* Modal détail */}
      {solDetail && <SolDetailModal sol={solDetail} onClose={() => setSolDetail(null)} />}
    </section>
  );
}

// ───── Groupe de filtre repliable ─────
function GroupeFiltre({
  titre,
  categorie,
  options,
  filtres,
  onToggle,
  defaultOpen = false,
}: {
  titre: string;
  categorie: CategorieFiltre;
  options: readonly string[];
  filtres: FiltresSols;
  onToggle: (cat: CategorieFiltre, val: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const nbActifs = filtres[categorie].length;

  return (
    <div className="border border-[#E5DCC2] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#F8F1E0] transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#2A1F18]">
          {titre}
          {nbActifs > 0 && (
            <span className="ml-2 text-xs bg-[#7B4F2A] text-white px-1.5 py-0.5 rounded-full">{nbActifs}</span>
          )}
        </span>
        <span className={`text-[#7B4F2A] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 space-y-1.5 max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filtres[categorie].includes(opt)}
                onChange={() => onToggle(categorie, opt)}
                className="w-4 h-4 rounded border-[#C9A574] text-[#7B4F2A] focus:ring-[#7B4F2A]/30 accent-[#7B4F2A]"
              />
              <span className="text-sm text-[#5A4733] group-hover:text-[#2A1F18]">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ───── Carte de sol ─────
function SolCard({ sol, onVoirDetail }: { sol: TypeSol; onVoirDetail: () => void }) {
  return (
    <article className="bg-white rounded-xl border border-[#E5DCC2] overflow-hidden hover:shadow-md hover:border-[#C9A574] transition-all flex flex-col">
      {/* Bandeau couleur */}
      <div className="h-2" style={{ backgroundColor: sol.couleur }} />

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-[#2A1F18] text-lg leading-tight mb-2">{sol.nom}</h3>
        <p className="text-sm text-[#5A4733] leading-relaxed mb-4 flex-1">{sol.description}</p>

        {/* Attributs */}
        <div className="space-y-2 mb-4">
          <AttributLigne label="Fertilité" valeur={sol.fertilite} />
          <AttributLigne label="Érosion" valeur={sol.erosion} />
          <AttributLigne label="Salinisation" valeur={sol.salinisation} />
        </div>

        {/* Régions */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-[#8B7355] uppercase tracking-wider mb-1.5">Régions</p>
          <div className="flex flex-wrap gap-1">
            {sol.regions.map((r) => (
              <span key={r} className="text-xs bg-[#F8F1E0] text-[#5A4733] px-2 py-0.5 rounded-full">
                📍 {r}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onVoirDetail}
          className="mt-auto w-full bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white text-sm font-semibold py-2 rounded-full transition-colors"
        >
          Voir la fiche détaillée
        </button>
      </div>
    </article>
  );
}

function AttributLigne({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#8B7355]">{label}</span>
      <span className="font-semibold text-[#2A1F18]">{valeur}</span>
    </div>
  );
}

// ───── Modal détail d'un sol ─────
function SolDetailModal({ sol, onClose }: { sol: TypeSol; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2" style={{ backgroundColor: sol.couleur }} />
        <div className="sticky top-0 bg-white border-b border-[#E5DCC2] p-5 flex items-start justify-between gap-4">
          <h3 className="font-bold text-xl text-[#2A1F18]">{sol.nom}</h3>
          <button onClick={onClose} className="text-[#8B7355] hover:text-[#2A1F18] text-2xl leading-none flex-shrink-0" aria-label="Fermer">×</button>
        </div>

        <div className="p-5">
          <p className="text-sm text-[#5A4733] leading-relaxed mb-5">{sol.caracteristiques}</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <CarteAttribut label="Niveau de fertilité" valeur={sol.fertilite} />
            <CarteAttribut label="Risque d'érosion" valeur={sol.erosion} />
            <CarteAttribut label="Salinisation" valeur={sol.salinisation} />
            <CarteAttribut label="Régions" valeur={`${sol.regions.length} régions`} />
          </div>

          <div className="mb-5">
            <p className="text-xs font-bold text-[#C9A574] uppercase tracking-wider mb-2">Régions concernées</p>
            <div className="flex flex-wrap gap-1.5">
              {sol.regions.map((r) => (
                <span key={r} className="text-sm bg-[#F8F1E0] text-[#5A4733] px-2.5 py-1 rounded-full">📍 {r}</span>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-bold text-[#C9A574] uppercase tracking-wider mb-2">Usages agricoles</p>
            <div className="flex flex-wrap gap-1.5">
              {sol.usages.map((u) => (
                <span key={u} className="text-sm bg-[#5A6F47]/10 text-[#5A6F47] px-2.5 py-1 rounded-full font-medium">🌱 {u}</span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5DCC2]">
            <a
              href="/demande-analyse"
              className="inline-flex items-center gap-2 bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              🧪 Demander une analyse de sol
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarteAttribut({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="bg-[#F8F1E0] rounded-lg p-3">
      <p className="text-xs text-[#8B7355] mb-1">{label}</p>
      <p className="font-bold text-[#2A1F18]">{valeur}</p>
    </div>
  );
}
