// TODO: REMPLACER PAR APPEL API BACK-OFFICE — données à enrichir/valider via le back-office

export interface Directeur {
  id: string;
  ordre: number;
  nom: string;
  titre: string;
  photo: string;
  dateDebut: string;              // ISO YYYY-MM-DD
  dateFin?: string;               // ISO ou absent si en poste
  periode: string;
  contributionCourte: string;
  contributionLongue?: string;
  citation?: string;
  enPoste: boolean;
}

export const demoDirecteurs: Directeur[] = [
  {
    id: "rokhoya-daba-fall",
    ordre: 1,
    nom: "Rokhoya Daba FALL",
    titre: "1ère Directrice de l'INP",
    photo: "/images/directeurs/rokhoya-daba-fall.jpg",
    dateDebut: "2004-06-28",
    dateFin: "2010-12-02",
    periode: "28 Juin 2004 — 2 Décembre 2010",
    contributionCourte: "A posé les bases institutionnelles et scientifiques de l'étude des sols au Sénégal.",
    contributionLongue: "Première Directrice de l'Institut national de Pédologie, Rokhoya Daba FALL a structuré les fondations institutionnelles de l'INP et orienté ses premières missions de cartographie pédologique nationale.",
    enPoste: false,
  },
  {
    id: "mame-ndene-lo",
    ordre: 2,
    nom: "Mame Ndene Lo",
    titre: "2ème Directeur Général de l'INP",
    photo: "/images/directeurs/mame-ndene-lo.jpg",
    dateDebut: "2010-12-02",
    dateFin: "2015-05-27",
    periode: "02 Décembre 2010 — 27 Mai 2015",
    contributionCourte: "A contribué à la structuration technique et au développement des capacités nationales en pédologie.",
    contributionLongue: "Sous sa direction, l'INP a renforcé ses capacités techniques et étendu son réseau de partenariats institutionnels nationaux.",
    enPoste: false,
  },
  {
    id: "mamadou-amadou-sow",
    ordre: 3,
    nom: "Mamadou Amadou SOW",
    titre: "3ème Directeur Général de l'INP",
    photo: "/images/directeurs/mamadou-amadou-sow.jpg",
    dateDebut: "2015-05-27",
    dateFin: "2024-07-18",
    periode: "27 Mai 2015 — 18 Juillet 2024",
    contributionCourte: "A renforcé les programmes de cartographie des sols et modernisé les laboratoires techniques de l'Institut.",
    contributionLongue: "Sous sa direction, l'INP a connu une modernisation importante de ses équipements de laboratoire et a déployé des programmes ambitieux de cartographie pédologique à l'échelle nationale.",
    enPoste: false,
  },
  {
    id: "alfred-kouly-tine",
    ordre: 4,
    nom: "Dr. Alfred Kouly TINE",
    titre: "4ème Directeur Général — Directeur actuel",
    photo: "/images/directeurs/alfred-kouly-tine.jpg",
    dateDebut: "2024-07-18",
    periode: "Depuis le 18 Juillet 2024",
    contributionCourte: "Conduit la transformation numérique et le rayonnement sous-régional de l'INP.",
    contributionLongue: "Le Dr Alfred Kouly TINE conduit la transformation numérique et le rayonnement sous-régional de l'INP, tout en renforçant la modernisation scientifique et institutionnelle.",
    citation: "L'Institut national de Pédologie met son expertise scientifique au service du développement agricole durable et de la sécurité alimentaire de notre nation.",
    enPoste: true,
  },
];

export function getDirecteurEnPoste(): Directeur | undefined {
  return demoDirecteurs.find((d) => d.enPoste);
}

export function getDirecteursParOrdre(): Directeur[] {
  return [...demoDirecteurs].sort((a, b) => a.ordre - b.ordre);
}
