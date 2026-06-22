// TODO: REMPLACER PAR APPEL API BACK-OFFICE — données fictives de démonstration
export interface Delegation {
  slug: string;
  name: string;                    // Nom complet : "Délégation des Niayes"
  shortName: string;               // Nom court : "Niayes"
  color: string;                   // Couleur d'accent (cohérente avec la carte du Sénégal)
  chefLieu: string;                // Ville où se trouve le bureau de la délégation
  regionsCouvertes: string[];      // Régions administratives couvertes
  superficie: string;              // Superficie approximative
  population: string;              // Population approximative de la zone
  typesDeSols: string[];           // Principaux types de sols dans la zone
  cultureDominantes: string[];     // Cultures principales pratiquées
  enjeuxPedologiques: string[];    // Enjeux et problématiques spécifiques
  missionsSpecifiques: string[];   // Missions propres à cette délégation
  delegueNom: string;              // Nom fictif du délégué
  delegueFonction: string;         // "Délégué pédoclimatique"
  contact: {
    adresse: string;
    telephone: string;
    email: string;
  };
  description: string;             // Texte de présentation (1-2 paragraphes)
}

export const demoDelegations: Delegation[] = [
  {
    slug: "niayes",
    name: "Délégation des Niayes",
    shortName: "Niayes",
    color: "#5A6F47",
    chefLieu: "Thiès",
    regionsCouvertes: ["Thiès", "Dakar (zone périurbaine nord)"],
    superficie: "Environ 6 000 km²",
    population: "Environ 2,3 millions d'habitants",
    typesDeSols: [
      "Sols sableux des cordons dunaires",
      "Sols hydromorphes des dépressions inter-dunaires",
      "Sols faiblement développés littoraux",
    ],
    cultureDominantes: [
      "Maraîchage intensif (oignon, tomate, chou, pomme de terre)",
      "Arboriculture fruitière",
      "Cultures florales d'exportation",
    ],
    enjeuxPedologiques: [
      "Pression urbaine et grignotage des terres agricoles",
      "Salinisation progressive des nappes phréatiques",
      "Dégradation des sols par usage intensif d'intrants",
      "Préservation des dépressions humides (zones de production maraîchère)",
    ],
    missionsSpecifiques: [
      "Suivi de la qualité des sols maraîchers",
      "Conseil aux producteurs sur la fertilisation raisonnée",
      "Cartographie fine des nappes phréatiques peu profondes",
      "Veille sur la salinisation des sols irrigués",
    ],
    delegueNom: "M. Mamadou Diouf",
    delegueFonction: "Délégué pédoclimatique des Niayes",
    contact: {
      adresse: "Cité Ballabey, Route de Saint-Louis, Thiès",
      telephone: "+221 33 951 XX XX",
      email: "delegation.niayes@inp.sn",
    },
    description: "La Délégation des Niayes couvre la bande littorale Nord-Ouest du Sénégal, zone de production maraîchère stratégique pour l'approvisionnement de Dakar et l'exportation. Caractérisée par ses sols sableux et ses dépressions inter-dunaires riches en eau, cette zone fait face à une forte pression urbaine et à des enjeux de gestion durable des nappes phréatiques.",
  },
  {
    slug: "sylvo-pastorale",
    name: "Délégation Sylvo-Pastorale",
    shortName: "Sylvo Pastorale",
    color: "#C9C9C7",
    chefLieu: "Louga",
    regionsCouvertes: ["Louga", "Matam (partie ouest)", "Saint-Louis (partie sud)"],
    superficie: "Environ 50 000 km²",
    population: "Environ 1,5 million d'habitants",
    typesDeSols: [
      "Sols ferrugineux tropicaux peu lessivés",
      "Sols bruns subarides",
      "Sols sableux des ergs",
    ],
    cultureDominantes: [
      "Élevage extensif (bovins, ovins, caprins)",
      "Cultures pluviales (mil, niébé)",
      "Cueillette traditionnelle (gomme arabique)",
    ],
    enjeuxPedologiques: [
      "Désertification progressive et avancée du Sahara",
      "Surpâturage et dégradation du couvert végétal",
      "Faible fertilité naturelle des sols sableux",
      "Variabilité climatique extrême",
    ],
    missionsSpecifiques: [
      "Suivi de la désertification et de la dégradation des terres",
      "Cartographie des pâturages et des points d'eau",
      "Appui aux programmes de reboisement et de restauration",
      "Recherche sur les techniques agropastorales adaptées",
    ],
    delegueNom: "M. Ousmane Sow",
    delegueFonction: "Délégué pédoclimatique Sylvo-Pastoral",
    contact: {
      adresse: "Avenue Cheikh Ahmadou Bamba, Louga",
      telephone: "+221 33 967 XX XX",
      email: "delegation.sylvopastorale@inp.sn",
    },
    description: "La Délégation Sylvo-Pastorale couvre la vaste zone sahélienne du Nord-Centre du Sénégal, principalement vouée à l'élevage extensif et aux cultures pluviales. Cette zone est confrontée à une dégradation accélérée des terres et à une avancée préoccupante de la désertification, ce qui en fait un terrain d'intervention prioritaire pour l'INP.",
  },
  {
    slug: "fleuve",
    name: "Délégation du Fleuve",
    shortName: "Fleuve",
    color: "#1E40AF",
    chefLieu: "Saint-Louis",
    regionsCouvertes: ["Saint-Louis", "Matam", "Tambacounda (partie nord-ouest)"],
    superficie: "Environ 56 000 km²",
    population: "Environ 1,4 million d'habitants",
    typesDeSols: [
      "Sols alluviaux de la vallée (sols vertiques, hollaldé)",
      "Sols halomorphes (sols salins)",
      "Sols ferrugineux tropicaux des diéri",
      "Sols hydromorphes des cuvettes",
    ],
    cultureDominantes: [
      "Riziculture irriguée (Delta et vallée)",
      "Cultures maraîchères de contre-saison",
      "Sorgho et niébé sur diéri",
      "Élevage et pêche continentale",
    ],
    enjeuxPedologiques: [
      "Salinisation et alcalinisation des sols irrigués",
      "Gestion durable des aménagements hydro-agricoles",
      "Acidification des sols de bas-fonds",
      "Cartographie fine des sols aménageables",
    ],
    missionsSpecifiques: [
      "Études pédologiques des périmètres irrigués (SAED)",
      "Suivi de la salinisation dans la vallée et le Delta",
      "Conseil sur la mise en valeur des terres aménageables",
      "Recherche sur la riziculture irriguée durable",
    ],
    delegueNom: "M. Ibrahima Ndiaye",
    delegueFonction: "Délégué pédoclimatique du Fleuve",
    contact: {
      adresse: "Quartier Sor, Route de Khor, Saint-Louis",
      telephone: "+221 33 961 XX XX",
      email: "delegation.fleuve@inp.sn",
    },
    description: "La Délégation du Fleuve couvre la vallée et le Delta du fleuve Sénégal, ainsi que les zones de diéri attenantes. Cette zone est stratégique pour la sécurité alimentaire nationale grâce à ses aménagements rizicoles et maraîchers. L'INP y travaille en étroite collaboration avec la SAED sur les enjeux de salinisation et de gestion durable des sols irrigués.",
  },
  {
    slug: "bassin-arachidier",
    name: "Délégation du Bassin Arachidier",
    shortName: "Bassin Arachidier",
    color: "#D4A574",
    chefLieu: "Kaolack",
    regionsCouvertes: ["Kaolack", "Fatick", "Kaffrine", "Diourbel"],
    superficie: "Environ 46 000 km²",
    population: "Environ 3,2 millions d'habitants",
    typesDeSols: [
      "Sols ferrugineux tropicaux faiblement lessivés (dior)",
      "Sols hydromorphes des bas-fonds (deck)",
      "Sols halomorphes (vallées salines)",
      "Sols sableux faiblement développés",
    ],
    cultureDominantes: [
      "Arachide (culture historique de rente)",
      "Mil, sorgho",
      "Maïs, niébé",
      "Maraîchage de saison",
    ],
    enjeuxPedologiques: [
      "Baisse continue de la fertilité après des décennies d'arachide",
      "Salinisation progressive (langues salées du Sine-Saloum)",
      "Érosion hydrique et éolienne",
      "Acidification et appauvrissement en matière organique",
    ],
    missionsSpecifiques: [
      "Programme national de restauration de la fertilité",
      "Cartographie détaillée des sols dégradés",
      "Conseil aux producteurs sur la rotation et la fertilisation organique",
      "Suivi de la progression des langues salées",
    ],
    delegueNom: "M. Pape Diop",
    delegueFonction: "Délégué pédoclimatique du Bassin Arachidier",
    contact: {
      adresse: "Quartier Médina, Avenue Valdiodio Ndiaye, Kaolack",
      telephone: "+221 33 941 XX XX",
      email: "delegation.bassinarachidier@inp.sn",
    },
    description: "La Délégation du Bassin Arachidier couvre le cœur agricole historique du Sénégal, zone d'extension de la culture d'arachide depuis l'époque coloniale. Cette zone densément peuplée fait face à des défis majeurs de restauration de la fertilité des sols et de lutte contre la salinisation. L'INP y mène des programmes phares de réhabilitation des terres dégradées.",
  },
  {
    slug: "tamba",
    name: "Délégation de Tambacounda",
    shortName: "Tamba",
    color: "#E57373",
    chefLieu: "Tambacounda",
    regionsCouvertes: ["Tambacounda", "Kédougou (partie nord)"],
    superficie: "Environ 60 000 km²",
    population: "Environ 850 000 habitants",
    typesDeSols: [
      "Sols ferrugineux tropicaux lessivés",
      "Sols ferralitiques (zones cuirassées)",
      "Sols hydromorphes des bas-fonds rizicoles",
      "Sols alluviaux de la Gambie et de la Falémé",
    ],
    cultureDominantes: [
      "Coton (culture industrielle)",
      "Mil, sorgho, maïs",
      "Riz pluvial et de bas-fonds",
      "Arboriculture (mangue, anacarde)",
    ],
    enjeuxPedologiques: [
      "Dégradation des sols sous culture cotonnière intensive",
      "Cuirassement et érosion sur les plateaux",
      "Mise en valeur des bas-fonds rizicoles",
      "Adaptation au climat soudanien",
    ],
    missionsSpecifiques: [
      "Études pédologiques pour la SODEFITEX (filière coton)",
      "Cartographie des bas-fonds rizicoles aménageables",
      "Suivi de l'évolution des sols cotonniers",
      "Appui aux programmes d'arboriculture fruitière",
    ],
    delegueNom: "M. Boubacar Sy",
    delegueFonction: "Délégué pédoclimatique de Tambacounda",
    contact: {
      adresse: "Quartier Liberté, Route de Vélingara, Tambacounda",
      telephone: "+221 33 981 XX XX",
      email: "delegation.tamba@inp.sn",
    },
    description: "La Délégation de Tambacounda couvre la vaste zone soudanienne de l'Est du Sénégal, principalement dédiée à la culture cotonnière et aux cultures vivrières pluviales. L'INP y collabore étroitement avec la SODEFITEX et mène des travaux d'expertise sur la durabilité des systèmes de culture intensifs.",
  },
  {
    slug: "kedougou",
    name: "Délégation de Kédougou",
    shortName: "Kédougou",
    color: "#FBBF24",
    chefLieu: "Kédougou",
    regionsCouvertes: ["Kédougou (partie sud)"],
    superficie: "Environ 16 000 km²",
    population: "Environ 220 000 habitants",
    typesDeSols: [
      "Sols ferralitiques",
      "Sols ferrugineux tropicaux sur cuirasses",
      "Sols squelettiques des chaînes de collines",
      "Sols alluviaux de la Falémé et de la Gambie",
    ],
    cultureDominantes: [
      "Fonio (culture traditionnelle)",
      "Mangue (production d'exportation)",
      "Maïs, mil, riz pluvial",
      "Arboriculture diversifiée",
    ],
    enjeuxPedologiques: [
      "Impact environnemental de l'orpaillage et de l'exploitation minière",
      "Érosion hydrique forte sur les pentes",
      "Préservation des écosystèmes du Niokolo-Koba",
      "Mise en valeur des terres pour les filières fruitières",
    ],
    missionsSpecifiques: [
      "Études d'impact pédologique des activités minières",
      "Cartographie des terres aptes à l'arboriculture",
      "Suivi de la dégradation des bassins versants",
      "Conservation des sols sur les terrains pentus",
    ],
    delegueNom: "Mme Aïssatou Camara",
    delegueFonction: "Déléguée pédoclimatique de Kédougou",
    contact: {
      adresse: "Quartier Dande Mayo, Route de Saraya, Kédougou",
      telephone: "+221 33 985 XX XX",
      email: "delegation.kedougou@inp.sn",
    },
    description: "La Délégation de Kédougou couvre l'extrême Sud-Est du Sénégal, zone soudano-guinéenne aux paysages contrastés (collines, plateaux, vallées). Réputée pour sa production de mangues et son potentiel arboricole, cette zone est également confrontée aux défis environnementaux liés à l'exploitation minière et à la préservation du Parc National du Niokolo-Koba.",
  },
  {
    slug: "sedhiou",
    name: "Délégation de Sédhiou",
    shortName: "Sédhiou",
    color: "#7DD3C0",
    chefLieu: "Sédhiou",
    regionsCouvertes: ["Sédhiou", "Kolda (partie ouest)"],
    superficie: "Environ 14 000 km²",
    population: "Environ 700 000 habitants",
    typesDeSols: [
      "Sols ferralitiques rouges",
      "Sols hydromorphes des bas-fonds rizicoles",
      "Sols halomorphes (vallées salines)",
      "Sols alluviaux de la Casamance",
    ],
    cultureDominantes: [
      "Riziculture pluviale et de bas-fonds",
      "Arachide, mil, sorgho",
      "Arboriculture fruitière (mangue, agrumes)",
      "Cultures maraîchères",
    ],
    enjeuxPedologiques: [
      "Acidification et salinisation des rizières de bas-fonds",
      "Réhabilitation des terres acides à sulfates",
      "Préservation des mangroves et des écosystèmes humides",
      "Gestion durable des sols sous pluviométrie abondante",
    ],
    missionsSpecifiques: [
      "Programme de réhabilitation des rizières de bas-fonds",
      "Études sur les sols à sulfates acides",
      "Appui à la diversification agricole",
      "Cartographie des terres rizicultivables",
    ],
    delegueNom: "M. Lamine Diédhiou",
    delegueFonction: "Délégué pédoclimatique de Sédhiou",
    contact: {
      adresse: "Quartier Escale, Route de Marsassoum, Sédhiou",
      telephone: "+221 33 995 XX XX",
      email: "delegation.sedhiou@inp.sn",
    },
    description: "La Délégation de Sédhiou couvre le Centre de la Casamance, zone à forte pluviométrie et à dominance rizicole. Caractérisée par ses bas-fonds et ses sols à sulfates acides, cette zone fait l'objet de programmes spécifiques de réhabilitation des terres rizicoles, dans un contexte de relance de la production rizicole nationale.",
  },
  {
    slug: "ziguinchor",
    name: "Délégation de Ziguinchor",
    shortName: "Ziguinchor",
    color: "#22C55E",
    chefLieu: "Ziguinchor",
    regionsCouvertes: ["Ziguinchor"],
    superficie: "Environ 7 300 km²",
    population: "Environ 670 000 habitants",
    typesDeSols: [
      "Sols ferralitiques rouges (plateaux)",
      "Sols hydromorphes (bas-fonds)",
      "Sols à sulfates acides (mangroves drainées)",
      "Sols halomorphes (Tannes)",
    ],
    cultureDominantes: [
      "Riziculture (culture traditionnelle dominante)",
      "Arboriculture (mangue, agrumes, anacarde)",
      "Maraîchage",
      "Pêche et production halieutique",
    ],
    enjeuxPedologiques: [
      "Préservation des mangroves et des bolongs",
      "Lutte contre la salinisation des rizières de la Basse-Casamance",
      "Acidification des sols de bas-fonds",
      "Gestion intégrée des Tannes",
    ],
    missionsSpecifiques: [
      "Études pédologiques en milieu de mangroves",
      "Réhabilitation des Tannes pour la riziculture",
      "Cartographie des sols salins de la Basse-Casamance",
      "Appui aux programmes de relance rizicole",
    ],
    delegueNom: "M. Étienne Manga",
    delegueFonction: "Délégué pédoclimatique de Ziguinchor",
    contact: {
      adresse: "Quartier Boucotte, Avenue Carvalho, Ziguinchor",
      telephone: "+221 33 991 XX XX",
      email: "delegation.ziguinchor@inp.sn",
    },
    description: "La Délégation de Ziguinchor couvre la Basse-Casamance, zone à forte tradition rizicole et aux écosystèmes uniques (mangroves, bolongs, tannes). L'INP y mène des travaux spécialisés sur les sols de mangroves et les sols à sulfates acides, dans une optique de relance de la riziculture casamançaise.",
  },
];

export function getDelegationBySlug(slug: string): Delegation | null {
  return demoDelegations.find((d) => d.slug === slug) || null;
}
