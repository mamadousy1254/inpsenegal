// Référentiel & logique métier du formulaire « Demande d'analyse de sol » (INP)
// Front-end uniquement : options, mappings, validation. Aucune dépendance backend ici.

/* ------------------------------------------------------------------ */
/*  Drapeau de configuration — facturation                            */
/* ------------------------------------------------------------------ */
// La facturation des analyses est DÉSACTIVÉE pour l'instant (décision en attente).
// Le code est conçu pour brancher plus tard un récapitulatif de coût + un mode de
// paiement (Wave / Orange Money / virement / paiement au dépôt) SANS refonte :
// il suffira de passer ce drapeau à true et de renseigner COUTS_ANALYSE.
export const FACTURATION_ACTIVE = false;

// Grille de coûts indicative (FCFA) — utilisée seulement si FACTURATION_ACTIVE = true.
export const COUTS_ANALYSE: Record<string, number> = {
  "Analyse physico-chimique": 0,
  "Analyse fertilité (NPK)": 0,
  "Analyse granulométrique": 0,
  "Analyse salinité": 0,
  "Analyse pH": 0,
  "Analyse complète": 0,
};

// Délai indicatif de traitement (affiché à l'étape 4, sans coût).
export const DELAI_INDICATIF = "Délai estimé de traitement : 10 à 15 jours ouvrés après réception des échantillons.";

/* ------------------------------------------------------------------ */
/*  Options des champs                                                 */
/* ------------------------------------------------------------------ */

export const REQUESTER_TYPES = [
  "Producteur / Exploitant agricole",
  "Coopérative / GIE / OP",
  "Entreprise agricole ou agro-industrie",
  "ONG / Projet / Programme",
  "Institution publique / Collectivité",
  "Chercheur / Étudiant",
  "Autre",
] as const;

// Le champ « Nom de la structure » est requis pour tous les types SAUF celui-ci.
export const TYPE_PRODUCTEUR = "Producteur / Exploitant agricole";

export const DELEGATIONS = [
  "Niayes",
  "Fleuve",
  "Sylvo-pastorale",
  "Bassin arachidier",
  "Sédhiou",
  "Ziguinchor",
  "Tamba",
  "Kédougou",
] as const;

// Pré-sélection de la délégation à partir de la région choisie (modifiable par l'utilisateur).
export const REGION_TO_DELEGATION: Record<string, string> = {
  Dakar: "Niayes",
  Thiès: "Niayes",
  "Saint-Louis": "Fleuve",
  Matam: "Fleuve",
  Louga: "Sylvo-pastorale",
  Diourbel: "Bassin arachidier",
  Fatick: "Bassin arachidier",
  Kaolack: "Bassin arachidier",
  Kaffrine: "Bassin arachidier",
  Tambacounda: "Tamba",
  Kédougou: "Kédougou",
  Kolda: "Sédhiou",
  Sédhiou: "Sédhiou",
  Ziguinchor: "Ziguinchor",
};

export const OBJECTIFS = [
  "Diagnostic de fertilité",
  "Mise en valeur d'une nouvelle parcelle",
  "Suivi périodique",
  "Résolution d'un problème (salinité, acidité…)",
  "Étude / recherche",
] as const;

export const SYSTEMES_CULTURE = ["Pluvial", "Irrigué"] as const;

export const SOURCES_EAU = [
  "Forage",
  "Puits",
  "Fleuve / cours d'eau",
  "Bassin de rétention",
  "Réseau / robinet",
  "Autre",
] as const;

export const PROBLEMES_SUGGERES = [
  "Baisse de rendement",
  "Salinité",
  "Acidité",
  "Érosion",
  "Engorgement",
] as const;

export const PROFONDEURS = [
  "0–20 cm",
  "20–40 cm",
  "40–60 cm",
  "> 60 cm",
  "Profil complet",
] as const;

export const ANALYSIS_OPTIONS = [
  { label: "Analyse physico-chimique", desc: "Propriétés physiques et chimiques du sol" },
  { label: "Analyse fertilité (NPK)", desc: "Azote, Phosphore, Potassium" },
  { label: "Analyse granulométrique", desc: "Texture et composition du sol" },
  { label: "Analyse salinité", desc: "Concentration en sels solubles" },
  { label: "Analyse pH", desc: "Acidité ou alcalinité du sol" },
  { label: "Analyse complète", desc: "Tous les paramètres pédologiques" },
] as const;

export const ANALYSE_COMPLETE = "Analyse complète";

export const MODES_REMISE = [
  "Dépôt au laboratoire INP",
  "Enlèvement par une équipe INP",
  "Envoi via transporteur",
] as const;

export const MODES_RECEPTION = [
  "Email (rapport PDF)",
  "Retrait sur place",
  "Courrier postal",
] as const;

/* ------------------------------------------------------------------ */
/*  Plages géographiques du Sénégal (validation souple GPS)            */
/* ------------------------------------------------------------------ */

export const SENEGAL_BOUNDS = { latMin: 12, latMax: 17, lonMin: -18, lonMax: -11 };

export function coordsHorsSenegal(lat: number, lon: number): boolean {
  return (
    lat < SENEGAL_BOUNDS.latMin ||
    lat > SENEGAL_BOUNDS.latMax ||
    lon < SENEGAL_BOUNDS.lonMin ||
    lon > SENEGAL_BOUNDS.lonMax
  );
}

/* ------------------------------------------------------------------ */
/*  Modèle de données du formulaire                                    */
/* ------------------------------------------------------------------ */

export interface DemandeAnalyseForm {
  // Étape 1 — demandeur
  type_demandeur: string;
  structure: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  // Étape 2 — localisation
  delegation: string;
  region: string;
  departement: string;
  commune: string;
  village: string;
  superficie_ha: string;
  latitude: string;
  longitude: string;
  // Étape 3 — parcelle & contexte
  objectif: string;
  culture_actuelle: string;
  culture_prevue: string;
  systeme_culture: string;
  source_eau: string;
  historique_fertilisation: string;
  problemes_text: string; // texte libre, pré-rempli par les puces ; converti en text[] à l'envoi
  // Étape 4 — échantillons & analyses
  nombre_echantillons: string;
  profondeurs: string[];
  analyses: string[];
  // Étape 5 — logistique
  mode_remise: string;
  date_prevue: string;
  mode_reception: string;
  // Étape 6 — consentement
  consentement: boolean;
}

export const FORM_VIDE: DemandeAnalyseForm = {
  type_demandeur: "",
  structure: "",
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  delegation: "",
  region: "",
  departement: "",
  commune: "",
  village: "",
  superficie_ha: "",
  latitude: "",
  longitude: "",
  objectif: "",
  culture_actuelle: "",
  culture_prevue: "",
  systeme_culture: "",
  source_eau: "",
  historique_fertilisation: "",
  problemes_text: "",
  nombre_echantillons: "",
  profondeurs: [],
  analyses: [],
  mode_remise: "",
  date_prevue: "",
  mode_reception: "",
  consentement: false,
};

export type Erreurs = Partial<Record<keyof DemandeAnalyseForm, string>>;

/* ------------------------------------------------------------------ */
/*  Validateurs unitaires                                              */
/* ------------------------------------------------------------------ */

export function emailValide(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// Téléphone sénégalais : +221 (optionnel) puis 9 chiffres (espaces autorisés).
export function telephoneValide(v: string): boolean {
  const nettoye = v.replace(/[\s.-]/g, "");
  return /^(\+?221)?[0-9]{9}$/.test(nettoye);
}

export function dateDansLeFutur(v: string): boolean {
  if (!v) return true; // optionnel
  const d = new Date(v + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
}

/* ------------------------------------------------------------------ */
/*  Validation par étape (0 → 5)                                       */
/* ------------------------------------------------------------------ */

export function validerEtape(step: number, f: DemandeAnalyseForm): Erreurs {
  const e: Erreurs = {};

  if (step === 0) {
    if (!f.type_demandeur) e.type_demandeur = "Veuillez sélectionner un type de demandeur.";
    if (f.type_demandeur && f.type_demandeur !== TYPE_PRODUCTEUR && !f.structure.trim())
      e.structure = "Le nom de la structure est requis.";
    if (!f.nom.trim()) e.nom = "Le nom est requis.";
    if (!f.prenom.trim()) e.prenom = "Le prénom est requis.";
    if (!f.telephone.trim()) e.telephone = "Le téléphone est requis.";
    else if (!telephoneValide(f.telephone)) e.telephone = "Format attendu : +221 suivi de 9 chiffres.";
    if (!f.email.trim()) e.email = "L'email est requis.";
    else if (!emailValide(f.email)) e.email = "Adresse email invalide.";
  }

  if (step === 1) {
    if (!f.delegation) e.delegation = "Veuillez sélectionner une délégation.";
    if (!f.region) e.region = "Veuillez sélectionner une région.";
    if (!f.departement) e.departement = "Veuillez sélectionner un département.";
    if (!f.commune) e.commune = "Veuillez sélectionner une commune.";
    if (f.superficie_ha && Number(f.superficie_ha) <= 0)
      e.superficie_ha = "La superficie doit être supérieure à 0.";
  }

  if (step === 2) {
    if (!f.objectif) e.objectif = "Veuillez préciser l'objectif de la demande.";
  }

  if (step === 3) {
    const n = Number(f.nombre_echantillons);
    if (!f.nombre_echantillons.trim()) e.nombre_echantillons = "Indiquez le nombre d'échantillons.";
    else if (!Number.isInteger(n) || n < 1) e.nombre_echantillons = "Nombre entier supérieur ou égal à 1.";
    if (f.profondeurs.length === 0) e.profondeurs = "Sélectionnez au moins une profondeur.";
    if (f.analyses.length === 0) e.analyses = "Sélectionnez au moins un type d'analyse.";
  }

  if (step === 4) {
    if (!f.mode_remise) e.mode_remise = "Veuillez choisir un mode de remise.";
    if (!f.mode_reception) e.mode_reception = "Veuillez choisir un mode de réception.";
    if (f.date_prevue && !dateDansLeFutur(f.date_prevue))
      e.date_prevue = "La date prévue ne peut pas être dans le passé.";
  }

  if (step === 5) {
    if (!f.consentement) e.consentement = "Le consentement est obligatoire pour soumettre la demande.";
  }

  return e;
}

/* ------------------------------------------------------------------ */
/*  Conversion form → payload backend (clés = colonnes Supabase)       */
/* ------------------------------------------------------------------ */

export function formVersPayload(f: DemandeAnalyseForm) {
  const problemes = f.problemes_text
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    type_demandeur: f.type_demandeur,
    structure: f.type_demandeur === TYPE_PRODUCTEUR ? "" : f.structure.trim(),
    nom: f.nom.trim(),
    prenom: f.prenom.trim(),
    telephone: f.telephone.trim(),
    email: f.email.trim(),
    delegation: f.delegation,
    region: f.region,
    departement: f.departement,
    commune: f.commune,
    village: f.village.trim(),
    superficie_ha: f.superficie_ha,
    latitude: f.latitude,
    longitude: f.longitude,
    objectif: f.objectif,
    culture_actuelle: f.culture_actuelle.trim(),
    culture_prevue: f.culture_prevue.trim(),
    systeme_culture: f.systeme_culture,
    source_eau: f.systeme_culture === "Irrigué" ? f.source_eau : "",
    historique_fertilisation: f.historique_fertilisation.trim(),
    problemes,
    nombre_echantillons: f.nombre_echantillons,
    profondeurs: f.profondeurs,
    analyses: f.analyses,
    mode_remise: f.mode_remise,
    date_prevue: f.date_prevue,
    mode_reception: f.mode_reception,
    consentement: f.consentement,
  };
}

// Référence de secours (format identique au serveur) si Supabase n'est pas configuré.
export function referenceLocale(annee: number, rnd: number): string {
  const n = (rnd % 1_000_000).toString().padStart(6, "0");
  return `INP-${annee}-${n}`;
}
