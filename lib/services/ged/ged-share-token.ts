import crypto from "crypto";

export function generateGedShareAccessToken(): string {
  return crypto.randomUUID();
}

export function buildGedSharePageUrl(accessToken: string): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");

  return `${base}/partage/${accessToken}`;
}
