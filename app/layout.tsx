import type { Metadata, Viewport } from "next";
import { JsonLdOrganization } from "@/components/seo/json-ld";
import { ShellLayout } from "@/components/layout/ShellLayout";
import "./globals.css";

// NB : les polices ne sont plus chargées via next/font/google (échec de
// résolution Turbopack `@vercel/turbopack-next/internal/font/google/font`
// + dépendance réseau à fonts.gstatic.com au build). Les variables
// --font-geist-sans / --font-geist-mono / --font-lora sont définies dans
// globals.css avec des piles de polices système (aucune dépendance externe).

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://inp.sn"),
  title: {
    default: "INP – Institut national de Pédologie | Référence nationale en science des sols",
    template: "%s | INP – Institut national de Pédologie",
  },
  description:
    "Institut parapublic à caractère scientifique et technologique. Recherche, cartographie pédologique, fertilité des sols et gestion durable des terres. Sous tutelle du Ministère de l'Agriculture.",
  keywords: [
    "INP",
    "pédologie",
    "sols",
    "Sénégal",
    "cartographie",
    "agriculture",
    "recherche agronomique",
    "fertilité",
    "gestion durable des terres",
  ],
  authors: [{ name: "INP – Institut national de Pédologie" }],
  creator: "INP – Institut national de Pédologie",
  openGraph: {
    images: "/icon.png",
    title: "INP – Institut national de Pédologie",
    description:
      "Institut parapublic à caractère scientifique et technologique. Recherche, cartographie pédologique, fertilité des sols et gestion durable des terres. Sous tutelle du Ministère de l'Agriculture.",
    url: "https://inpsenegal.sn",
    siteName: "INP – Institut national de Pédologie",
    locale: "fr_SN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "INP – Institut national de Pédologie",
    description:
      "Institut parapublic à caractère scientifique et technologique. Recherche, cartographie pédologique, fertilité des sols et gestion durable des terres. Sous tutelle du Ministère de l'Agriculture.",
    images: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "favicon16.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#7B4F2A", // brun terre INP
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className="min-h-screen antialiased flex flex-col"
      >
        <JsonLdOrganization />
        <a
          href="#main-content"
          className="absolute -top-16 left-4 z-[100] bg-primary px-4 py-2 text-primary-foreground rounded-lg transition-[top] focus:top-4 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
        >
          Aller au contenu principal
        </a>
        <ShellLayout>{children}</ShellLayout>
      </body>
    </html>
  );
}
