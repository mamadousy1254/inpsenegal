// Partenaires officiels de l'Institut national de Pédologie (INP)
// Logos transmis officiellement par les services de l'INP
// Données enrichissables via le back-office

import {
  PARTENAIRE_CATEGORY_COLORS,
  PARTENAIRE_CATEGORY_LABELS,
  type PartenaireCategory,
} from "@/lib/constants/partenaires";

export type { PartenaireCategory };

export interface Partenaire {
  id: string;
  nom: string;
  acronyme: string;
  description: string;
  category: PartenaireCategory;
  logo: string;
  siteWeb?: string;
  pays?: string;
}

export const categoryLabels = PARTENAIRE_CATEGORY_LABELS;
export const categoryColors = PARTENAIRE_CATEGORY_COLORS;

export const demoPartenaires: Partenaire[] = [
  // ─── GOUVERNEMENT & AGENCES PUBLIQUES ───
  {
    id: "ageroute",
    nom: "Agence des Travaux et de Gestion des Routes",
    acronyme: "AGEROUTE",
    description: "Agence nationale chargée de la construction et de l'entretien du réseau routier sénégalais.",
    category: "gouvernement",
    logo: "/images/partenaires/ageroute.png",
    siteWeb: "https://www.ageroute.sn",
    pays: "Sénégal",
  },
  {
    id: "anrsa",
    nom: "Agence Nationale de la Recherche Scientifique Appliquée",
    acronyme: "ANRSA",
    description: "Agence nationale de promotion et de financement de la recherche scientifique appliquée au Sénégal.",
    category: "gouvernement",
    logo: "/images/partenaires/anrsa.jpg",
    pays: "Sénégal",
  },
  {
    id: "fndasp",
    nom: "Fonds National de Développement Agro-Sylvo-Pastoral",
    acronyme: "FNDASP",
    description: "Fonds public dédié au financement et à l'appui des activités agro-sylvo-pastorales au Sénégal.",
    category: "gouvernement",
    logo: "/images/partenaires/fndasp.png",
    pays: "Sénégal",
  },
  {
    id: "saed",
    nom: "Société d'Aménagement et d'Exploitation des Terres du Delta",
    acronyme: "SAED",
    description: "Société publique chargée de l'aménagement et de l'exploitation agricole des terres du Delta du fleuve Sénégal.",
    category: "gouvernement",
    logo: "/images/partenaires/saed.jpg",
    siteWeb: "https://www.saed.sn",
    pays: "Sénégal",
  },
  {
    id: "sodagri",
    nom: "Société de Développement Agricole et Industriel",
    acronyme: "SODAGRI",
    description: "Société nationale dédiée au développement agricole et industriel intégré de la zone Anambé.",
    category: "gouvernement",
    logo: "/images/partenaires/sodagri.jpg",
    pays: "Sénégal",
  },

  // ─── PARTENAIRES INTERNATIONAUX ───
  {
    id: "enabel",
    nom: "Agence belge de développement",
    acronyme: "Enabel",
    description: "Agence belge de coopération internationale pour le développement, partenaire technique de l'INP.",
    category: "international",
    logo: "/images/partenaires/enabel.jpg",
    siteWeb: "https://www.enabel.be",
    pays: "Belgique",
  },
  {
    id: "fida",
    nom: "Fonds International de Développement Agricole",
    acronyme: "FIDA / IFAD",
    description: "Agence spécialisée des Nations Unies dédiée à l'éradication de la pauvreté rurale et à la sécurité alimentaire.",
    category: "international",
    logo: "/images/partenaires/fida.png",
    siteWeb: "https://www.ifad.org",
    pays: "Nations Unies",
  },

  // ─── UNIVERSITÉS ───
  {
    id: "uasz",
    nom: "Université Assane Seck de Ziguinchor",
    acronyme: "UASZ",
    description: "Université publique sénégalaise basée à Ziguinchor, partenaire scientifique de l'INP en Casamance.",
    category: "universite",
    logo: "/images/partenaires/uasz.png",
    siteWeb: "https://www.univ-zig.sn",
    pays: "Sénégal",
  },
  {
    id: "ugb",
    nom: "Université Gaston Berger de Saint-Louis",
    acronyme: "UGB",
    description: "Université publique sénégalaise de Saint-Louis, partenaire de recherche et de formation pédologique.",
    category: "universite",
    logo: "/images/partenaires/ugb.jpg",
    siteWeb: "https://www.ugb.sn",
    pays: "Sénégal",
  },
  {
    id: "ussein",
    nom: "Université du Sine-Saloum El Hadj Ibrahima Niass",
    acronyme: "USSEIN",
    description: "Université publique sénégalaise dédiée aux sciences agricoles et environnementales, partenaire académique de l'INP.",
    category: "universite",
    logo: "/images/partenaires/ussein.png",
    siteWeb: "https://www.ussein.sn",
    pays: "Sénégal",
  },

  // ─── SOCIÉTÉ CIVILE & ORGANISATIONS PROFESSIONNELLES ───
  {
    id: "asprodeb",
    nom: "Association Sénégalaise pour la Promotion du Développement à la Base",
    acronyme: "ASPRODEB",
    description: "Association d'appui au développement rural et à la promotion des activités productives à la base.",
    category: "societe-civile",
    logo: "/images/partenaires/asprodeb.jpg",
    pays: "Sénégal",
  },
  {
    id: "cncr",
    nom: "Conseil National de Concertation et de Coopération des Ruraux",
    acronyme: "CNCR",
    description: "Plateforme nationale d'organisations paysannes œuvrant pour la défense et la promotion du monde rural sénégalais.",
    category: "societe-civile",
    logo: "/images/partenaires/cncr.jpg",
    siteWeb: "https://www.cncr.org",
    pays: "Sénégal",
  },
  {
    id: "dytaes",
    nom: "Dynamique pour une Transition Agroécologique au Sénégal",
    acronyme: "DyTAES",
    description: "Plateforme de la société civile dédiée à la promotion de la transition agroécologique nationale.",
    category: "societe-civile",
    logo: "/images/partenaires/dytaes.jpg",
    pays: "Sénégal",
  },

  // ─── RECHERCHE & THINK TANK ───
  {
    id: "ceres-locustox",
    nom: "Centre Régional de Recherches en Écotoxicologie et Sécurité Environnementale",
    acronyme: "CERES-Locustox",
    description: "Centre régional de recherche en écotoxicologie et sécurité environnementale, partenaire scientifique de l'INP.",
    category: "recherche",
    logo: "/images/partenaires/ceres-locustox.png",
    pays: "Sénégal",
  },
  {
    id: "ipar",
    nom: "Initiative Prospective Agricole et Rurale",
    acronyme: "IPAR",
    description: "Think tank sénégalais dédié à la recherche sur les politiques agricoles et le développement rural.",
    category: "recherche",
    logo: "/images/partenaires/ipar.png",
    siteWeb: "https://www.ipar.sn",
    pays: "Sénégal",
  },
];

export function getPartenairesByCategory(cat: PartenaireCategory): Partenaire[] {
  return demoPartenaires.filter((p) => p.category === cat);
}
