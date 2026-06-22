"use client";

import { motion } from "framer-motion";
import { OrgNode } from "./OrgNode";

const LINE_COLOR = "#1D4ED8";
const BORDER_PURPLE = "#6B21A8";

const LEFT_NODES = ["CDG", "Comptabilité", "RAF", "RRH"];
const RIGHT_NODES = ["AAT/CSTs", "RQ", "CIC", "SE", "Labo"];
const DIVISIONS = ["DCCA", "DRDI", "DFRS"];

/** Accolade bleue à gauche de DCCA / DRDI / DFRS */
function DivisionBrace() {
  return (
    <svg viewBox="0 0 24 80" className="h-full w-6 shrink-0" aria-hidden>
      <path
        d="M 20 2 L 20 8 Q 8 12 8 26 Q 8 40 20 40 M 20 40 Q 8 40 8 54 Q 8 68 20 76 L 20 78"
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrganigrammeStructure() {
  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 py-6">
          <OrgNode delay={0}>Conseil d&apos;Administration</OrgNode>
          <div className="h-8 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
          <OrgNode delay={0.05}>Direction Générale</OrgNode>
          <div className="h-12 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />

          {/* Niveau intermédiaire : tronc central + ligne horizontale + branches gauche/droite */}
          <div className="relative flex w-full max-w-4xl items-stretch">
            <div
              className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2"
              style={{ backgroundColor: LINE_COLOR }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-1 flex-col items-end justify-center gap-6 py-4">
              {LEFT_NODES.map((label, i) => (
                <div key={label} className="flex items-center justify-end">
                  <OrgNode delay={0.1 + i * 0.04}>{label}</OrgNode>
                  <div className="h-[2px] w-8 shrink-0" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
                </div>
              ))}
            </div>
            <div
              className="relative z-10 h-[280px] w-[2px] shrink-0 self-center"
              style={{ backgroundColor: LINE_COLOR }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-1 flex-col items-start justify-center gap-6 py-4">
              {RIGHT_NODES.map((label, i) => (
                <div key={label} className="flex items-center justify-start">
                  <div className="h-[2px] w-8 shrink-0" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
                  <OrgNode delay={0.1 + (4 + i) * 0.04}>{label}</OrgNode>
                </div>
              ))}
            </div>
          </div>

          <div className="h-10 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
          <OrgNode delay={0.35}>Direction Technique</OrgNode>
          <div className="h-10 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />

          {/* Délégations | Divisions + sous-branche Divisions */}
          <div className="flex w-full max-w-2xl flex-col items-center">
            <div className="h-[2px] w-full" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
            <div className="grid w-full grid-cols-2 gap-x-20 gap-y-0 pt-2">
              <div className="flex flex-col items-center">
                <div className="h-5 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
                <OrgNode delay={0.4}>Délégations</OrgNode>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-5 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
                <OrgNode delay={0.42}>Divisions</OrgNode>
                <div className="h-4 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
                <div className="relative flex items-start gap-0">
                  <div
                    className="absolute left-0 top-0 h-full w-[2px]"
                    style={{ backgroundColor: LINE_COLOR }}
                    aria-hidden
                  />
                  <div className="relative z-10 flex min-h-[140px] items-center pl-1">
                    <DivisionBrace />
                  </div>
                  <div className="relative z-10 flex flex-col gap-2 py-0">
                    {DIVISIONS.map((label, i) => (
                      <div key={label} className="flex items-center gap-0">
                        <div className="h-[2px] w-4 shrink-0" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
                        <OrgNode delay={0.45 + i * 0.03}>{label}</OrgNode>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-5 px-4 py-6 lg:hidden">
        <motion.div
          className="rounded-xl border-2 bg-white px-5 py-3.5 text-center text-sm font-semibold text-gray-800 shadow-sm"
          style={{ borderColor: BORDER_PURPLE }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Conseil d&apos;Administration
        </motion.div>
        <div className="mx-auto h-6 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
        <motion.div
          className="rounded-xl border-2 bg-white px-5 py-3.5 text-center text-sm font-semibold text-gray-800 shadow-sm"
          style={{ borderColor: BORDER_PURPLE }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          Direction Générale
        </motion.div>
        <div className="mx-auto h-6 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
        <div className="grid grid-cols-2 gap-2">
          {[...LEFT_NODES, ...RIGHT_NODES].map((n) => (
            <motion.span
              key={n}
              className="rounded-xl border-2 bg-white px-3 py-2.5 text-center text-xs font-semibold text-gray-800 shadow-sm"
              style={{ borderColor: BORDER_PURPLE }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25 }}
            >
              {n}
            </motion.span>
          ))}
        </div>
        <div className="mx-auto h-6 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
        <motion.div
          className="rounded-xl border-2 bg-white px-5 py-3.5 text-center text-sm font-semibold text-gray-800 shadow-sm"
          style={{ borderColor: BORDER_PURPLE }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          Direction Technique
        </motion.div>
        <div className="mx-auto h-6 w-[2px]" style={{ backgroundColor: LINE_COLOR }} aria-hidden />
        <div className="flex flex-col gap-3">
          <span
            className="rounded-xl border-2 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-800 shadow-sm"
            style={{ borderColor: BORDER_PURPLE }}
          >
            Délégations
          </span>
          <span
            className="rounded-xl border-2 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-800 shadow-sm"
            style={{ borderColor: BORDER_PURPLE }}
          >
            Divisions
          </span>
          <div className="ml-4 flex flex-col gap-2 border-l-2 pl-4" style={{ borderColor: LINE_COLOR }}>
            {DIVISIONS.map((d) => (
              <span
                key={d}
                className="rounded-lg border-2 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm"
                style={{ borderColor: BORDER_PURPLE }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
