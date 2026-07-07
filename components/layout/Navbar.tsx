"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "./NavItem";
import { InstitutMegaMenu } from "./InstitutMegaMenu";
import { ActivitesDropdownMenu } from "./ActivitesDropdownMenu";
import { RechercheDropdownMenu } from "./RechercheDropdownMenu";
import { DocumentationDropdownMenu } from "./DocumentationDropdownMenu";
import { LiensUtilesDropdownMenu } from "./LiensUtilesDropdownMenu";
import { MobileMenu } from "./MobileMenu";
import { INSTITUT_SUBLINKS } from "./institut-nav";
import { ACTIVITES_SUBLINKS } from "./activites-nav";
import { RECHERCHE_SUBLINKS } from "./recherche-nav";
import { DOCUMENTATION_SUBLINKS } from "./documentation-nav";
import { LIENS_UTILES } from "./liens-utiles-nav";
import { usePathname } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Navigation links                                                   */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { href: "/institut", label: "L'Institut" },
  { href: "/activites", label: "Activités" },
  { href: "/recherche", label: "Recherche" },
  { href: "/documentation", label: "Documentation" },
  { href: "/actualites", label: "Actualités" },
  { href: "/liens-utiles", label: "Liens Utiles" },
  { href: "/mediatheque", label: "Médiathèque" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
  { href: "/candidature-spontanee", label: "Recrutement" },
];

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [institutMegaOpen, setInstitutMegaOpen] = useState(false);
  const [activitesDropdownOpen, setActivitesDropdownOpen] = useState(false);
  const [rechercheDropdownOpen, setRechercheDropdownOpen] = useState(false);
  const [documentationDropdownOpen, setDocumentationDropdownOpen] = useState(false);
  const [liensUtilesDropdownOpen, setLiensUtilesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  const pathname = usePathname();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return pathname.includes("/dashboard") || pathname.includes("/login") ? null : (
    <>
      {/* ─── Main Navbar ─── */}
      <header
        className={cn(
          "relative z-50 w-full overflow-visible transition-all duration-300",
          scrolled
            ? "h-[70px] bg-white/95 shadow-[0_1px_8px_rgba(0,0,0,0.06)] backdrop-blur-md"
            : "h-20 bg-white"
        )}
        role="banner"
      >
        {/* Bottom accent line */}
        <div
          className="absolute inset-x-0 bottom-0 h-[2px] bg-linear-to-r from-[var(--inp-vert)] via-[var(--inp-beige)] to-[var(--inp-vert)] opacity-30"
          aria-hidden
        />

        <div className="container mx-auto flex h-full max-w-[1536px] items-center justify-between overflow-visible px-4 sm:px-6 lg:px-8">
          {/* ─── Logo ─── */}
          <Link
            href="/"
            className="group relative mr-4 shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2 lg:mr-8"
            aria-label="INP – Institut national de Pédologie, accueil"
          >
            {/* Halo glow behind logo */}
            <div
              className="pointer-events-none absolute inset-0 -m-2 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle, rgba(123,79,42,0.12) 0%, transparent 70%)",
              }}
              aria-hidden
            />

            {/* Logo container */}
            <motion.div
              className={cn(
                "relative flex items-center justify-center rounded-xl border border-[var(--inp-vert)]/10 bg-white shadow-sm transition-all duration-300",
                "group-hover:shadow-md group-hover:border-[var(--inp-vert)]/20",
                scrolled ? "p-1.5" : "p-2"
              )}
              whileHover={{
                scale: 1.04,
                rotate: 0.5,
                transition: { type: "spring" as const, stiffness: 300, damping: 20 },
              }}
            >
              <Image
                src="/images/logo-inp.png"
                alt="Logo INP – Institut national de Pédologie"
                width={100}
                height={100}
                priority
                unoptimized
                className={cn(
                  "object-contain transition-all duration-300",
                  scrolled
                    ? "h-10 w-auto"
                    : "h-11 w-auto"
                )}
              />
            </motion.div>
          </Link>

          {/* ─── Desktop Nav ─── */}
          <nav
            className="hidden 2xl:flex flex-1 justify-center items-center gap-0.5"
            aria-label="Navigation principale"
          >
            {NAV_LINKS.map((link) => {
              if (link.label === "L'Institut") {
                return (
                  <div
                    key={link.href}
                    className="relative pt-1"
                    onMouseEnter={() => setInstitutMegaOpen(true)}
                    onMouseLeave={() => setInstitutMegaOpen(false)}
                  >
                    <NavItem href={link.href} label={link.label} hasDropdown isOpen={institutMegaOpen} />
                    <InstitutMegaMenu
                      open={institutMegaOpen}
                      onClose={() => setInstitutMegaOpen(false)}
                    />
                  </div>
                );
              }
              if (link.label === "Activités") {
                return (
                  <div
                    key={link.href}
                    className="relative pt-1"
                    onMouseEnter={() => setActivitesDropdownOpen(true)}
                    onMouseLeave={() => setActivitesDropdownOpen(false)}
                  >
                    <NavItem href={link.href} label={link.label} hasDropdown isOpen={activitesDropdownOpen} />
                    <ActivitesDropdownMenu
                      open={activitesDropdownOpen}
                      onClose={() => setActivitesDropdownOpen(false)}
                    />
                  </div>
                );
              }
              if (link.label === "Recherche") {
                return (
                  <div
                    key={link.href}
                    className="relative pt-1"
                    onMouseEnter={() => setRechercheDropdownOpen(true)}
                    onMouseLeave={() => setRechercheDropdownOpen(false)}
                  >
                    <NavItem href={link.href} label={link.label} hasDropdown isOpen={rechercheDropdownOpen} />
                    <RechercheDropdownMenu
                      open={rechercheDropdownOpen}
                      onClose={() => setRechercheDropdownOpen(false)}
                    />
                  </div>
                );
              }
              if (link.label === "Documentation") {
                return (
                  <div
                    key={link.href}
                    className="relative pt-1"
                    onMouseEnter={() => setDocumentationDropdownOpen(true)}
                    onMouseLeave={() => setDocumentationDropdownOpen(false)}
                  >
                    <NavItem href={link.href} label={link.label} hasDropdown isOpen={documentationDropdownOpen} />
                    <DocumentationDropdownMenu
                      open={documentationDropdownOpen}
                      onClose={() => setDocumentationDropdownOpen(false)}
                    />
                  </div>
                );
              }
              if (link.label === "Liens Utiles") {
                return (
                  <div
                    key={link.href}
                    className="relative pt-1"
                    onMouseEnter={() => setLiensUtilesDropdownOpen(true)}
                    onMouseLeave={() => setLiensUtilesDropdownOpen(false)}
                  >
                    <NavItem href={link.href} label={link.label} hasDropdown isOpen={liensUtilesDropdownOpen} />
                    <LiensUtilesDropdownMenu
                      open={liensUtilesDropdownOpen}
                      onClose={() => setLiensUtilesDropdownOpen(false)}
                    />
                  </div>
                );
              }
              return (
                <NavItem key={link.href} href={link.href} label={link.label} />
              );
            })}
          </nav>

          {/* ─── Right side ─── */}
          <div className="flex items-center gap-3">
            {/* CTA button */}
            <Link
              href="/demande-analyse"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold uppercase text-white shadow-md transition-all duration-300",
                "bg-[var(--inp-marron)] hover:shadow-lg hover:brightness-110",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-marron)] focus-visible:ring-offset-2",
                scrolled ? "px-3.5 py-1.5 text-[10px]" : "px-4 py-2 text-[11px]"
              )}
            >
              <FlaskConical className="h-3 w-3 flex-shrink-0" />
              Demande d&apos;analyse
            </Link>

            {/* Mobile burger */}
            <button
              className="2xl:hidden flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)]"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile menu ─── */}
      <MobileMenu
        open={mobileOpen}
        onClose={closeMobile}
        links={NAV_LINKS}
        institutSublinks={[...INSTITUT_SUBLINKS]}
        activitesSublinks={[...ACTIVITES_SUBLINKS]}
        rechercheSublinks={[...RECHERCHE_SUBLINKS]}
        documentationSublinks={[...DOCUMENTATION_SUBLINKS]}
        liensUtilesLinks={[...LIENS_UTILES]}
      />
    </>
  );
}
