"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, FlaskConical, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  institutSublinks?: { href: string; label: string }[];
  activitesSublinks?: { href: string; label: string }[];
  rechercheSublinks?: { href: string; label: string }[];
  documentationSublinks?: { href: string; label: string }[];
  liensUtilesLinks?: { label: string; url: string }[];
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, damping: 30, stiffness: 300 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.06 * i + 0.15, duration: 0.3, ease: "easeOut" as const },
  }),
};

export function MobileMenu({
  open,
  onClose,
  links,
  institutSublinks = [],
  activitesSublinks = [],
  rechercheSublinks = [],
  documentationSublinks = [],
  liensUtilesLinks = [],
}: MobileMenuProps) {
  const pathname = usePathname();
  const [institutExpanded, setInstitutExpanded] = useState(false);
  const [activitesExpanded, setActivitesExpanded] = useState(false);
  const [rechercheExpanded, setRechercheExpanded] = useState(false);
  const [documentationExpanded, setDocumentationExpanded] = useState(false);
  const [liensUtilesExpanded, setLiensUtilesExpanded] = useState(false);
  const isInstitutActive =
    pathname === "/institut" || pathname.startsWith("/institut/");
  const isActivitesActive =
    pathname === "/activites" || pathname.startsWith("/activites/");
  const isRechercheActive =
    pathname === "/recherche" || pathname.startsWith("/recherche/");
  const isDocumentationActive =
    pathname === "/documentation" || pathname.startsWith("/documentation/");

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            className="fixed inset-y-0 right-0 z-[100] flex w-[min(85vw,360px)] flex-col bg-white shadow-2xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Top bar */}
            <div className="flex h-20 items-center justify-between border-b border-border/60 px-6">
              <Image
                src="/images/logo-inp.png"
                alt="INP"
                width={281}
                height={215}
                unoptimized
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)]"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Navigation mobile">
              <ul className="space-y-1">
                {links.map((link, i) => {
                  const isLInstitut =
                    link.label === "L'Institut" && institutSublinks.length > 0;
                  const isActivitesTopLevel =
                    link.label === "Activités" && activitesSublinks.length > 0;
                  const isRechercheTopLevel =
                    link.label === "Recherche" && rechercheSublinks.length > 0;
                  const isDocumentationTopLevel =
                    link.label === "Documentation" && documentationSublinks.length > 0;
                  const isActive =
                    !isLInstitut &&
                    !isActivitesTopLevel &&
                    !isRechercheTopLevel &&
                    !isDocumentationTopLevel &&
                    (pathname === link.href || pathname.startsWith(link.href + "/"));

                  if (isLInstitut) {
                    return (
                      <motion.li
                        key={link.href}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="rounded-lg">
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                              "relative flex items-center rounded-lg px-4 py-3 text-[15px] font-medium transition-colors",
                              "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                              isInstitutActive
                                ? "bg-[var(--inp-vert)]/8 text-[var(--inp-vert)]"
                                : "text-foreground/80"
                            )}
                          >
                            {isInstitutActive && (
                              <span
                                className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--inp-vert)]"
                                aria-hidden
                              />
                            )}
                            {link.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setInstitutExpanded((e) => !e)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-[13px] text-foreground/60"
                            aria-expanded={institutExpanded}
                          >
                            <span>
                              {institutExpanded ? "Masquer les sous-pages" : "Voir les sous-pages"}
                            </span>
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform", institutExpanded && "rotate-180")}
                            />
                          </button>
                          <AnimatePresence>
                            {institutExpanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4"
                              >
                                {institutSublinks.map((sub) => {
                                  const subActive =
                                    pathname === sub.href || pathname.startsWith(sub.href + "/");
                                  return (
                                    <li key={sub.href}>
                                      <Link
                                        href={sub.href}
                                        onClick={onClose}
                                        className={cn(
                                          "block rounded-lg px-3 py-2.5 text-[14px] transition-colors",
                                          "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                                          subActive
                                            ? "font-semibold text-[var(--inp-vert)]"
                                            : "text-foreground/70"
                                        )}
                                      >
                                        {sub.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.li>
                    );
                  }

                  const isActivites =
                    link.label === "Activités" && activitesSublinks.length > 0;

                  if (isActivites) {
                    return (
                      <motion.li
                        key={link.href}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="rounded-lg">
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                              "relative flex items-center rounded-lg px-4 py-3 text-[15px] font-medium transition-colors",
                              "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                              isActivitesActive
                                ? "bg-[var(--inp-vert)]/8 text-[var(--inp-vert)]"
                                : "text-foreground/80"
                            )}
                          >
                            {isActivitesActive && (
                              <span
                                className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--inp-vert)]"
                                aria-hidden
                              />
                            )}
                            {link.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setActivitesExpanded((e) => !e)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-[13px] text-foreground/60"
                            aria-expanded={activitesExpanded}
                          >
                            <span>
                              {activitesExpanded ? "Masquer les sous-pages" : "Voir les sous-pages"}
                            </span>
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform", activitesExpanded && "rotate-180")}
                            />
                          </button>
                          <AnimatePresence>
                            {activitesExpanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4"
                              >
                                {activitesSublinks.map((sub) => {
                                  const subActive =
                                    pathname === sub.href || pathname.startsWith(sub.href + "/");
                                  return (
                                    <li key={sub.href}>
                                      <Link
                                        href={sub.href}
                                        onClick={onClose}
                                        className={cn(
                                          "block rounded-lg px-3 py-2.5 text-[14px] transition-colors",
                                          "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                                          subActive
                                            ? "font-semibold text-[var(--inp-vert)]"
                                            : "text-foreground/70"
                                        )}
                                      >
                                        {sub.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.li>
                    );
                  }

                  const isRecherche =
                    link.label === "Recherche" && rechercheSublinks.length > 0;

                  if (isRecherche) {
                    return (
                      <motion.li
                        key={link.href}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="rounded-lg">
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                              "relative flex items-center rounded-lg px-4 py-3 text-[15px] font-medium transition-colors",
                              "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                              isRechercheActive
                                ? "bg-[var(--inp-vert)]/8 text-[var(--inp-vert)]"
                                : "text-foreground/80"
                            )}
                          >
                            {isRechercheActive && (
                              <span
                                className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--inp-vert)]"
                                aria-hidden
                              />
                            )}
                            {link.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setRechercheExpanded((e) => !e)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-[13px] text-foreground/60"
                            aria-expanded={rechercheExpanded}
                          >
                            <span>
                              {rechercheExpanded ? "Masquer les sous-pages" : "Voir les sous-pages"}
                            </span>
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform", rechercheExpanded && "rotate-180")}
                            />
                          </button>
                          <AnimatePresence>
                            {rechercheExpanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4"
                              >
                                {rechercheSublinks.map((sub) => {
                                  const subActive =
                                    pathname === sub.href || pathname.startsWith(sub.href + "/");
                                  return (
                                    <li key={sub.href}>
                                      <Link
                                        href={sub.href}
                                        onClick={onClose}
                                        className={cn(
                                          "block rounded-lg px-3 py-2.5 text-[14px] transition-colors",
                                          "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                                          subActive
                                            ? "font-semibold text-[var(--inp-vert)]"
                                            : "text-foreground/70"
                                        )}
                                      >
                                        {sub.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.li>
                    );
                  }

                  const isDocumentation =
                    link.label === "Documentation" && documentationSublinks.length > 0;

                  if (isDocumentation) {
                    return (
                      <motion.li
                        key={link.href}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="rounded-lg">
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                              "relative flex items-center rounded-lg px-4 py-3 text-[15px] font-medium transition-colors",
                              "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                              isDocumentationActive
                                ? "bg-[var(--inp-vert)]/8 text-[var(--inp-vert)]"
                                : "text-foreground/80"
                            )}
                          >
                            {isDocumentationActive && (
                              <span
                                className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--inp-vert)]"
                                aria-hidden
                              />
                            )}
                            {link.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDocumentationExpanded((e) => !e)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-[13px] text-foreground/60"
                            aria-expanded={documentationExpanded}
                          >
                            <span>
                              {documentationExpanded ? "Masquer les sous-pages" : "Voir les sous-pages"}
                            </span>
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform", documentationExpanded && "rotate-180")}
                            />
                          </button>
                          <AnimatePresence>
                            {documentationExpanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4"
                              >
                                {documentationSublinks.map((sub) => {
                                  const subActive =
                                    pathname === sub.href || pathname.startsWith(sub.href + "/");
                                  return (
                                    <li key={sub.href}>
                                      <Link
                                        href={sub.href}
                                        onClick={onClose}
                                        className={cn(
                                          "block rounded-lg px-3 py-2.5 text-[14px] transition-colors",
                                          "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                                          subActive
                                            ? "font-semibold text-[var(--inp-vert)]"
                                            : "text-foreground/70"
                                        )}
                                      >
                                        {sub.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.li>
                    );
                  }

                  if (link.label === "Liens Utiles" && liensUtilesLinks.length > 0) {
                    return (
                      <motion.li
                        key={link.href}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div>
                          <span
                            className={cn(
                              "relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium transition-colors",
                              "text-foreground/80"
                            )}
                          >
                            {link.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => setLiensUtilesExpanded((e) => !e)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-[13px] text-foreground/60"
                            aria-expanded={liensUtilesExpanded}
                          >
                            <span>
                              {liensUtilesExpanded ? "Masquer les liens" : "Voir les liens"}
                            </span>
                            <ChevronDown
                              className={cn("h-4 w-4 transition-transform", liensUtilesExpanded && "rotate-180")}
                            />
                          </button>
                          <AnimatePresence>
                            {liensUtilesExpanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-4"
                              >
                                {liensUtilesLinks.map((ext) => (
                                  <li key={ext.url}>
                                    <a
                                      href={ext.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={onClose}
                                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] text-foreground/70 transition-colors hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]"
                                    >
                                      {ext.label}
                                      <ExternalLink className="h-3.5 w-3.5 opacity-40" />
                                    </a>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.li>
                    );
                  }

                  return (
                    <motion.li
                      key={link.href}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "group relative flex items-center rounded-lg px-4 py-3 text-[15px] font-medium transition-colors",
                          "hover:bg-[var(--inp-vert)]/5 hover:text-[var(--inp-vert)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)]",
                          isActive
                            ? "bg-[var(--inp-vert)]/8 text-[var(--inp-vert)]"
                            : "text-foreground/80"
                        )}
                      >
                        {isActive && (
                          <span
                            className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--inp-vert)]"
                            aria-hidden
                          />
                        )}
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom CTA */}
            <div className="border-t border-border/60 p-6">
              <Link
                href="/demande-analyse"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--inp-vert)] px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2"
              >
                <FlaskConical className="h-4 w-4" />
                Demande d&apos;analyse
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
