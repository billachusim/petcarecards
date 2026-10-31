import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { GUIDES, NOINDEX_GUIDE_SLUGS } from "@/features/guides/guides-data";
import { TEMPLATE_TOOLS } from "@/features/templates/templates-data";
import { SITE_URL } from "@/lib/seo";

/** Bump when the static marketing pages change meaningfully. */
const SITE_UPDATED = "2026-10-31";

interface SitemapEntry {
  path: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { fetchPublishedGeneratedGuides } =
          await import("@/features/guides/generated-guides.server");
        const allGuides = [...GUIDES, ...(await fetchPublishedGeneratedGuides())].filter(
          (guide) => !NOINDEX_GUIDE_SLUGS.has(guide.slug),
        );
        const latestGuide =
          allGuides
            .map((g) => g.updated)
            .sort()
            .at(-1) ?? SITE_UPDATED;

        const entries: SitemapEntry[] = [
          { path: "/", lastmod: SITE_UPDATED },
          { path: "/guides", lastmod: latestGuide > SITE_UPDATED ? latestGuide : SITE_UPDATED },
          ...allGuides.map((guide) => ({ path: `/guides/${guide.slug}`, lastmod: guide.updated })),
          { path: "/templates", lastmod: SITE_UPDATED },
          ...TEMPLATE_TOOLS.map((tool) => ({
            path: `/templates/${tool.slug}`,
            lastmod: SITE_UPDATED,
          })),
          { path: "/talk-about-your-pet", lastmod: SITE_UPDATED },
          { path: "/tools/feeding-calculator", lastmod: SITE_UPDATED },
          { path: "/pricing", lastmod: SITE_UPDATED },
          { path: "/contact", lastmod: SITE_UPDATED },
          { path: "/about", lastmod: SITE_UPDATED },
          { path: "/privacy", lastmod: SITE_UPDATED },
          { path: "/terms", lastmod: SITE_UPDATED },
          { path: "/refunds", lastmod: SITE_UPDATED },
        ];

        const urls = entries.map((entry) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${entry.path}</loc>`,
            entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
