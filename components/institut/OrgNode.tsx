"use client";

import { motion } from "framer-motion";

interface OrgNodeProps {
  children: React.ReactNode;
  /** Délai pour animation séquentielle */
  delay?: number;
}

const LINE_BLUE = "#1D4ED8";
const BORDER_PURPLE = "#6B21A8";

export function OrgNode({ children, delay = 0 }: OrgNodeProps) {
  return (
    <motion.div
      className="rounded-xl border-2 bg-white px-6 py-3 text-center font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:shadow-md"
      style={{ borderColor: BORDER_PURPLE }}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Couleur ligne institutionnelle (export pour cohérence) */
export const ORG_LINE_COLOR = LINE_BLUE;
export const ORG_BORDER_COLOR = BORDER_PURPLE;
