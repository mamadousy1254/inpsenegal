"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HERO_PIN_DURATION_VH,
  HERO_SLIDES_COUNT,
  REDUCED_MOTION_MEDIA,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSceneProps {
  children: React.ReactNode;
  /** When false, no pin/scrub – content scrolls normally (reduced motion / mobile) */
  enabled?: boolean;
  /** Optional id for the pinned section (for scroll-into-view) */
  id?: string;
  className?: string;
}

export function ScrollScene({
  children,
  enabled = true,
  id = "hero-3d-scene",
  className = "",
}: ScrollSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const mm = window.matchMedia(REDUCED_MOTION_MEDIA);
    setReducedMotion(mm.matches);
    const handler = () => setReducedMotion(mm.matches);
    mm.addEventListener("change", handler);
    return () => mm.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotion || !containerRef.current || !viewportRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const endOffset = `${HERO_PIN_DURATION_VH}vh`;
      ScrollTrigger.create({
        trigger: containerRef.current!,
        start: "top top",
        end: `+=${endOffset}`,
        pin: viewportRef.current,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const y = -progress * (HERO_SLIDES_COUNT - 1) * 100;
          const subtleRotate = (progress - 0.5) * 2;
          gsap.set(contentRef.current, {
            y: `${y}vh`,
            rotateX: subtleRotate * 1.2,
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [enabled, reducedMotion]);

  const useStatic = !enabled || reducedMotion;

  return (
    <div
      id={id}
      ref={containerRef}
      className={cn(className, "min-h-screen w-full")}
      style={
        useStatic
          ? { height: "100vh", minHeight: "100vh" }
          : { height: `calc(${HERO_PIN_DURATION_VH}vh + 100vh)` }
      }
    >
      <div
        ref={viewportRef}
        className={cn(
          "relative w-full min-h-screen",
          useStatic
            ? "h-full min-h-[100vh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
            : "h-screen overflow-hidden"
        )}
        style={{
          perspective: useStatic ? undefined : "1200px",
        }}
      >
        <div
          ref={contentRef}
          className={cn(
            "relative w-full",
            useStatic && "flex flex-col min-h-[300vh]"
          )}
          style={{
            height: useStatic ? undefined : `${HERO_SLIDES_COUNT * 100}vh`,
            minHeight: useStatic ? `${HERO_SLIDES_COUNT * 100}vh` : undefined,
            transformStyle: useStatic ? undefined : "preserve-3d",
            willChange: useStatic ? undefined : "transform",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
