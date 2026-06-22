"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import AnnouncementBar from "@/components/AnnouncementBar";

/**
 * Conditionally renders the public shell (Navbar + Footer) based on path.
 * The espace-professionnel pages (login + dashboard) use their own layout.
 */
export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBareLayout =
    pathname.startsWith("/espace-professionnel") ||
    pathname === "/login" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/partage");

  if (isBareLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 overflow-x-hidden" id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
