import {
  Sprout,
  Mountain,
  Droplets,
  FlaskConical,
  BarChart3,
  Leaf,
  Microscope,
  Globe2,
  type LucideIcon,
} from "lucide-react";
import type {
  ResearchAxisColor,
  ResearchAxisIcon,
} from "@/lib/constants/cms";

export const RESEARCH_AXIS_ICON_MAP: Record<ResearchAxisIcon, LucideIcon> = {
  sprout: Sprout,
  mountain: Mountain,
  droplets: Droplets,
  flask: FlaskConical,
  chart: BarChart3,
  leaf: Leaf,
  microscope: Microscope,
  globe: Globe2,
};

// Classes Tailwind écrites en toutes lettres pour être détectées à la compilation.
export const RESEARCH_AXIS_COLOR_MAP: Record<ResearchAxisColor, string> = {
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  violet: "bg-violet-50 text-violet-600 border-violet-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  teal: "bg-teal-50 text-teal-600 border-teal-100",
};

export function getResearchAxisIcon(icon: ResearchAxisIcon): LucideIcon {
  return RESEARCH_AXIS_ICON_MAP[icon] ?? Sprout;
}

export function getResearchAxisColor(color: ResearchAxisColor): string {
  return RESEARCH_AXIS_COLOR_MAP[color] ?? RESEARCH_AXIS_COLOR_MAP.amber;
}
