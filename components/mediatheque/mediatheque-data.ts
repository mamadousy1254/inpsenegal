export type MediathequeSeedItem = {
  src: string;
  alt: string;
  caption: string;
  /** Ordre d'affichage (1 = plus récente au seed) */
  order: number;
};

export const MEDIATHEQUE_GALLERY: MediathequeSeedItem[] = [
  { order: 1, src: "/images/mediatheque/inp/1.jpg", alt: "Suivi des essais sur le terrain", caption: "Suivi des essais sur le terrain" },
  { order: 2, src: "/images/mediatheque/inp/2.jpg", alt: "Validation technique des sols", caption: "Validation technique des sols" },
  { order: 3, src: "/images/mediatheque/inp/3.jpg", alt: "Mission d'inspection des pépinières", caption: "Mission d'inspection des pépinières" },
  { order: 4, src: "/images/mediatheque/inp/4.jpg", alt: "Analyse et diagnostic", caption: "Analyse et diagnostic en laboratoire" },
  { order: 5, src: "/images/mediatheque/inp/5.jpg", alt: "Réunion stratégique INP", caption: "Réunion stratégique INP" },
  { order: 6, src: "/images/mediatheque/inp/6.jpg", alt: "Collecte de données de terrain", caption: "Collecte de données de terrain" },
  { order: 7, src: "/images/mediatheque/inp/7.jpg", alt: "Rencontre technique", caption: "Rencontre technique institutionnelle" },
  { order: 8, src: "/images/mediatheque/inp/8.jpg", alt: "Évaluation des cultures", caption: "Évaluation des cultures sur le terrain" },
  { order: 9, src: "/images/mediatheque/inp/9.jpg", alt: "Travaux de recherche", caption: "Travaux de recherche scientifique" },
  { order: 10, src: "/images/mediatheque/inp/10.jpg", alt: "Partenariat multilatéral", caption: "Partenariat multilatéral" },
  { order: 11, src: "/images/mediatheque/inp/11.jpg", alt: "Atelier de restitution", caption: "Atelier de restitution" },
  { order: 12, src: "/images/mediatheque/inp/12.jpg", alt: "Sensibilisation des producteurs", caption: "Sensibilisation des producteurs agricoles" },
  { order: 13, src: "/images/mediatheque/inp/13.jpg", alt: "Prélèvements pédologiques", caption: "Prélèvements pédologiques sur le terrain" },
  { order: 14, src: "/images/mediatheque/inp/14.jpg", alt: "Restauration des écosystèmes", caption: "Restauration des écosystèmes et des sols" },
  { order: 15, src: "/images/mediatheque/inp/15.jpg", alt: "Conférence scientifique", caption: "Conférence scientifique" },
  { order: 16, src: "/images/mediatheque/inp/16.jpg", alt: "Coopération internationale", caption: "Coopération internationale" },
  { order: 17, src: "/images/mediatheque/inp/17.jpg", alt: "Engagement des communautés", caption: "Engagement des communautés locales" },
  { order: 18, src: "/images/mediatheque/inp/18.jpg", alt: "Renforcement des capacités", caption: "Renforcement des capacités techniques" },
  { order: 19, src: "/images/mediatheque/inp/19.jpg", alt: "Vulgarisation agricole", caption: "Vulgarisation agricole sur le terrain" },
  { order: 20, src: "/images/mediatheque/inp/20.jpg", alt: "Caractérisation de la fertilité", caption: "Caractérisation de la fertilité des sols" },
  { order: 21, src: "/images/mediatheque/inp/21.jpg", alt: "Promotion des bio-fertilisants", caption: "Promotion des bio-fertilisants" },
  { order: 22, src: "/images/mediatheque/inp/22.jpg", alt: "Cartographie et SIG", caption: "Cartographie et systèmes d'information géographique" },
  { order: 23, src: "/images/mediatheque/inp/23.jpg", alt: "Diagnostic de dégradation", caption: "Diagnostic de dégradation des sols" },
  { order: 24, src: "/images/mediatheque/inp/24.jpg", alt: "Suivi-évaluation des projets", caption: "Suivi-évaluation des projets" },
  { order: 25, src: "/images/mediatheque/inp/25.jpg", alt: "Formation des acteurs", caption: "Formation des acteurs du secteur agricole" },
  { order: 26, src: "/images/mediatheque/inp/26.jpg", alt: "Comité de pilotage", caption: "Comité de pilotage institutionnel" },
  { order: 27, src: "/images/mediatheque/inp/27.jpg", alt: "Synergie d'actions INP", caption: "Synergie d'actions pour l'INP" },
];

export function localMediathequePublicId(src: string): string {
  const match = src.match(/\/inp\/(\d+)\.jpg$/);
  return match ? `local/mediatheque/inp/${match[1]}` : `local/mediatheque/${src.replace(/\W+/g, "-")}`;
}

/** Date décroissante : image 1 la plus récente, espacement de 7 jours */
export function publishedAtForMediathequeOrder(order: number): Date {
  const base = Date.UTC(2024, 11, 31, 12, 0, 0);
  const daysBack = (order - 1) * 7;
  return new Date(base - daysBack * 24 * 60 * 60 * 1000);
}
