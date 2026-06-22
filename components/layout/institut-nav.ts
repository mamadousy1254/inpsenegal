/**
 * Sous-pages "L'Institut" pour le mega menu et le menu mobile.
 */

export const INSTITUT_SUBLINKS = [
  // Colonne 1 — Présentation
  { href: "/institut/presentation", label: "Présentation de l'INP" },
  { href: "/institut/objectifs", label: "Objectifs de l'INP" },
  { href: "/institut/missions", label: "Missions de l'INP" },
  { href: "/institut/axes-intervention", label: "Axes d'intervention" },
  // Colonne 2 — Organisation
  { href: "/institut/organigramme", label: "Organigramme et ancrage territorial" },
  { href: "/institut/cadre-juridique", label: "Cadre juridique" },
  { href: "/institut/mot-directeur", label: "Le mot du Directeur" },
  { href: "/institut/equipe", label: "Notre équipe" },
] as const;

export const INSTITUT_COL1 = INSTITUT_SUBLINKS.slice(0, 4);
export const INSTITUT_COL2 = INSTITUT_SUBLINKS.slice(4);
