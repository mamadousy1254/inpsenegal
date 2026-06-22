// Référentiel des grands types de sols du Sénégal — Institut national de Pédologie (INP)
// Caractérisations pédologiques générales basées sur la classification des sols du Sénégal.
// Données fournies à titre indicatif — les données parcellaires précises sont disponibles
// via une demande d'analyse auprès de l'INP. Enrichissable via le back-office.

export type NiveauFertilite = "Élevée" | "Moyenne" | "Faible" | "Très faible";
export type RisqueErosion = "Faible" | "Modéré" | "Élevé" | "Très élevé";
export type Salinisation = "Absente" | "Faible" | "Modérée" | "Forte";
export type UsageAgricole =
  | "Cultures pluviales"
  | "Cultures irriguées"
  | "Maraîchage"
  | "Pâturages"
  | "Forêts"
  | "Non exploité";

export interface TypeSol {
  id: string;
  nom: string;
  description: string;
  caracteristiques: string;   // détail pédologique étendu (pour la fiche détaillée)
  regions: string[];
  fertilite: NiveauFertilite;
  erosion: RisqueErosion;
  salinisation: Salinisation;
  usages: UsageAgricole[];
  couleur: string;            // couleur d'accent de la fiche
}

export const demoSols: TypeSol[] = [
  {
    id: "ferralitiques",
    nom: "Sols ferralitiques",
    description:
      "Sols profonds, acides et fortement altérés. Bonne capacité de rétention hydrique, adaptés aux cultures tropicales.",
    caracteristiques:
      "Sols caractéristiques des zones les plus humides du Sénégal (Casamance, sud-est). Riches en sesquioxydes de fer et d'aluminium, ils présentent une forte altération et une acidité marquée. Leur profondeur et leur structure favorisent l'enracinement et le stockage de l'eau, mais leur faible réserve en bases nécessite une gestion attentive de la fertilité.",
    regions: ["Ziguinchor", "Kolda", "Sédhiou", "Kédougou"],
    fertilite: "Moyenne",
    erosion: "Élevé",
    salinisation: "Absente",
    usages: ["Cultures pluviales", "Forêts"],
    couleur: "#7B4F2A",
  },
  {
    id: "ferrugineux-tropicaux",
    nom: "Sols ferrugineux tropicaux",
    description:
      "Sols à sesquioxydes de fer, texture sableuse à sablo-argileuse. Dominants dans le bassin arachidier.",
    caracteristiques:
      "Sols les plus répandus dans le bassin arachidier sénégalais. Leur texture sableuse à sablo-argileuse et leur teneur modérée en matière organique en font des sols de fertilité moyenne, sensibles à l'appauvrissement sous culture continue. Ils constituent le socle de la production arachidière et céréalière du pays.",
    regions: ["Kaolack", "Kaffrine", "Tambacounda", "Diourbel"],
    fertilite: "Moyenne",
    erosion: "Modéré",
    salinisation: "Absente",
    usages: ["Cultures pluviales"],
    couleur: "#C9A574",
  },
  {
    id: "hydromorphes",
    nom: "Sols hydromorphes",
    description:
      "Sols de bas-fonds et zones inondables. Engorgement saisonnier, potentiel rizicole et maraîcher.",
    caracteristiques:
      "Sols des vallées, bas-fonds et zones inondables, marqués par un engorgement en eau saisonnier ou permanent. Leur richesse en matière organique et leur position topographique en font des sols à fort potentiel agricole, particulièrement pour la riziculture et le maraîchage irrigué, sous réserve d'une maîtrise de l'eau.",
    regions: ["Saint-Louis", "Matam", "Fatick", "Sédhiou"],
    fertilite: "Élevée",
    erosion: "Faible",
    salinisation: "Modérée",
    usages: ["Cultures irriguées", "Maraîchage"],
    couleur: "#5A6F47",
  },
  {
    id: "halomorphes",
    nom: "Sols halomorphes",
    description:
      "Sols salés ou alcalins (tannes). Contraintes de salinité nécessitant des aménagements spécifiques.",
    caracteristiques:
      "Sols salés ou alcalins, localement appelés « tannes », principalement présents dans les estuaires et le delta du Sine-Saloum. Leur forte salinité limite fortement les usages agricoles et impose des aménagements de désalinisation ou de protection contre les remontées salines. Ils font l'objet de programmes de restauration des terres.",
    regions: ["Fatick", "Kaolack", "Ziguinchor"],
    fertilite: "Très faible",
    erosion: "Faible",
    salinisation: "Forte",
    usages: ["Non exploité"],
    couleur: "#9B59B6",
  },
  {
    id: "sableux-dior",
    nom: "Sols sableux (dior)",
    description:
      "Sols sableux dunaires, faible capacité de rétention, sensibles à l'érosion éolienne. Culture d'arachide et mil.",
    caracteristiques:
      "Sols sableux dunaires, localement appelés « dior », dominants dans le nord du bassin arachidier et la zone des Niayes. Leur faible capacité de rétention en eau et en éléments nutritifs, ainsi que leur grande sensibilité à l'érosion éolienne, en font des sols fragiles. Ils supportent néanmoins les cultures d'arachide et de mil, et le maraîchage intensif dans les Niayes.",
    regions: ["Louga", "Thiès", "Diourbel", "Dakar"],
    fertilite: "Faible",
    erosion: "Très élevé",
    salinisation: "Absente",
    usages: ["Cultures pluviales", "Maraîchage"],
    couleur: "#D4A574",
  },
  {
    id: "mineraux-bruts",
    nom: "Sols minéraux bruts",
    description:
      "Sols peu évolués sur cuirasse ou roche. Faible potentiel agricole sans aménagement.",
    caracteristiques:
      "Sols peu évolués développés sur cuirasse latéritique ou roche affleurante, principalement sur les plateaux et zones de relief. Leur faible profondeur et leur pauvreté en matière organique limitent fortement leur potentiel agricole. Ils sont surtout utilisés pour le pâturage extensif ou demeurent non exploités.",
    regions: ["Thiès", "Tambacounda", "Kédougou"],
    fertilite: "Très faible",
    erosion: "Modéré",
    salinisation: "Absente",
    usages: ["Pâturages", "Non exploité"],
    couleur: "#8B7355",
  },
];

// ─── Options de filtres ───
export const REGIONS_SENEGAL = [
  "Dakar", "Thiès", "Saint-Louis", "Matam", "Louga", "Diourbel",
  "Fatick", "Kaolack", "Kaffrine", "Tambacounda", "Kédougou",
  "Kolda", "Sédhiou", "Ziguinchor",
];

export const TYPES_SOL = demoSols.map((s) => s.nom);
export const NIVEAUX_FERTILITE: NiveauFertilite[] = ["Élevée", "Moyenne", "Faible", "Très faible"];
export const RISQUES_EROSION: RisqueErosion[] = ["Faible", "Modéré", "Élevé", "Très élevé"];
export const NIVEAUX_SALINISATION: Salinisation[] = ["Absente", "Faible", "Modérée", "Forte"];
export const USAGES_AGRICOLES: UsageAgricole[] = [
  "Cultures pluviales", "Cultures irriguées", "Maraîchage", "Pâturages", "Forêts", "Non exploité",
];

// ─── Structure des filtres actifs ───
export interface FiltresSols {
  type: string[];
  region: string[];
  fertilite: string[];
  erosion: string[];
  salinisation: string[];
  usage: string[];
}

export const FILTRES_VIDES: FiltresSols = {
  type: [], region: [], fertilite: [], erosion: [], salinisation: [], usage: [],
};

/** Un sol correspond si, pour chaque catégorie active, il satisfait au moins une valeur cochée (OR intra-catégorie, AND inter-catégories). */
export function filtrerSols(sols: TypeSol[], filtres: FiltresSols): TypeSol[] {
  const match = (selected: string[], values: string[]) =>
    selected.length === 0 || selected.some((s) => values.includes(s));

  return sols.filter(
    (sol) =>
      match(filtres.type, [sol.nom]) &&
      match(filtres.region, sol.regions) &&
      match(filtres.fertilite, [sol.fertilite]) &&
      match(filtres.erosion, [sol.erosion]) &&
      match(filtres.salinisation, [sol.salinisation]) &&
      match(filtres.usage, sol.usages)
  );
}

export function compterFiltresActifs(filtres: FiltresSols): number {
  return Object.values(filtres).reduce((acc, arr) => acc + arr.length, 0);
}
