// Organisation officielle de l'INP — issue du document officiel
// "Missions et tâches des différents responsables"
// Données enrichissables via le back-office (noms, photos des titulaires)

export type NiveauHierarchique =
  | "direction"
  | "division-technique"
  | "support"
  | "territorial"
  | "laboratoire";

export interface PosteOrganisation {
  id: string;
  intitule: string;
  acronyme?: string;
  niveau: NiveauHierarchique;
  finalite: string;
  missions: string[];
  titulaire?: string;
  photo?: string;
  rattachement?: string;
}

export const demoOrganisation: PosteOrganisation[] = [
  // ─── DIRECTION ───
  {
    id: "directeur-general",
    intitule: "Directeur Général",
    acronyme: "DG",
    niveau: "direction",
    titulaire: "Dr Alfred Kouly TINE",
    photo: "/images/directeurs/alfred-kouly-tine.jpg",
    finalite:
      "Le Directeur Général assure la direction stratégique, administrative, technique et financière de l'INP. Il garantit la mise en œuvre efficace des missions de l'Institut, la performance globale, la pérennité financière, ainsi que la représentation institutionnelle au niveau national et international.",
    missions: [
      "Élaborer et proposer la vision stratégique et les orientations de l'Institut.",
      "Assurer la déclinaison opérationnelle des politiques validées par le Conseil d'Administration.",
      "Piloter la planification stratégique et les programmes (PTBA, projets, conventions).",
      "Assurer la direction et la coordination de l'ensemble des structures de l'Institut.",
      "Veiller à la performance globale et à la culture de résultats.",
      "Superviser la gestion administrative et financière de l'Institut.",
      "Veiller à la conformité aux lois et règlements (UEMOA, Code des marchés publics).",
      "Garantir la transparence, la traçabilité et la bonne gouvernance.",
      "Superviser les activités techniques (cartographie, fertilité, laboratoires, RDI).",
      "Représenter l'Institut auprès des autorités, partenaires et institutions.",
      "Développer des partenariats stratégiques nationaux et internationaux.",
      "Définir la politique RH et superviser sa mise en œuvre.",
      "Produire des rapports périodiques au Conseil d'Administration.",
    ],
  },
  {
    id: "conseiller-scientifique-technique",
    intitule: "Conseiller Scientifique et Technique",
    acronyme: "CST",
    niveau: "direction",
    rattachement: "Directeur Général",
    finalite:
      "Le Conseiller Scientifique et Technique assiste le Directeur Général dans la définition, la coordination et la mise en œuvre des orientations scientifiques, techniques et stratégiques de l'Institut, afin de garantir la cohérence scientifique, la qualité technique des interventions et la valorisation du patrimoine pédologique national.",
    missions: [
      "Assister le Directeur Général dans l'orientation scientifique et technique des programmes.",
      "Contribuer à l'élaboration des plans stratégiques et plans d'activités de l'INP.",
      "Coordonner les activités thématiques afin d'en assurer la cohérence scientifique.",
      "Veiller à l'articulation des activités de l'INP avec les autres structures et partenaires.",
      "Organiser la demande et l'offre de formation des producteurs et du personnel.",
      "Superviser les activités de démonstration, recherche appliquée et formation.",
      "Assurer la valorisation scientifique des résultats (rapports, publications).",
      "Veiller à la capitalisation du patrimoine scientifique et pédologique de l'INP.",
      "Contribuer au développement de relations avec la communauté scientifique et agricole.",
    ],
  },
  {
    id: "directeur-technique",
    intitule: "Directeur Technique",
    acronyme: "DT",
    niveau: "direction",
    rattachement: "Directeur Général",
    finalite:
      "Le Directeur Technique conçoit, pilote, coordonne et supervise l'ensemble des activités techniques, scientifiques et territoriales de l'INP, en cohérence avec les orientations stratégiques définies par la Direction Générale et les organes de tutelle.",
    missions: [
      "Définir, en lien avec le DG, les orientations techniques et scientifiques de l'INP.",
      "Assurer la coordination des activités thématiques (cartographie, fertilité, laboratoires, formation).",
      "Veiller à l'alignement des activités avec les politiques nationales relatives aux sols.",
      "Encadrer et superviser les Chefs de Division et les Délégués zonaux.",
      "Valider les programmes techniques, rapports et productions scientifiques.",
      "Superviser la mise en œuvre des activités de recherche appliquée et de démonstration.",
      "Assurer la valorisation et la diffusion des résultats scientifiques et techniques.",
      "Participer à l'élaboration du PTBA et à l'évaluation des projets.",
      "Représenter l'INP dans les cadres techniques nationaux, sur délégation du DG.",
      "Assurer l'intérim du Directeur Général en cas d'absence ou de vacance.",
    ],
  },

  // ─── DIVISIONS TECHNIQUES ───
  {
    id: "division-rdi",
    intitule: "Chef de la Division Recherche, Développement et Innovation",
    acronyme: "RDI",
    niveau: "division-technique",
    rattachement: "Directeur Technique",
    finalite:
      "Le Chef de la Division RDI conçoit, pilote et coordonne la politique de recherche appliquée, d'innovation scientifique et technologique de l'INP, en vue de produire des connaissances, des solutions et des outils innovants contribuant à la gestion durable des sols et au développement agricole.",
    missions: [
      "Élaborer et mettre en œuvre la stratégie de recherche, développement et innovation.",
      "Identifier les axes prioritaires de recherche en cohérence avec les missions de l'Institut.",
      "Coordonner les projets de recherche fondamentale et appliquée.",
      "Superviser la conception, l'exécution et l'évaluation des projets RDI.",
      "Encadrer les équipes de chercheurs, ingénieurs et assistants.",
      "Valoriser les résultats de recherche (publications, transfert de technologies).",
      "Développer et maintenir des partenariats scientifiques nationaux et internationaux.",
      "Collaborer avec les universités, centres de recherche et partenaires financiers.",
      "Produire des rapports scientifiques et techniques périodiques.",
    ],
  },
  {
    id: "division-cartographie-cadastre",
    intitule: "Chef de la Division Cartographie et Cadastre",
    niveau: "division-technique",
    rattachement: "Directeur Technique",
    finalite:
      "Le Chef de la Division Cartographie et Cadastre est responsable de la conception, de l'alimentation, de la gestion, de l'exploitation et de la sécurisation du système d'information géographique relatif aux sols, en vue d'appuyer la planification, la recherche et la mise en œuvre des programmes techniques de l'INP.",
    missions: [
      "Organiser la collecte des données spatiales et pédologiques issues du terrain.",
      "Assurer la structuration, normalisation et intégration des données dans le SIG.",
      "Traiter et analyser les données spatiales relatives aux sols et à leur dégradation.",
      "Réaliser la cartographie de l'aptitude des terres et des potentialités agro-pédologiques.",
      "Produire des cartes thématiques (occupation des sols, usages, dégradation, fertilité).",
      "Assurer la mise à jour, la sauvegarde et la sécurisation de la base de données SIG.",
      "Formuler des recommandations techniques en matière de DRS/CES.",
      "Contribuer à la diffusion et à la valorisation des résultats cartographiques.",
    ],
  },
  {
    id: "division-fertilite-restauration",
    intitule: "Responsable de la Division Fertilité et Restauration des Sols",
    niveau: "division-technique",
    rattachement: "Directeur Technique",
    finalite:
      "Le Responsable de la Division Fertilité et Restauration des Sols assure la conception, la coordination et le suivi des activités relatives à la fertilité des sols et à leur restauration durable. Il contribue à l'amélioration de la productivité agricole et à la préservation des ressources naturelles.",
    missions: [
      "Élaborer les programmes et projets relatifs à la fertilité et à la restauration des sols.",
      "Définir les approches techniques adaptées aux différents contextes pédoclimatiques.",
      "Superviser la mise en œuvre des activités de gestion durable des terres (GDT).",
      "Encadrer les actions de Défense et Restauration des Sols (DRS/CES).",
      "Assurer le suivi des activités conduites par les délégations zonales.",
      "Apporter un appui technique aux producteurs, partenaires et structures internes.",
      "Contribuer à l'interprétation des données issues des analyses de sols.",
      "Contribuer à l'élaboration de guides techniques et supports de vulgarisation.",
      "Définir et suivre les indicateurs de performance liés à la fertilité des sols.",
    ],
  },
  {
    id: "responsable-laboratoires",
    intitule: "Responsable des Laboratoires",
    niveau: "division-technique",
    rattachement: "Directeur Technique",
    finalite:
      "Le Responsable des Laboratoires organise, coordonne et supervise les activités des laboratoires de l'Institut afin de garantir la qualité, la fiabilité et la traçabilité des analyses réalisées sur les sols, terres, plantes et produits associés.",
    missions: [
      "Organiser la demande et l'offre d'analyses et de caractérisation des terres, sols et plantes.",
      "Planifier et coordonner les activités des laboratoires, y compris déconcentrés.",
      "Assurer la gestion du laboratoire central et sa mise aux normes techniques et de sécurité.",
      "Superviser les laboratoires annexes (Sangalkam) et de routine des délégations.",
      "Veiller à l'entretien, à la maintenance et à l'utilisation conforme des équipements.",
      "Garantir la qualité, la fiabilité et la traçabilité des analyses.",
      "Préparer et produire les rapports scientifiques et techniques relatifs aux analyses.",
      "Encadrer, coordonner et superviser les laborantins.",
    ],
  },
  {
    id: "responsable-administratif-technique",
    intitule: "Responsable Administratif et Technique (SIG)",
    niveau: "division-technique",
    rattachement: "Directeur Technique",
    finalite:
      "Le Responsable Administratif et Technique organise, structure et exploite les données spatiales et techniques relatives aux sols et à l'utilisation des terres, à travers la mise en place et la gestion d'un système d'information géographique (SIG) fiable, normalisé et exploitable.",
    missions: [
      "Collecter, sauvegarder, traiter et exploiter les données relatives à la ressource sol.",
      "Réaliser et superviser la cartographie des sols et des processus de dégradation.",
      "Assurer l'évaluation et la cartographie de l'aptitude des terres.",
      "Mettre en place et administrer un système d'information géographique adapté.",
      "Appliquer les normes internationales de description et de classification des sols (FAO).",
      "Intégrer les fondements du système local de classification des sols.",
      "Appuyer les équipes techniques dans l'exploitation des données SIG.",
      "Contribuer à la production de documents techniques pour la recherche et la décision.",
    ],
  },

  // ─── SUPPORT ADMINISTRATIF & FINANCIER ───
  {
    id: "responsable-rh",
    intitule: "Responsable des Ressources Humaines",
    acronyme: "RH",
    niveau: "support",
    rattachement: "Directeur Général",
    finalite:
      "Le Responsable des Ressources Humaines conçoit, met en œuvre et pilote la politique de gestion des ressources humaines de l'Institut, en veillant à la conformité légale, au maintien d'un climat social apaisé et à la valorisation du capital humain.",
    missions: [
      "Élaborer la politique sociale et salariale de l'Institut.",
      "Contribuer à la gestion prévisionnelle des emplois et des compétences (GPEC).",
      "Élaborer et actualiser les documents contractuels (contrats, avenants, attestations).",
      "Participer à la gestion et au contrôle de la paie.",
      "Veiller à la conformité des pratiques RH avec la législation sociale sénégalaise.",
      "Élaborer et veiller à l'application du règlement intérieur et des procédures RH.",
      "Gérer les relations avec les partenaires sociaux et organismes sociaux (IPRES, CSS).",
      "Contribuer à la prévention et à la gestion des conflits sociaux.",
      "Participer à l'évaluation des performances du personnel.",
    ],
  },
  {
    id: "responsable-cpm",
    intitule: "Responsable de la Cellule de Passation des Marchés",
    acronyme: "CPM",
    niveau: "support",
    rattachement: "Directeur Général",
    finalite:
      "Le Responsable de la CPM planifie, organise, sécurise et contrôle l'ensemble des procédures de passation des marchés publics, dans le respect strict de la réglementation, afin de garantir la transparence, la conformité juridique et l'efficacité de la dépense publique.",
    missions: [
      "Élaborer et actualiser le Plan de Passation des Marchés (PPM).",
      "Assurer la cohérence entre les besoins exprimés, le budget et la planification.",
      "Choisir et proposer les modes de passation appropriés.",
      "Élaborer les dossiers d'appel d'offres (DAO) et documents de consultation.",
      "Organiser les séances d'ouverture et d'évaluation des offres.",
      "Veiller au respect du Code des marchés publics et des procédures internes.",
      "Assurer la traçabilité et l'archivage des procédures.",
      "Suivre les avenants, modifications et résiliations éventuelles.",
      "Produire des rapports sur l'état d'exécution des marchés.",
    ],
  },
  {
    id: "responsable-assurance-qualite",
    intitule: "Responsable Assurance Qualité",
    acronyme: "RAQ",
    niveau: "support",
    rattachement: "Directeur Général",
    finalite:
      "Le Responsable Assurance Qualité conçoit, met en œuvre, pilote et améliore le système de management de la qualité de l'Institut, afin de garantir la conformité des activités, des prestations et des résultats aux normes en vigueur.",
    missions: [
      "Concevoir, formaliser et mettre à jour le système d'assurance qualité.",
      "Élaborer et actualiser les procédures, manuels qualité et documents de référence.",
      "Veiller à l'application effective des procédures qualité par les services.",
      "Assurer la conformité aux normes qualité applicables (ISO, référentiels internes).",
      "Participer à la préparation et au suivi des audits qualité internes et externes.",
      "Assurer le suivi des actions correctives, préventives et d'amélioration continue.",
      "Veiller à la qualité des processus (analyses, études, cartographie).",
      "Former et sensibiliser le personnel aux exigences qualité.",
      "Promouvoir une culture qualité et d'amélioration continue.",
    ],
  },
  {
    id: "responsable-informatique-communication",
    intitule: "Responsable de la Cellule Informatique et Communication",
    niveau: "support",
    rattachement: "Directeur Général",
    finalite:
      "Le Responsable de la Cellule Informatique et Communication assure la gestion et la sécurisation du système d'information de l'Institut, ainsi que la conception et la mise en œuvre de la stratégie de communication institutionnelle.",
    missions: [
      "Définir et mettre en œuvre la politique de gestion du parc informatique.",
      "Assurer la maintenance préventive et curative des équipements informatiques.",
      "Garantir la disponibilité, la sécurité et la fiabilité du réseau et des données.",
      "Administrer le site web institutionnel et les plateformes numériques.",
      "Concevoir et mettre en œuvre la stratégie de communication interne et externe.",
      "Assurer la visibilité et le positionnement institutionnel de l'INP.",
      "Valoriser les résultats scientifiques et techniques de l'Institut.",
      "Organiser la médiatisation des activités et événements institutionnels.",
      "Produire et superviser les supports de communication (print, digital, audiovisuel).",
    ],
  },
  {
    id: "assistant-comptable",
    intitule: "Assistant Comptable",
    niveau: "support",
    rattachement: "Agent Comptable",
    finalite:
      "L'Assistant Comptable appuie l'Agent Comptable dans la tenue régulière, sincère et conforme de la comptabilité de l'INP, en assurant l'enregistrement des opérations, le suivi des comptes et la préparation des états financiers.",
    missions: [
      "Enregistrer les opérations comptables conformément au SYSCOA et à l'UEMOA.",
      "Assurer le suivi des comptes fournisseurs et des comptes clients.",
      "Effectuer les rapprochements bancaires périodiques.",
      "Participer à la préparation des états financiers et situations périodiques.",
      "Préparer et classer les pièces comptables et justificatives.",
      "Contribuer aux travaux de clôture comptable.",
      "Collaborer avec le Commissaire aux comptes et les organes de contrôle.",
    ],
  },
  {
    id: "comptable-matieres",
    intitule: "Comptable des Matières",
    niveau: "support",
    rattachement: "Directeur Général",
    finalite:
      "Le Comptable des matières assure la gestion, la traçabilité, la conservation et le suivi des biens mobiliers et équipements de l'INP, depuis leur réception jusqu'à leur sortie ou réforme.",
    missions: [
      "Réceptionner les matériels et fournitures avec les procès-verbaux de réception.",
      "Vérifier la conformité des livraisons (quantité, qualité, références).",
      "Enregistrer les entrées et sorties de matériels dans les registres réglementaires.",
      "Assurer la codification, l'identification et le classement des biens.",
      "Mettre à jour les fiches de stock et les supports de suivi.",
      "Suivre les mouvements de matériels (mutations, réformes, pertes).",
      "Organiser et réaliser les inventaires physiques périodiques.",
      "Produire des états périodiques à l'attention de la Direction et des organes de contrôle.",
    ],
  },

  // ─── RÉSEAU TERRITORIAL ───
  {
    id: "delegue-zonal",
    intitule: "Délégué Zonal",
    niveau: "territorial",
    rattachement: "Directeur Technique",
    finalite:
      "Le Délégué zonal assure, au niveau de sa zone d'intervention, la coordination, la mise en œuvre, le suivi et la remontée des activités techniques et opérationnelles de l'INP, conformément aux orientations définies par la Direction Générale et la Direction Technique.",
    missions: [
      "Coordonner l'exécution des programmes et projets de l'INP dans la zone.",
      "Décliner le programme national en un programme zonal opérationnel.",
      "Veiller à la bonne exécution technique des activités planifiées.",
      "Centraliser les informations techniques, administratives et opérationnelles de la zone.",
      "Assurer la remontée régulière des données vers la Direction Générale.",
      "Contribuer à l'élaboration des rapports périodiques et bilans d'activités.",
      "Servir d'interface technique entre l'INP et les services déconcentrés de l'État (DRDR, SDDR).",
      "Développer des relations de collaboration avec les acteurs locaux du développement.",
    ],
  },
  {
    id: "assistant-delegue-zonal",
    intitule: "Assistant du Délégué Zonal",
    niveau: "territorial",
    rattachement: "Délégué Zonal",
    finalite:
      "L'Assistant du Délégué zonal appuie ce dernier dans la mise en œuvre opérationnelle, le suivi technique et la coordination des activités de l'Institut au niveau de la zone.",
    missions: [
      "Assister le Délégué zonal dans la planification et l'exécution des activités.",
      "Participer à la mise en œuvre des programmes et projets au niveau local.",
      "Contribuer à l'organisation logistique des missions et activités de terrain.",
      "Participer à la collecte des données techniques (sols, production, environnement).",
      "Contribuer à la tenue des bases de données et à leur mise à jour.",
      "Participer à la préparation des rapports d'activités (mensuels, trimestriels, annuels).",
      "Appuyer la mise en œuvre des actions de démonstration et de vulgarisation.",
      "Servir de relais entre la délégation zonale et les acteurs locaux.",
    ],
  },

  // ─── LABORATOIRES ───
  {
    id: "technicien-laboratoire",
    intitule: "Technicien de Laboratoire (Laborantin)",
    niveau: "laboratoire",
    rattachement: "Responsable des Laboratoires",
    finalite:
      "Le Laborantin assure, sous l'autorité du Responsable des Laboratoires, la préparation, la réalisation et la fiabilité des analyses de laboratoire (sols, eaux, plantes), ainsi que l'entretien courant des équipements.",
    missions: [
      "Préparer les échantillons (sols, eaux, plantes) conformément aux protocoles.",
      "Réaliser les analyses physico-chimiques et chimiques selon les normes établies.",
      "Assurer l'entretien courant et le bon fonctionnement des équipements de laboratoire.",
      "Veiller à l'utilisation rationnelle, sécurisée et conforme des produits chimiques.",
      "Assister les étudiants et stagiaires dans la réalisation des analyses.",
      "Assurer la traçabilité des analyses réalisées (enregistrements, fiches, résultats).",
      "Appliquer strictement les procédures de sécurité, d'hygiène et de qualité.",
    ],
  },
];

export const niveauLabels: Record<NiveauHierarchique, string> = {
  direction: "Direction",
  "division-technique": "Divisions techniques",
  support: "Support administratif & financier",
  territorial: "Réseau territorial",
  laboratoire: "Laboratoires",
};

export const niveauColors: Record<NiveauHierarchique, string> = {
  direction: "bg-[#7B4F2A] text-white",
  "division-technique": "bg-[#5A6F47] text-white",
  support: "bg-[#C9A574] text-[#2A1F18]",
  territorial: "bg-[#9B59B6] text-white",
  laboratoire: "bg-[#1877F2] text-white",
};

export function getPostesByNiveau(niveau: NiveauHierarchique): PosteOrganisation[] {
  return demoOrganisation.filter((p) => p.niveau === niveau);
}
