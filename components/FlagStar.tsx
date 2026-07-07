/* ------------------------------------------------------------------ */
/*  Étoile verte à 5 branches du drapeau du Sénégal.                   */
/*                                                                     */
/*  À placer dans un conteneur `relative` : elle se centre en absolu   */
/*  (left-1/2 / top-1/2). Sur un bandeau tricolore vert-jaune-rouge à  */
/*  bandes égales, le centre (50 %) tombe sur la bande jaune — comme   */
/*  sur le vrai drapeau. Composant sans état (serveur ou client).      */
/* ------------------------------------------------------------------ */

export function FlagStar({
  size = 14,
  className = "",
}: {
  /** Taille de l'étoile en px (défaut 14). */
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-sm ${className}`}
      aria-hidden
    >
      <polygon
        fill="#00853F"
        points="50,10 61.8,38.2 92.2,38.2 67.2,57.3 79,85.5 50,67.5 21,85.5 32.8,57.3 7.8,38.2 38.2,38.2"
      />
    </svg>
  );
}
