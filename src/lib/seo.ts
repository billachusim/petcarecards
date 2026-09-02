/**
 * Central SEO helpers. Canonical URLs must be absolute, so we keep one
 * authoritative site origin here.
 */
export const SITE_URL = (
  import.meta.env["VITE_SITE_URL"] ??
  "https://project--e388cfa0-1f6a-44f4-a7ed-c96329bf5ab7.lovable.app"
).replace(/\/$/, "");

export const SITE_NAME = "Pet Care Card";
export const PUBLISHER = "Pet Care Card";

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

type MetaEntry = Record<string, string>;

interface PublicMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/** Meta + canonical for a public, indexable page. */
export function publicHead({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
}: PublicMetaInput) {
  const url = absoluteUrl(path);
  const meta: MetaEntry[] = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (publishedTime) meta.push({ property: "article:published_time", content: publishedTime });
  if (modifiedTime) meta.push({ property: "article:modified_time", content: modifiedTime });

  return { meta, links: [{ rel: "canonical", href: url }] };
}

/** Meta for private app surfaces that must never be indexed. */
export function privateHead(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
    ],
  };
}

export const jsonLdScript = (data: unknown) => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});
