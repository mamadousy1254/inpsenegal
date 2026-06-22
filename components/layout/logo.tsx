"use client";

import Image from "next/image";

const logoSrc = "/assets/inp-logo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <>
      <Image
        src={logoSrc}
        alt="INP – Institut national de Pédologie"
        width={52}
        height={52}
        className={className}
        priority
        unoptimized
      />
    </>
  );
}

/** Logo SVG minimal (triangle + INP) pour fallback ou usage sans image */
export function LogoSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id="inp-earth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A574" />
          <stop offset="100%" stopColor="#8B5E3C" />
        </linearGradient>
      </defs>
      <path
        d="M60 8 L112 132 L8 132 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-foreground"
      />
      <path
        d="M60 8 L60 132 M8 132 L60 48 L112 132 M60 48 L8 132 M60 48 L112 132"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
        className="text-foreground"
      />
      <text
        x="60"
        y="125"
        textAnchor="middle"
        fill="url(#inp-earth)"
        className="text-[28px] font-bold tracking-tight"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        INP
      </text>
    </svg>
  );
}
