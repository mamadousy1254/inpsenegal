interface SenegalFlagProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  title?: string;
}

/**
 * Drapeau officiel de la République du Sénégal.
 * Emblème national — proportions 3:2, 3 bandes verticales égales
 * (vert #00853F, jaune #FDEF42, rouge #E31B23) et étoile verte à 5 branches
 * centrée dans la bande jaune. Aucune stylisation libre (institution publique).
 */
export default function SenegalFlag({
  className = "",
  width = 60,
  height = 40,
  title = "Drapeau du Sénégal",
}: SenegalFlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Bande verte (gauche) */}
      <rect x="0" y="0" width="300" height="600" fill="#00853F" />
      {/* Bande jaune (centre) */}
      <rect x="300" y="0" width="300" height="600" fill="#FDEF42" />
      {/* Bande rouge (droite) */}
      <rect x="600" y="0" width="300" height="600" fill="#E31B23" />
      {/* Étoile verte à 5 branches, centrée dans la bande jaune (cx=450, cy=300) */}
      <polygon
        fill="#00853F"
        points="450,225 467.6,279.1 524.5,279.1 478.5,312.6 496,366.6 450,333.1 404,366.6 421.5,312.6 375.5,279.1 432.4,279.1"
      />
    </svg>
  );
}
