import type { MetadataRoute } from "next";
import { getAllPosts } from "@/content/blog";

const SITE = "https://pandur.ae";

/**
 * The static routes, in the order the nav presents them, with `priority`
 * reflecting how much of the pitch each one carries rather than being left at
 * the default 0.5 for everything — which tells a crawler nothing.
 */
const PAGES: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/products", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/franchises", priority: 0.8 },
  { path: "/contact", priority: 0.7 },
  { path: "/blog", priority: 0.6 },
];

/**
 * Blog posts come from `content/blog` rather than being listed again here, so
 * a new post appears in the sitemap by existing. Their own `date` is the
 * lastModified, which is the honest answer and stops every URL claiming it
 * changed at build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...PAGES.map(({ path, priority }) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...getAllPosts().map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
