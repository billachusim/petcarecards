import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import featureAsset from "@/assets/petfeature.png.asset.json";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { GUIDES } from "@/features/guides/guides-data";
import { SITE_NAME, absoluteUrl, publicHead } from "@/lib/seo";

const TITLE = "Caregiver Guides — Preparing Someone to Look After Your Pet";
const DESCRIPTION =
  "Practical guides for handing your pet over to a sitter, family member or boarding facility: care card checklists, feeding schedules, medication notes and emergency contact sheets.";

export const Route = createFileRoute("/guides/")({
  head: () =>
    publicHead({
      title: `${TITLE} | ${SITE_NAME}`,
      description: DESCRIPTION,
      path: "/guides",
    }),
  component: GuidesIndex,
});

function GuidesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/guides"),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    hasPart: GUIDES.map((guide) => ({
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: absoluteUrl(`/guides/${guide.slug}`),
      dateModified: guide.updated,
    })),
  };

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">Caregiver Guides</span>
      </nav>

      <header className="rounded-3xl border border-border bg-card p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <BookOpen className="size-3.5" aria-hidden="true" /> Caregiver Guides
        </span>
        <h1 className="mt-4 font-display text-3xl leading-tight font-semibold sm:text-4xl">
          Everything to hand over before someone looks after your pet
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Short, practical guides for the days before a trip — what to write down, what to leave out,
          and how to make sure a sitter can find it under pressure. Each one ends with a care card you
          can share, print or turn into a QR code.
        </p>
        <Button asChild size="lg" className="mt-5 h-12 rounded-xl px-6">
          <Link to="/pets/new">Create a care card</Link>
        </Button>
        <img
          src={featureAsset.url}
          alt="Pet Care Card — everything your pet sitter needs: feeding and routine, medications, emergency contacts, vet information, QR code sharing and a printable care card."
          className="mt-6 w-full rounded-2xl"
          loading="lazy"
          width={1024}
          height={512}
        />
      </header>

      <h2 className="mt-10 font-display text-2xl font-semibold">All guides</h2>
      <div className="mt-4 space-y-4">
        {GUIDES.map((guide) => (
          <article key={guide.slug} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-xl font-semibold">
              <Link
                to="/guides/$slug"
                params={{ slug: guide.slug }}
                className="transition-colors hover:text-primary"
              >
                {guide.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
            <p className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" /> {guide.readMinutes} min read
              </span>
              <span>
                Updated{" "}
                <time dateTime={guide.updated}>
                  {new Date(guide.updated).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </span>
            </p>
            <Link
              to="/guides/$slug"
              params={{ slug: guide.slug }}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Read the guide <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
