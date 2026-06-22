// Personnel officiel de l'Institut national de Pédologie (INP)
// Source : Liste du personnel INP à jour — Mai 2026 (68 agents)
// Les photos individuelles seront ajoutées via le back-office.

export type PoleType =
  | "direction"
  | "technique"
  | "administration"
  | "communication"
  | "delegations"
  | "appui";

export interface MembreEquipe {
  id: string;
  nom: string;          // nom complet tel que dans la liste officielle
  fonction: string;
  pole: PoleType;
  zone?: string;        // zone géographique (délégations, personnel régional)
  photo?: string;       // optionnel — fallback initiales si absent
}

export const demoEquipe: MembreEquipe[] = [
  // ─────────── DIRECTION GÉNÉRALE ───────────
  { id: "alfred-kouly-tine", nom: "Alfred Kouly TINE", fonction: "Directeur Général", pole: "direction", photo: "/images/directeurs/alfred-kouly-tine.jpg" },
  { id: "waly-ngor-sarr", nom: "Waly Ngor SARR", fonction: "Directeur Technique", pole: "direction" },
  { id: "papa-nekhou-diagne", nom: "Papa Nékhou DIAGNE", fonction: "Conseiller Scientifique et Technique", pole: "direction" },

  // ─────────── DIVISIONS TECHNIQUES ───────────
  { id: "mahamadou-thiam", nom: "Mahamadou THIAM", fonction: "Chef de la Division Recherche, Développement et Innovation", pole: "technique" },
  { id: "diakhou-sall", nom: "Diakhou SALL", fonction: "Assistante Division Recherche & Développement", pole: "technique" },
  { id: "macoumba-loum", nom: "Macoumba LOUM", fonction: "Responsable Division Cartographie", pole: "technique" },
  { id: "aminata-diop", nom: "Aminata DIOP", fonction: "Assistante Division Cartographie", pole: "technique" },
  { id: "khoudia-niang", nom: "Khoudia NIANG", fonction: "Responsable Fertilité et Restauration des Sols", pole: "technique" },
  { id: "seynabou-seck", nom: "Seynabou SECK", fonction: "Assistante Division Fertilité et Restauration des Sols", pole: "technique" },
  { id: "robert-made-kama", nom: "Robert Made KAMA", fonction: "Responsable des Laboratoires", pole: "technique" },
  { id: "massamba-diagne", nom: "Massamba DIAGNE", fonction: "Laborantin", pole: "technique", zone: "Niayes" },
  { id: "saliou-top", nom: "Saliou TOP", fonction: "Laborantin", pole: "technique" },
  { id: "mamadou-mamoudou-guisse", nom: "Mamadou Mamoudou GUISSE", fonction: "Laborantin", pole: "technique" },
  { id: "coumba-mara-diouf", nom: "Coumba Mara DIOUF", fonction: "Laborantine", pole: "technique" },
  { id: "sokhna-walo-kebe", nom: "Sokhna Walo KEBE", fonction: "Responsable Métrologie", pole: "technique" },
  { id: "junior-bruno-ndiaye", nom: "Junior Bruno Papa Mbar NDIAYE", fonction: "Responsable Administratif et Technique", pole: "technique" },
  { id: "fatou-mbodji-ndoye", nom: "Fatou Mbodji NDOYE", fonction: "Assistante Administrative et Technique", pole: "technique" },
  { id: "mamadou-sarr", nom: "Mamadou SARR", fonction: "Responsable des Échantillons", pole: "technique" },
  { id: "amadou-hanne-se", nom: "Amadou HANNE", fonction: "Responsable Suivi-Évaluation", pole: "technique" },

  // ─────────── ADMINISTRATION & FINANCES ───────────
  { id: "awa-sow-ndiaye", nom: "Awa Sow NDIAYE", fonction: "Responsable Administratif et Financier", pole: "administration" },
  { id: "papa-mamadou-gning", nom: "Papa El Hadji Mamadou GNING", fonction: "Assistant Administratif et Financier", pole: "administration" },
  { id: "laba-gningue", nom: "Laba GNINGUE", fonction: "Responsable des Ressources Humaines", pole: "administration" },
  { id: "ramatoulaye-dia", nom: "Ramatoulaye DIA", fonction: "Assistante Ressources Humaines", pole: "administration" },
  { id: "abdoulaye-diakhate", nom: "Abdoulaye DIAKHATE", fonction: "Assistant Ressources Humaines", pole: "administration" },
  { id: "mohamed-diop", nom: "Mohamed DIOP", fonction: "Comptable Principal", pole: "administration" },
  { id: "youssoupha-diop", nom: "Youssoupha DIOP", fonction: "Agent Comptable", pole: "administration" },
  { id: "adja-khady-diokhane", nom: "Adja Khady DIOKHANE", fonction: "Assistante Comptable", pole: "administration" },
  { id: "aissatou-kebe", nom: "Aissatou KEBE", fonction: "Comptable des Matières", pole: "administration" },
  { id: "ahmed-saloum-mbodj", nom: "Ahmed Saloum MBODJ", fonction: "Responsable Cellule de Passation des Marchés", pole: "administration" },
  { id: "alassane-thiane", nom: "Alassane THIANE", fonction: "Contrôleur de Gestion", pole: "administration" },
  { id: "ndeye-sokhna-fall", nom: "Ndeye Sokhna FALL", fonction: "Responsable Qualité", pole: "administration" },

  // ─────────── COMMUNICATION & INFORMATIQUE ───────────
  { id: "abibatou-mbaye", nom: "Abibatou MBAYE", fonction: "Responsable Cellule Informatique et Communication", pole: "communication" },
  { id: "mourtala-fall", nom: "Mourtala FALL", fonction: "Assistant Cellule Informatique et Communication", pole: "communication" },
  { id: "alioune-gueye", nom: "Alioune GUEYE", fonction: "Assistant Cellule Informatique et Communication", pole: "communication" },

  // ─────────── DÉLÉGATIONS TERRITORIALES ───────────
  { id: "ndeye-awa-sow", nom: "Ndeye Awa SOW", fonction: "Déléguée de zone", pole: "delegations", zone: "Niayes" },
  { id: "adama-ndiaye", nom: "Adama NDIAYE", fonction: "Délégué de zone", pole: "delegations", zone: "Sylvo-Pastorale" },
  { id: "ndella-fall-diouf", nom: "Ndella FALL DIOUF", fonction: "Déléguée de zone", pole: "delegations", zone: "Kédougou" },
  { id: "medare-gning", nom: "Médare GNING", fonction: "Délégué de zone", pole: "delegations", zone: "Kaolack" },
  { id: "moustapha-diere-sagna", nom: "Moustapha Diere SAGNA", fonction: "Délégué de zone", pole: "delegations", zone: "Tambacounda" },
  { id: "mare-ndiaye", nom: "Mare NDIAYE", fonction: "Délégué de zone", pole: "delegations", zone: "Sud" },
  { id: "yessa-sy", nom: "Yessa SY", fonction: "Assistante de zone", pole: "delegations", zone: "Niayes" },
  { id: "jean-sylvain-nzaly", nom: "Jean Sylvain NZALY", fonction: "Assistant de zone", pole: "delegations", zone: "Niayes" },
  { id: "oumar-ba", nom: "Oumar BA", fonction: "Assistant de zone", pole: "delegations", zone: "Sylvo-Pastorale" },
  { id: "yves-tendeng", nom: "Yves Jean Baptiste TENDENG", fonction: "Assistant de zone", pole: "delegations", zone: "Ziguinchor" },
  { id: "adama-ndour", nom: "Adama NDOUR", fonction: "Assistant de zone", pole: "delegations", zone: "Kaolack" },
  { id: "aliou-niang", nom: "Aliou NIANG", fonction: "Assistant de zone", pole: "delegations", zone: "Kédougou" },
  { id: "mamadou-niang", nom: "Mamadou NIANG", fonction: "Assistant de zone", pole: "delegations", zone: "Matam" },
  { id: "ibrahima-diallo", nom: "Ibrahima DIALLO", fonction: "Assistant délégué", pole: "delegations", zone: "Sédhiou" },

  // ─────────── PERSONNEL D'APPUI ───────────
  { id: "youssoupha-diouf", nom: "Youssoupha DIOUF", fonction: "Chef de Parc Automobile", pole: "appui" },
  { id: "djibril-seck", nom: "Djibril SECK", fonction: "Chauffeur", pole: "appui", zone: "Siège" },
  { id: "el-hadj-aliou-sall", nom: "El Hadj Aliou SALL", fonction: "Chauffeur", pole: "appui", zone: "Siège" },
  { id: "thierno-diouf", nom: "Thierno DIOUF", fonction: "Chauffeur", pole: "appui", zone: "Siège" },
  { id: "abou-seydou-ba", nom: "Abou Seydou BA", fonction: "Chauffeur", pole: "appui", zone: "Siège" },
  { id: "serigne-ndiaye", nom: "Serigne NDIAYE", fonction: "Chauffeur", pole: "appui", zone: "Tambacounda" },
  { id: "youssou-toure", nom: "Youssou TOURE", fonction: "Chauffeur", pole: "appui", zone: "Louga" },
  { id: "thierno-djibril-ba", nom: "Thierno Djibril BA", fonction: "Chauffeur", pole: "appui", zone: "Sédhiou" },
  { id: "el-hadj-bamba-fall", nom: "El Hadj Bamba FALL", fonction: "Chauffeur", pole: "appui", zone: "Matam" },
  { id: "ibrahima-ndiaye", nom: "Ibrahima NDIAYE", fonction: "Chauffeur", pole: "appui", zone: "Niayes" },
  { id: "el-hadji-abdoulaye-thiaw", nom: "El Hadji Abdoulaye THIAW", fonction: "Chauffeur", pole: "appui" },
  { id: "salif-gorgui-diallo", nom: "Salif Gorgui DIALLO", fonction: "Chauffeur", pole: "appui", zone: "Kaolack" },
  { id: "amadou-hanne-ch", nom: "Amadou HANNE", fonction: "Chauffeur", pole: "appui", zone: "Kédougou" },
  { id: "alioune-bakary-ndiaye", nom: "Alioune Bakary NDIAYE", fonction: "Agent de Sécurité", pole: "appui", zone: "Kaolack" },
  { id: "ibrahima-gueye", nom: "Ibrahima GUEYE", fonction: "Agent de Sécurité", pole: "appui", zone: "Siège" },
  { id: "cheikh-gackou", nom: "Cheikh GACKOU", fonction: "Agent de Sécurité", pole: "appui", zone: "Sédhiou" },
  { id: "ousmane-wague", nom: "Ousmane WAGUE", fonction: "Agent de Sécurité", pole: "appui", zone: "Siège" },
  { id: "mamour-laye-seck", nom: "Mamour Laye SECK", fonction: "Agent de Sécurité", pole: "appui", zone: "Kaolack" },
  { id: "mame-balla-ndiaye", nom: "Mame Balla NDIAYE", fonction: "Agent de Sécurité", pole: "appui", zone: "Tambacounda" },
  { id: "thiery-baloucoune", nom: "Thiery BALOUCOUNE", fonction: "Agent de Sécurité", pole: "appui", zone: "Siège" },
];

export const poleLabels: Record<PoleType, string> = {
  direction: "Direction Générale",
  technique: "Divisions Techniques",
  administration: "Administration & Finances",
  communication: "Communication & Informatique",
  delegations: "Délégations Territoriales",
  appui: "Personnel d'Appui",
};

export const poleDescriptions: Record<PoleType, string> = {
  direction: "L'équipe dirigeante qui pilote la stratégie et la gouvernance de l'INP.",
  technique: "Les responsables scientifiques et techniques : recherche, cartographie, fertilité, laboratoires et métrologie.",
  administration: "L'équipe qui assure la gestion administrative, financière, des ressources humaines et de la qualité.",
  communication: "La cellule en charge de la communication institutionnelle et des systèmes d'information.",
  delegations: "Les délégués et assistants qui représentent l'INP dans les zones pédoclimatiques du Sénégal.",
  appui: "Le personnel qui assure la logistique, le transport et la sécurité de l'Institut.",
};

export const poleColors: Record<PoleType, string> = {
  direction: "bg-[#7B4F2A]",
  technique: "bg-[#5A6F47]",
  administration: "bg-[#C9A574]",
  communication: "bg-[#1877F2]",
  delegations: "bg-[#9B59B6]",
  appui: "bg-[#8B7355]",
};

export function getMembresByPole(pole: PoleType): MembreEquipe[] {
  return demoEquipe.filter((m) => m.pole === pole);
}

/** Génère les initiales à partir du nom complet (1ère lettre du 1er mot + 1ère lettre du dernier mot). */
export function getInitiales(nom: string): string {
  const mots = nom.trim().split(/\s+/);
  if (mots.length === 1) return mots[0].slice(0, 2).toUpperCase();
  return (mots[0][0] + mots[mots.length - 1][0]).toUpperCase();
}
