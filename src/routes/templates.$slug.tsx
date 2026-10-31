import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Printer, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GUIDES } from "@/features/guides/guides-data";
import {
  TEMPLATE_TOOLS,
  type TemplateTool,
  getTemplateTool,
} from "@/features/templates/templates-data";
import { readJson, removeKey, writeJson } from "@/lib/storage/local-store";
import { SITE_NAME, absoluteUrl, breadcrumbLd, jsonLdScript, publicHead } from "@/lib/seo";

export const Route = createFileRoute("/templates/$slug")({
  loader: ({ params }) => {
    const tool = getTemplateTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Template not found" }, { name: "robots", content: "noindex" }] };
    }
    const { tool } = loaderData;
    const path = `/templates/${tool.slug}`;
    const head = publicHead({ title: tool.metaTitle, description: tool.description, path });
    return {
      ...head,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              name: tool.h1,
              description: tool.description,
              url: absoluteUrl(path),
              isPartOf: { "@id": absoluteUrl("/#website") },
            },
            {
              "@type": "FAQPage",
              mainEntity: tool.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ],
        }),
        jsonLdScript(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Printable templates", path: "/templates" },
            { name: tool.name, path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell>
      <h1 className="font-display text-2xl font-semibold">We couldn&apos;t find that template.</h1>
      <Button asChild className="mt-6 rounded-xl">
        <Link to="/templates">See all templates</Link>
      </Button>
    </AppShell>
  ),
  component: TemplateToolPage,
});

type Values = Record<string, string>;

const storageKey = (slug: string) => `pcc.template.${slug}`;

function TemplateToolPage() {
  const { tool } = Route.useLoaderData();
  const [values, setValues] = useState<Values>({});

  useEffect(() => {
    setValues(readJson<Values>(storageKey(tool.slug), {}));
  }, [tool.slug]);

  const update = (id: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [id]: value };
      try {
        writeJson(storageKey(tool.slug), next);
      } catch {
        /* the sheet still works without saving */
      }
      return next;
    });
  };

  const clear = () => {
    removeKey(storageKey(tool.slug));
    setValues({});
  };

  const others = TEMPLATE_TOOLS.filter((t) => t.slug !== tool.slug);
  const guides = tool.relatedGuides
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter((g): g is (typeof GUIDES)[number] => Boolean(g));

  return (
    <AppShell>
      <nav aria-label="Breadcrumb" className="no-print mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <Link to="/templates" className="hover:text-foreground">
          Printable templates
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <header className="no-print">
        <h1 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">{tool.h1}</h1>
        {tool.intro.map((p) => (
          <p key={p} className="mt-3 text-base leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
      </header>

      <section className="no-print mt-8 space-y-8" aria-label="Fill in the template">
        {tool.groups.map((group) => (
          <fieldset key={group.heading} className="rounded-3xl border border-border bg-card p-5">
            <legend className="px-1 font-display text-lg font-semibold">{group.heading}</legend>
            <div className="mt-2 space-y-4">
              {group.fields.map((field) => {
                const id = `${tool.slug}-${field.id}`;
                return (
                  <div key={field.id} className="space-y-1.5">
                    <Label htmlFor={id}>{field.label}</Label>
                    {field.multiline ? (
                      <Textarea
                        id={id}
                        value={values[field.id] ?? ""}
                        placeholder={field.placeholder}
                        onChange={(e) => update(field.id, e.target.value)}
                      />
                    ) : (
                      <Input
                        id={id}
                        value={values[field.id] ?? ""}
                        placeholder={field.placeholder}
                        onChange={(e) => update(field.id, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="h-12 rounded-xl px-6" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden="true" /> Print or save as PDF
          </Button>
          <Button size="lg" variant="ghost" className="h-12 rounded-xl" onClick={clear}>
            <RotateCcw className="size-4" aria-hidden="true" /> Clear
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Leave fields empty to print blank lines and fill them in by hand.
        </p>
      </section>

      <h2 className="no-print mt-12 font-display text-2xl font-semibold">Preview</h2>
      <PrintableSheet tool={tool} values={values} />

      <aside className="no-print mt-10 rounded-3xl border border-border bg-secondary/50 p-6">
        <h2 className="font-display text-2xl font-semibold">
          Want to share it as a link or QR code?
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {SITE_NAME} turns the same details into a care card your sitter can open on their phone,
          and you can update it after you have left. Free for one pet.
        </p>
        <Button asChild size="lg" className="mt-5 h-12 rounded-xl px-6">
          <Link to="/onboarding">Create a free care card</Link>
        </Button>
      </aside>

      <section className="no-print mt-12">
        <h2 className="font-display text-2xl font-semibold">Tips for filling it in</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed">
          {tool.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="no-print mt-12">
        <h2 className="font-display text-2xl font-semibold">Questions</h2>
        <div className="mt-4 space-y-5">
          {tool.faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-display text-lg font-semibold">{faq.question}</h3>
              <p className="mt-1 text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="no-print mt-12 grid gap-8 sm:grid-cols-2">
        {guides.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold">Related guides</h2>
            <ul className="mt-3 space-y-2">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link
                    to="/guides/$slug"
                    params={{ slug: g.slug }}
                    className="text-primary hover:underline"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <h2 className="font-display text-xl font-semibold">More free templates</h2>
          <ul className="mt-3 space-y-2">
            {others.map((t) => (
              <li key={t.slug}>
                <Link
                  to="/templates/$slug"
                  params={{ slug: t.slug }}
                  className="text-primary hover:underline"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}

function PrintableSheet({ tool, values }: { tool: TemplateTool; values: Values }) {
  const petName = values["petName"]?.trim();
  return (
    <article className="print-sheet mt-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-display text-2xl font-semibold">
        {petName
          ? `${petName}: ${tool.h1.replace(/ template$/i, "")}`
          : tool.h1.replace(/ template$/i, "")}
      </h2>
      <div className="mt-4 space-y-5">
        {tool.groups.map((group) => (
          <section key={group.heading} className="print-block">
            <h3
              className={`text-xs font-semibold tracking-wide uppercase ${
                group.urgent ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {group.heading}
            </h3>
            <dl className="mt-2 space-y-2">
              {group.fields.map((field) => {
                const value = values[field.id]?.trim();
                return (
                  <div key={field.id} className="grid gap-1 sm:grid-cols-[14rem_1fr]">
                    <dt className="text-sm font-medium">{field.label}</dt>
                    <dd className="min-h-6 border-b border-dashed border-border text-sm whitespace-pre-line">
                      {value ?? ""}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
        {tool.log && (
          <section className="print-block">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {tool.log.heading}
            </h3>
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr>
                  {tool.log.columns.map((c) => (
                    <th key={c} className="border border-border px-2 py-1 text-left font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: tool.log.rows }, (_, i) => (
                  <tr key={i}>
                    {tool.log!.columns.map((c) => (
                      <td key={c} className="h-8 border border-border px-2" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Made with {SITE_NAME} · petcarecards.app</p>
    </article>
  );
}
