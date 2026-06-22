interface TricolorUnderlineProps {
  className?: string;
  /** Largeur du soulignement (px si number, sinon valeur CSS ex. "100%") */
  width?: number | string;
  /** Hauteur du bandeau en px (défaut 4) */
  height?: number;
  /** Hauteur de l'étoile en px (défaut 16) */
  starSize?: number;
}

/**
 * Soulignement tricolore du Sénégal (vert / jaune / rouge) avec étoile verte
 * à 5 branches centrée dans la bande jaune. Couleurs officielles strictes.
 * L'étoile dépasse volontairement le bandeau pour rester lisible.
 */
export default function TricolorUnderline({
  className = "",
  width = 240,
  height = 4,
  starSize = 16,
}: TricolorUnderlineProps) {
  return (
    <div
      className={`relative flex ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: `${height}px`,
      }}
      role="img"
      aria-label="Drapeau du Sénégal"
    >
      {/* Bande verte */}
      <div className="flex-1" style={{ backgroundColor: "#00853F" }} />
      {/* Bande jaune */}
      <div className="flex-1" style={{ backgroundColor: "#FDEF42" }} />
      {/* Bande rouge */}
      <div className="flex-1" style={{ backgroundColor: "#E31B23" }} />

      {/* Étoile verte à 5 branches, centrée dans la bande jaune */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-sm"
        style={{ width: `${starSize}px`, height: `${starSize}px` }}
        aria-hidden
      >
        <polygon
          fill="#00853F"
          points="50,10 61.8,38.2 92.2,38.2 67.2,57.3 79,85.5 50,67.5 21,85.5 32.8,57.3 7.8,38.2 38.2,38.2"
        />
      </svg>
    </div>
  );
}
