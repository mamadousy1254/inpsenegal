"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function DashboardTopbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/espace-professionnel/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="hidden text-sm font-medium text-foreground sm:inline">
          Espace professionnel
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {user && (
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--inp-vert)]/10 text-xs font-bold text-[var(--inp-vert)]">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span className="text-xs font-medium text-foreground">
              {user.fullName}
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Se déconnecter"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
