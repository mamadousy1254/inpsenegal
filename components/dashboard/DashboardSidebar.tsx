"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FlaskConical,
  FileText,
  Users,
  Settings,
  Map,
  FolderOpen,
  BookOpen,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

/* ------------------------------------------------------------------ */
/*  Nav items                                                          */
/* ------------------------------------------------------------------ */

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const NAV: NavItem[] = [
  { href: "/espace-professionnel/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/espace-professionnel/dashboard/analyses", label: "Demandes d'analyses", icon: FlaskConical },
  { href: "/espace-professionnel/dashboard/documents", label: "Documents internes", icon: FolderOpen },
  { href: "/espace-professionnel/dashboard/cartographie", label: "Données cartographiques", icon: Map },
  { href: "/espace-professionnel/dashboard/projets", label: "Projets", icon: BookOpen },
  { href: "/espace-professionnel/dashboard/publications", label: "Publications internes", icon: FileText },
  { href: "/espace-professionnel/dashboard/utilisateurs", label: "Utilisateurs", icon: Users, adminOnly: true },
  { href: "/espace-professionnel/dashboard/parametres", label: "Paramètres", icon: Settings },
];

/* ------------------------------------------------------------------ */
/*  Sidebar content                                                    */
/* ------------------------------------------------------------------ */

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col bg-[var(--inp-vert)]">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo-inp.png"
            alt="INP"
            width={281}
            height={215}
            unoptimized
            className="h-8 w-auto object-contain brightness-0 invert"
          />
          <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">Pro</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation dashboard">
        <ul className="space-y-1">
          {NAV.filter((n) => !n.adminOnly || user?.role === "admin").map(
            (item) => {
              const isActive =
                item.href === "/espace-professionnel/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/15 text-white shadow-sm"
                        : "text-white/60 hover:bg-white/10 hover:text-white/90"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            }
          )}
        </ul>
      </nav>

      {/* User info */}
      {user && (
        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-xs font-medium text-white truncate">{user.fullName}</p>
          <p className="text-[10px] text-white/50 truncate">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/80 capitalize">
            {user.role}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export function DashboardSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop sidebar (fixed) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
