/**
 * Central SEO helpers. Canonical URLs must be absolute, so we keep one
 * authoritative site origin here.
 */
import socialCard from "@/assets/pet-care-card-social.jpg.asset.json";
export const SITE_URL = (
  import.meta.env["VITE_SITE_URL"] ?? "https://petcarecards.app"
).replace(/\/$/, "");

export const SITE_NAME = "Pet Care Card";
export const PUBLISHER = "Pet Care Card";

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Default 1200x630 social sharing card (Open Graph / Twitter / LinkedIn). */
export const SOCIAL_IMAGE_URL = absoluteUrl(socialCard.url);
export const SOCIAL_IMAGE_ALT =
  "Pet Care Card — everything your pet sitter needs: feeding and routine, medications and reminders, emergency contacts, vet information, QR code sharing and a printable care card, shown beside a golden retriever, a cat and the app on a phone.";

type MetaEntry = Record<string, string>;

interface PublicMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Absolute URL of a page-specific social image; defaults to the product card. */
  image?: string;
  imageAlt?: string;
}

/** Meta + canonical for a public, indexable page. */
export function publicHead({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  image = SOCIAL_IMAGE_URL,
  imageAlt = SOCIAL_IMAGE_ALT,
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
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
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

/** Legal seller / publisher entity behind the site. */
export const BUSINESS_NAME = "Tech Faculty";

export const organizationLd = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS_NAME,
  alternateName: SITE_NAME,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/favicon.svg"),
  image: SOCIAL_IMAGE_URL,
  description:
    "Tech Faculty publishes Pet Care Card, a web tool that turns pet feeding, routine, medication, emergency and vet details into a single shareable care card.",
};

export const websiteLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: absoluteUrl("/"),
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/** BreadcrumbList JSON-LD from an ordered list of crumbs. */
export const breadcrumbLd = (crumbs: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});

export const jsonLdScript = (data: unknown) => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});
