"use client";

import { useState, useEffect, useCallback } from "react";

/** Parallax offset from mouse position (normalized -0.5 to 0.5) */
const PARALLAX_SENSITIVITY = 0.03;

export interface ParallaxState {
  x: number;
  y: number;
}

export function useParallax(enabled: boolean): ParallaxState {
  const [state, setState] = useState<ParallaxState>({ x: 0, y: 0 });

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX / w - 0.5) * PARALLAX_SENSITIVITY;
      const y = (e.clientY / h - 0.5) * PARALLAX_SENSITIVITY;
      setState({ x, y });
    },
    [enabled]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [handleMove]);

  return state;
}
