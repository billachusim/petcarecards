import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Check, Clock } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { AUTHOR, GUIDES, getGuide } from "@/features/guides/guides-data";
import { PUBLISHER, SITE_NAME, absoluteUrl, breadcrumbLd, publicHead } from "@/lib/seo";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Guide not found" }, { name: "robots", content: "noindex" }] };
    }
    const { guide } = loaderData;
    return publicHead({
      title: guide.metaTitle,
      description: guide.description,
      path: `/guides/${guide.slug}`,
      type: "article",
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    });
  },
  notFoundComponent: GuideNotFound,
  component: GuidePage,
});

function GuideNotFound() {
  return (
    <AppShell>
      <h1 className="font-display text-2xl font-semibold">We couldn&apos;t find that guide.</h1>
      <p className="mt-2 text-sm text-muted-foreground">It may have moved or been renamed.</p>
      <Button asChild className="mt-6 rounded-xl">
        <Link to="/guides">Browse all guides</Link>
      </Button>
    </AppShell>
  );
}

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const url = absoluteUrl(`/guides/${guide.slug}`);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    abstract: guide.answer,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    datePublished: guide.published,
    dateModified: guide.updated,
    author: { "@type": "Organization", name: AUTHOR },
    publisher: { "@type": "Organization", name: PUBLISHER, url: absoluteUrl("/") },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
  };

  const faqLd =
    guide.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  const related = guide.related
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter((g): g is (typeof GUIDES)[number] => Boolean(g));

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Caregiver Guides", path: "/guides" },
              { name: guide.title, path: `/guides/${guide.slug}` },
            ]),
          ),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <Link to="/guides" className="hover:text-foreground">
          Guides
        </Link>
      </nav>

      <article>
        <header>
          <h1 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">{guide.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>By {AUTHOR}</span>
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
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" /> {guide.readMinutes} min read
            </span>
          </p>
        </header>

        <div className="mt-6 rounded-3xl border border-primary/25 bg-primary/5 p-5">
          <h2 className="text-sm font-semibold tracking-wide text-primary uppercase">Short answer</h2>
          <p className="mt-2 text-base leading-relaxed">{guide.answer}</p>
        </div>

        {guide.medicalDisclaimer && (
          <p className="mt-4 flex gap-3 rounded-2xl border border-border bg-secondary/60 p-4 text-sm leading-relaxed text-muted-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              The app does not provide medical advice or recommend medications or dosages. It only
              helps owners organize instructions they provide. Always follow your veterinarian.
            </span>
          </p>
        )}

        <div className="mt-6 space-y-4">
          {guide.intro.map((para) => (
            <p key={para} className="text-base leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {guide.sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="font-display text-2xl font-semibold">{section.heading}</h2>
            {section.paragraphs?.map((para) => (
              <p key={para} className="mt-3 text-base leading-relaxed">
                {para}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.checklist && (
              <ul className="mt-4 space-y-2">
                {section.checklist.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-base"
                  >
                    <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <aside className="mt-10 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Turn this into a care card</h2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            Pet Care Card walks you through these sections in a couple of minutes, then gives you a
            card you can share by link, print, or hand over as a QR code.
          </p>
          <Button asChild size="lg" className="mt-5 h-12 rounded-xl px-6">
            <Link to="/pets/new">
              Create my pet care card <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </aside>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2>
          <dl className="mt-4 space-y-4">
            {guide.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-border bg-card p-5">
                <dt className="font-display text-lg font-semibold">{faq.question}</dt>
                <dd className="mt-2 text-base leading-relaxed text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Related guides</h2>
            <ul className="mt-4 space-y-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/guides/$slug"
                    params={{ slug: item.slug }}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-base transition-colors hover:bg-secondary"
                  >
                    <span>{item.title}</span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </AppShell>
  );
}
