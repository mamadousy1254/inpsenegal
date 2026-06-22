export interface HeroSlide {
  id: string;
  variant: "dg" | "thematic"; // "dg" pour la slide du DG, "thematic" pour les autres
  eyebrow: string; // Petit texte en haut, tout en majuscules
  title: string; // Titre principal — COURT (5-8 mots max)
  subtitle: string; // Sous-titre — 1 phrase claire
  description?: string; // Optionnel, citation ou texte additionnel
  image: string; // URL de l'image de fond
  imageAlt: string;
  imagePosition?: string; // object-position personnalisé (ex. "center 30%")
  // Pour la slide DG uniquement :
  dgName?: string;
  dgRole?: string;
  // CTAs
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export const heroSlides: HeroSlide[] = [
  // ─── SLIDE 1 : LE DG (vitrine institutionnelle) ───
  {
    id: "dg-welcome",
    variant: "dg",
    eyebrow: "MESSAGE DU DIRECTEUR GÉNÉRAL",
    title: "Bienvenue à l'INP",
    subtitle:
      "Au service de la science des sols et de la souveraineté alimentaire du Sénégal.",
    description:
      "« L'Institut national de Pédologie met son expertise scientifique au service du développement agricole durable et de la sécurité alimentaire de notre nation. »",
    image: "/images/direction/dg-portrait.png",
    imageAlt:
      "Dr Alfred Kouly TINE, Directeur Général de l'Institut national de Pédologie",
    dgName: "Dr Alfred Kouly TINE",
    dgRole: "Directeur Général de l'INP",
    primaryCta: { label: "Lire le mot du Directeur", href: "/institut/mot-directeur" },
    secondaryCta: { label: "Découvrir l'Institut", href: "/institut/presentation" },
  },
  // ─── SLIDE 2 : LE DG EN ACTION (expertise & terrain) ───
  {
    id: "dg-action",
    variant: "thematic",
    eyebrow: "EXPERTISE ET TERRAIN",
    title: "Une expertise au plus près du terrain",
    subtitle:
      "Le Directeur Général Dr Alfred Kouly TINE engage l'INP aux côtés des acteurs du développement agricole sénégalais et des partenaires institutionnels.",
    image: "/images/direction/slide-1-directeur.jpg",
    imageAlt:
      "Dr Alfred Kouly TINE, Directeur Général de l'INP, lors d'une présentation institutionnelle",
    imagePosition: "center 30%",
    primaryCta: { label: "Découvrir nos missions", href: "/institut/missions" },
    secondaryCta: { label: "Voir nos actualités", href: "/actualites" },
  },
  // ─── SLIDE 3 : TRANSMISSION & SENSIBILISATION (Journée Mondiale des Sols) ───
  {
    id: "journee-sols",
    variant: "thematic",
    eyebrow: "TRANSMISSION & SENSIBILISATION",
    title: "Partager la science des sols",
    subtitle:
      "L'INP mobilise le grand public, les écoles et les acteurs agricoles autour de la préservation et de la gestion durable des sols du Sénégal.",
    image: "/images/direction/slide-3-journee-sols.jpg",
    imageAlt:
      "Célébration de la Journée Mondiale des Sols par l'INP — Démonstration pédologique au grand public",
    imagePosition: "center center",
    primaryCta: { label: "Voir nos délégations", href: "/institut/organigramme" },
    secondaryCta: { label: "Nos actualités", href: "/actualites" },
  },
  // ─── SLIDE 4 : RECHERCHE & LABORATOIRES (laboratoire INP) ───
  {
    id: "laboratoire",
    variant: "thematic",
    eyebrow: "RECHERCHE & LABORATOIRES",
    title: "Une science rigoureuse, des résultats fiables",
    subtitle:
      "Nos laboratoires et nos partenariats scientifiques garantissent l'excellence des analyses pédologiques au service de l'agriculture sénégalaise.",
    image: "/images/direction/slide-2-labo.jpg",
    imageAlt: "Techniciens de l'INP au laboratoire d'analyse pédologique",
    imagePosition: "center center",
    primaryCta: { label: "Nos partenaires", href: "/partenaires" },
    secondaryCta: { label: "Publications scientifiques", href: "/documentation" },
  },
];
