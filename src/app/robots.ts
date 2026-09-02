import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/**
 * There was no robots.txt at all, so `/robots.txt` returned a 404 — which
 * crawlers treat as "no restrictions" and is therefore harmless, but it also
 * meant nothing pointed them at the sitemap. Stating both explicitly is the
 * cheapest SEO win the site has left.
 *
 * The host is read from `metadataBase` in `app/layout.tsx` rather than
 * repeated here, so a domain change is still a one-line edit in one file.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://pandur.ae/sitemap.xml",
  };
}
