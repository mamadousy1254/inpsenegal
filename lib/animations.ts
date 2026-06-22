/**
 * INP – Utilities for Hero 3D and scroll animations.
 * Respects prefers-reduced-motion for accessibility.
 */

export const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(REDUCED_MOTION_MEDIA).matches;
}

export function useReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(REDUCED_MOTION_MEDIA).matches;
}

/**
 * Call from client; returns whether we should run full 3D/scroll animations.
 * On server or when reduced-motion, use static hero.
 */
export function shouldUseImmersiveHero(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia(REDUCED_MOTION_MEDIA).matches;
}

/** GSAP easing presets for institutional feel – smooth, not flashy */
export const EASE = {
  smooth: "power2.inOut",
  out: "power2.out",
  in: "power2.in",
} as const;

/** ScrollTrigger / pin durations (in vh) */
export const HERO_PIN_DURATION_VH = 200;
export const HERO_SLIDES_COUNT = 3;
