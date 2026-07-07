import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/constants/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/login", "/partage/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
