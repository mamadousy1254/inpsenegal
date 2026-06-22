"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { submitCandidature, type CandidatureFormData } from "@/lib/api/candidature";
import type { PublicRecrutementItem } from "@/lib/services/recrutement/serialize-recrutement";

const NATIONALITES = ["Sénégalaise", "Autre nationalité"];

const NIVEAUX_ETUDE = [
  "Baccalauréat",
  "Bac+2 (DUT/BTS)",
  "Bac+3 (Licence)",
  "Bac+5 (Master / Ingénieur)",
  "Bac+8 (Doctorat / PhD)",
];

const EXPERIENCES = [
  "Aucune expérience",
  "Moins de 2 ans",
  "2 à 5 ans",
  "5 à 10 ans",
  "Plus de 10 ans",
];

const DOMAINES = [
  "Agronomie / Pédologie",
  "Laboratoire / Analyse",
  "SIG / Cartographie",
  "Recherche scientifique",
  "Administration / Gestion",
  "Logistique / Terrain",
  "Communication",
  "Informatique",
  "Autre",
];

export default function PostulerPage() {
  const params = useParams();
  const slug = params.slug as string;

  const isSpontanee = slug === "spontanee";
  const [offre, setOffre] = useState<PublicRecrutementItem | null>(null);
  const [offreLoading, setOffreLoading] = useState(!isSpontanee);
  const [offreMissing, setOffreMissing] = useState(false);

  useEffect(() => {
    if (isSpontanee) return;

    let cancelled = false;
    setOffreLoading(true);
    fetch(`/api/recrutements/${slug}`)
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setOffreMissing(true);
          setOffre(null);
          return;
        }
        const data = await res.json();
        setOffre(data.item);
        setOffreMissing(false);
      })
      .catch(() => {
        if (!cancelled) setOffreMissing(true);
      })
      .finally(() => {
        if (!cancelled) setOffreLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, isSpontanee]);

  const isOffreValide = isSpontanee || (!offreLoading && !offreMissing && offre !== null);

  const [formData, setFormData] = useState<CandidatureFormData>({
    offreSlug: slug,
    offreReference: undefined,
    offreTitle: undefined,
    civilite: "M.",
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "Sénégalaise",
    adresse: "",
    telephone: "",
    email: "",
    niveauEtude: "",
    domaineExpertise: "",
    anneesExperience: "",
    cv: null,
    lettreMotivation: null,
    message: "",
    consentementDonnees: false,
  });

  useEffect(() => {
    if (!offre) return;
    setFormData((prev) => ({
      ...prev,
      offreReference: offre.references,
      offreTitle: offre.title,
    }));
  }, [offre]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    reference?: string;
    error?: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Chargement ou offre invalide
  if (offreLoading) {
    return (
      <main className="min-h-[70vh] bg-[#F8F1E0] flex items-center justify-center">
        <p className="text-[#5A4733]">Chargement de l&apos;offre…</p>
      </main>
    );
  }

  if (!isOffreValide) {
    return (
      <main className="min-h-[70vh] bg-[#F8F1E0]">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <Link
            href="/candidature-spontanee"
            className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-8 font-medium"
          >
            ← Retour aux recrutements
          </Link>
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 border border-[#E5DCC2] text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#7B4F2A] mb-4">
              Offre introuvable
            </h1>
            <p className="text-[#2A1F18] mb-6">
              L&apos;offre demandée n&apos;existe pas ou a été retirée. Consultez la liste des
              opportunités actuelles.
            </p>
            <Link
              href="/candidature-spontanee"
              className="inline-block bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-6 py-3 rounded-full font-medium"
            >
              Voir les offres actuelles
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ────────────────────────────────────────────────
  // Page de confirmation (après envoi réussi)
  // ────────────────────────────────────────────────
  if (submitResult?.success) {
    return (
      <main className="min-h-[70vh] bg-[#F8F1E0]">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] overflow-hidden">
            <div className="h-2 w-full bg-[#5A6F47]" />
            <div className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5A6F47]/10 mb-6">
                <span className="text-3xl">✓</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2A1F18] mb-4">
                Candidature enregistrée
              </h1>
              <p className="text-[#5A4733] text-base md:text-lg leading-relaxed mb-6">
                Votre dossier a été reçu par les services des Ressources Humaines de
                l&apos;Institut national de Pédologie.
              </p>

              <div className="bg-[#F8F1E0] rounded-lg p-6 mb-6 inline-block">
                <p className="text-xs text-[#5A4733] uppercase tracking-wider mb-2">
                  Numéro de référence
                </p>
                <p className="text-xl md:text-2xl font-bold text-[#7B4F2A] font-mono tracking-wider">
                  {submitResult.reference}
                </p>
                <p className="text-xs text-[#5A4733] mt-2 italic">
                  Conservez précieusement ce numéro
                </p>
              </div>

              <div className="text-sm text-[#5A4733] leading-relaxed mb-8 max-w-xl mx-auto">
                <p className="mb-2">
                  📧 Un email de confirmation vous sera envoyé à l&apos;adresse{" "}
                  <span className="font-semibold text-[#2A1F18]">{formData.email}</span>{" "}
                  sous 48 heures ouvrées.
                </p>
                <p>
                  📞 Les services RH vous contacteront si votre profil correspond
                  aux besoins de l&apos;Institut.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/candidature-spontanee"
                  className="inline-block bg-[#7B4F2A] hover:bg-[#4A2F1A] text-white px-6 py-3 rounded-full font-medium"
                >
                  Voir d&apos;autres offres
                </Link>
                <Link
                  href="/"
                  className="inline-block bg-white hover:bg-[#F8F1E0] text-[#7B4F2A] border-2 border-[#7B4F2A] px-6 py-3 rounded-full font-medium"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ────────────────────────────────────────────────
  // Validation du formulaire
  // ────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire";
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est obligatoire";
    if (!formData.lieuNaissance.trim()) newErrors.lieuNaissance = "Le lieu de naissance est obligatoire";
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est obligatoire";

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est obligatoire";
    } else if (!/^(\+221\s?)?[0-9\s]{9,15}$/.test(formData.telephone.replace(/\s/g, ""))) {
      newErrors.telephone = "Format invalide (ex: +221 77 123 45 67)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.niveauEtude) newErrors.niveauEtude = "Le niveau d'étude est obligatoire";
    if (!formData.domaineExpertise) newErrors.domaineExpertise = "Le domaine est obligatoire";
    if (!formData.anneesExperience) newErrors.anneesExperience = "L'expérience est obligatoire";

    if (!formData.cv) {
      newErrors.cv = "Le CV est obligatoire";
    } else if (formData.cv.size > 5 * 1024 * 1024) {
      newErrors.cv = "Le CV ne doit pas dépasser 5 Mo";
    } else if (!formData.cv.name.toLowerCase().endsWith(".pdf")) {
      newErrors.cv = "Le CV doit être au format PDF";
    }

    if (formData.lettreMotivation && formData.lettreMotivation.size > 5 * 1024 * 1024) {
      newErrors.lettreMotivation = "La lettre ne doit pas dépasser 5 Mo";
    }
    if (formData.lettreMotivation && !formData.lettreMotivation.name.toLowerCase().endsWith(".pdf")) {
      newErrors.lettreMotivation = "La lettre doit être au format PDF";
    }

    if (!formData.consentementDonnees) {
      newErrors.consentementDonnees = "Vous devez accepter le traitement de vos données";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ────────────────────────────────────────────────
  // Soumission du formulaire
  // ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    const result = await submitCandidature(formData);
    setIsSubmitting(false);
    setSubmitResult(result);

    if (result.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ────────────────────────────────────────────────
  // Rendu du formulaire
  // ────────────────────────────────────────────────
  const titleOffre = isSpontanee
    ? "Candidature spontanée"
    : offre?.title.replace("[Exemple] ", "") || "Candidature";

  const refOffre = isSpontanee ? "Candidature spontanée" : offre?.references;

  return (
    <main className="min-h-[70vh] bg-[#F8F1E0]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Fil d'Ariane */}
        <Link
          href="/candidature-spontanee"
          className="inline-flex items-center text-[#7B4F2A] hover:text-[#4A2F1A] mb-6 font-medium"
        >
          ← Retour aux offres
        </Link>

        {/* En-tête */}
        <header className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] overflow-hidden mb-8">
          <div className="h-2 w-full bg-[#7B4F2A]" />
          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold text-[#C9A574] tracking-wider uppercase mb-2">
              Formulaire de candidature
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2A1F18] mb-2">
              {titleOffre}
            </h1>
            {refOffre && refOffre !== "Candidature spontanée" && (
              <p className="text-sm text-[#5A4733] font-mono">
                Référence : <span className="font-bold">{refOffre}</span>
              </p>
            )}
            {isSpontanee && (
              <p className="text-sm text-[#5A4733]">
                Envoyez votre candidature sans poste précis. Les services RH étudieront
                votre profil pour les besoins futurs de l&apos;Institut.
              </p>
            )}
          </div>
        </header>

        {/* Erreur globale */}
        {submitResult?.error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded mb-6">
            <p className="font-bold mb-1">Erreur</p>
            <p className="text-sm">{submitResult.error}</p>
          </div>
        )}

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-[#E5DCC2] p-6 md:p-10 space-y-8"
        >
          {/* ─── Identité ─── */}
          <fieldset>
            <legend className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574] w-full">
              Identité du candidat
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Civilité *
                </label>
                <select
                  value={formData.civilite}
                  onChange={(e) =>
                    setFormData({ ...formData, civilite: e.target.value as "M." | "Mme" | "Mlle" })
                  }
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                >
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Mlle">Mlle</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                />
                {errors.nom && <p className="text-red-600 text-xs mt-1">{errors.nom}</p>}
              </div>

              <div className="md:col-span-5">
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                />
                {errors.prenom && <p className="text-red-600 text-xs mt-1">{errors.prenom}</p>}
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                />
                {errors.dateNaissance && (
                  <p className="text-red-600 text-xs mt-1">{errors.dateNaissance}</p>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Lieu de naissance *
                </label>
                <input
                  type="text"
                  value={formData.lieuNaissance}
                  onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
                  placeholder="Ville, Pays"
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                />
                {errors.lieuNaissance && (
                  <p className="text-red-600 text-xs mt-1">{errors.lieuNaissance}</p>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Nationalité *
                </label>
                <select
                  value={formData.nationalite}
                  onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                >
                  {NATIONALITES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* ─── Coordonnées ─── */}
          <fieldset>
            <legend className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574] w-full">
              Coordonnées
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Adresse postale *
                </label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="Rue, Ville, Pays"
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                />
                {errors.adresse && <p className="text-red-600 text-xs mt-1">{errors.adresse}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  placeholder="+221 77 123 45 67"
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                />
                {errors.telephone && (
                  <p className="text-red-600 text-xs mt-1">{errors.telephone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="exemple@email.com"
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </fieldset>

          {/* ─── Profil professionnel ─── */}
          <fieldset>
            <legend className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574] w-full">
              Profil professionnel
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Niveau d&apos;étude *
                </label>
                <select
                  value={formData.niveauEtude}
                  onChange={(e) => setFormData({ ...formData, niveauEtude: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                >
                  <option value="">Sélectionnez</option>
                  {NIVEAUX_ETUDE.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                {errors.niveauEtude && (
                  <p className="text-red-600 text-xs mt-1">{errors.niveauEtude}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Domaine d&apos;expertise *
                </label>
                <select
                  value={formData.domaineExpertise}
                  onChange={(e) =>
                    setFormData({ ...formData, domaineExpertise: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                >
                  <option value="">Sélectionnez</option>
                  {DOMAINES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.domaineExpertise && (
                  <p className="text-red-600 text-xs mt-1">{errors.domaineExpertise}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Années d&apos;expérience *
                </label>
                <select
                  value={formData.anneesExperience}
                  onChange={(e) =>
                    setFormData({ ...formData, anneesExperience: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20"
                >
                  <option value="">Sélectionnez</option>
                  {EXPERIENCES.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
                {errors.anneesExperience && (
                  <p className="text-red-600 text-xs mt-1">{errors.anneesExperience}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* ─── Pièces jointes ─── */}
          <fieldset>
            <legend className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574] w-full">
              Pièces du dossier
            </legend>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Curriculum Vitae (PDF, max 5 Mo) *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFormData({ ...formData, cv: e.target.files?.[0] || null })
                  }
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7B4F2A] file:text-white hover:file:bg-[#4A2F1A] file:cursor-pointer cursor-pointer"
                />
                {formData.cv && (
                  <p className="text-xs text-[#5A6F47] mt-1">
                    ✓ {formData.cv.name} ({(formData.cv.size / 1024 / 1024).toFixed(2)} Mo)
                  </p>
                )}
                {errors.cv && <p className="text-red-600 text-xs mt-1">{errors.cv}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5A4733] mb-1">
                  Lettre de motivation (PDF, max 5 Mo)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lettreMotivation: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E5DCC2] rounded text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#7B4F2A] file:text-white hover:file:bg-[#4A2F1A] file:cursor-pointer cursor-pointer"
                />
                {formData.lettreMotivation && (
                  <p className="text-xs text-[#5A6F47] mt-1">
                    ✓ {formData.lettreMotivation.name} (
                    {(formData.lettreMotivation.size / 1024 / 1024).toFixed(2)} Mo)
                  </p>
                )}
                {errors.lettreMotivation && (
                  <p className="text-red-600 text-xs mt-1">{errors.lettreMotivation}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* ─── Message ─── */}
          <fieldset>
            <legend className="text-xl font-bold text-[#7B4F2A] mb-4 pb-2 border-b-2 border-[#C9A574] w-full">
              Message complémentaire
            </legend>

            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              placeholder="Ajoutez ici toute information complémentaire que vous jugez utile (facultatif)..."
              className="w-full px-3 py-2 border border-[#E5DCC2] rounded focus:border-[#7B4F2A] focus:outline-none focus:ring-2 focus:ring-[#7B4F2A]/20 resize-none"
            />
          </fieldset>

          {/* ─── Consentement RGPD ─── */}
          <div className="bg-[#F8F1E0] rounded-lg p-4 border border-[#E5DCC2]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentementDonnees}
                onChange={(e) =>
                  setFormData({ ...formData, consentementDonnees: e.target.checked })
                }
                className="mt-1 w-4 h-4 text-[#7B4F2A] border-[#C9A574] rounded focus:ring-[#7B4F2A] cursor-pointer"
              />
              <span className="text-sm text-[#2A1F18]">
                * J&apos;autorise l&apos;Institut national de Pédologie à conserver et traiter
                mes données personnelles dans le cadre du processus de recrutement.
                Mes données ne seront utilisées qu&apos;à cette fin et conservées conformément
                à la législation sénégalaise sur la protection des données personnelles.
              </span>
            </label>
            {errors.consentementDonnees && (
              <p className="text-red-600 text-xs mt-2 ml-7">{errors.consentementDonnees}</p>
            )}
          </div>

          {/* ─── Bouton submit ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5DCC2]">
            <p className="text-xs text-[#5A4733] italic">* Champs obligatoires</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#7B4F2A] hover:bg-[#4A2F1A] disabled:bg-[#8B7355] disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer ma candidature
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Note technique en bas */}
        <div className="mt-6 p-4 bg-[#FBF3E2] border-l-4 border-[#C9A574] rounded text-xs text-[#7B4F2A]">
          <strong>Note :</strong> Vos données sont traitées de manière confidentielle.
          Le numéro de référence généré à la soumission vous permettra de suivre votre
          candidature.
        </div>
      </div>
    </main>
  );
}
