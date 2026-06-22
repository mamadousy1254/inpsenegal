export const DEFAULT_SITE_URL = "https://inpsenegal.sn";

/** URL publique du site (jamais localhost — les crawlers WhatsApp/Facebook ne peuvent pas y accéder). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (fromEnv && !fromEnv.includes("localhost") && !fromEnv.includes("127.0.0.1")) {
    return fromEnv.replace(/\/$/, "");
  }

  return DEFAULT_SITE_URL;
}

export const SITE_OG_IMAGE = {
  path: "/icon.png",
  width: 512,
  height: 512,
  alt: "INP – Institut national de Pédologie",
  type: "image/png" as const,
};
