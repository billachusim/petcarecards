import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { GUIDES } from "@/features/guides/guides-data";

const BASE_URL = "https://petcarecards.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { fetchPublishedGeneratedGuides } = await import(
          "@/features/guides/generated-guides.server"
        );
        const allGuides = [...GUIDES, ...(await fetchPublishedGeneratedGuides())];

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/guides", changefreq: "weekly", priority: "0.9" },
          ...allGuides.map((guide) => ({
            path: `/guides/${guide.slug}`,
            lastmod: guide.updated,
            priority: "0.8",
          })),
          { path: "/talk-about-your-pet", changefreq: "monthly", priority: "0.9" },
          { path: "/tools/feeding-calculator", changefreq: "monthly", priority: "0.7" },
          { path: "/templates", changefreq: "monthly", priority: "0.7" },
          { path: "/pricing", changefreq: "monthly", priority: "0.8" },
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
          { path: "/about", changefreq: "yearly", priority: "0.5" },

          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/refunds", changefreq: "yearly", priority: "0.3" },
        ];

        const urls = entries.map((entry) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${entry.path}</loc>`,
            entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
            entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
            entry.priority ? `    <priority>${entry.priority}</priority>` : null,
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
