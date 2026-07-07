"use client";

import { useRef, useEffect, useState } from "react";

/** Carte Sénégal simplifiée (wireframe) – path SVG */
const SENEGAL_PATH =
  "M50 8 L82 26 L86 48 L72 72 L52 98 L42 112 L28 116 L14 98 L8 72 L12 48 L26 26 Z";

interface SoilMapSceneProps {
  /** Désactiver sur mobile / reduced-motion */
  enabled?: boolean;
  className?: string;
}

export function SoilMapScene({ enabled = true, className = "" }: SoilMapSceneProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !enabled) {
    return (
      <div
        className={`${className} flex items-center justify-center`}
        aria-hidden
        style={{ opacity: 0.06 }}
      >
        <svg
          viewBox="0 0 100 120"
          className="max-h-[40vmin] w-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          style={{ color: "var(--inp-vert)" }}
        >
          <path d={SENEGAL_PATH} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`hero-map-3d ${className}`}
      aria-hidden
      style={{
        perspective: "800px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={groupRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          animation: "hero-map-rotate 24s linear infinite",
        }}
      >
        {/* Carte wireframe avec glow */}
        <div
          className="relative"
          style={{
            transform: "translateZ(0px) rotateX(8deg)",
            filter: "drop-shadow(0 0 20px rgba(123, 79, 42, 0.15))",
          }}
        >
          <svg
            viewBox="0 0 100 120"
            className="w-[min(55vmin,320px)] h-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            style={{ color: "var(--inp-vert)" }}
          >
            <defs>
              <linearGradient id="hero-map-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--inp-vert)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--inp-vert)" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path d={SENEGAL_PATH} stroke="url(#hero-map-glow)" />
          </svg>
        </div>

        {/* Ligne de scan verticale */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center"
          style={{ animation: "hero-scan 4s ease-in-out infinite" }}
        >
          <div
            className="w-px h-full"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(123,79,42,0.25), transparent)",
              boxShadow: "0 0 12px rgba(123,79,42,0.2)",
            }}
          />
        </div>

        {/* Points lumineux (discrets) */}
        {[
          { x: "42%", y: "35%" },
          { x: "58%", y: "55%" },
          { x: "48%", y: "72%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-inp-vert opacity-40"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 8px rgba(123,79,42,0.5)",
              animation: `hero-point-pulse 2s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
