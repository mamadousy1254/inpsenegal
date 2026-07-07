"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogoSvg } from "./logo";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/institut", label: "L'Institut" },
  { href: "/missions", label: "Missions" },
  { href: "/recherche", label: "Recherche" },
  { href: "/cartographie", label: "Cartographie" },
  { href: "/laboratoires", label: "Laboratoires" },
  { href: "/publications", label: "Publications" },
  { href: "/actualites", label: "Actualités" },
  { href: "/services", label: "Services" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/documentation", label: "Documentation" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);


  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      role="banner"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
          aria-label="INP – Institut national de Pédologie, accueil"
        >
          <div className="relative h-12 w-12 shrink-0 text-primary">
            <LogoSvg className="h-12 w-12" />
          </div>
          <span className="font-semibold text-primary text-lg hidden sm:inline">
            INP
          </span>
          <span className="text-muted-foreground text-sm hidden md:inline">
            Pédologie
          </span>
        </Link>

        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Navigation principale"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium text-foreground/90 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Link href="/dashboard">Tableau de bord</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <nav
              className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1"
              aria-label="Navigation mobile"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="outline" className="mt-2">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  Tableau de bord
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
