import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { SITE_NAME, absoluteUrl, breadcrumbLd, publicHead } from "@/lib/seo";

const TITLE = "Free Printable Pet Care Templates";
const DESCRIPTION =
  "Free printable pet care templates: a pet sitter instruction sheet, emergency contact card, feeding schedule and medication log. Print or save as PDF — no account, no sign-up.";

interface Template {
  id: string;
  name: string;
  summary: string;
  lines: string[];
}

const TEMPLATES: Template[] = [
  {
    id: "sitter-instructions",
    name: "Pet sitter instruction sheet",
    summary: "One page covering the pet, feeding, routine, house rules and who to call.",
    lines: [
      "Pet name / species / breed / age / weight",
      "Microchip number",
      "Temperament and warnings",
      "Food brand and where it is stored",
      "Amount per meal / measuring tool",
      "Meal times",
      "Treats allowed per day",
      "Foods to avoid",
      "Walk times and route notes",
      "Bathroom / litter routine",
      "Sleeping arrangements",
      "House rules and off-limits areas",
      "Owner phone / second contact",
      "Vet clinic and phone",
    ],
  },
  {
    id: "emergency-contacts",
    name: "Emergency contact card",
    summary: "Large-type card for the fridge with every number needed under stress.",
    lines: [
      "Pet name and photo",
      "Owner name and phone",
      "Second decision-maker and phone",
      "Vet clinic name",
      "Vet phone",
      "Vet full address",
      "24-hour emergency clinic and address",
      "Known conditions and allergies",
      "Current medications",
      "Treatment spending limit authorised",
      "Insurance provider and policy number",
      "Microchip number",
    ],
  },
  {
    id: "feeding-schedule",
    name: "Feeding schedule",
    summary: "A week's grid so each meal is ticked off and nobody double-feeds.",
    lines: [
      "Meal 1 — time / amount / given by",
      "Meal 2 — time / amount / given by",
      "Meal 3 — time / amount / given by",
      "Water refreshed",
      "Treats given today",
      "Appetite normal? (yes / no)",
      "Notes",
    ],
  },
  {
    id: "medication-log",
    name: "Medication log",
    summary: "A dose-by-dose tick sheet with initials, to prevent missed or doubled doses.",
    lines: [
      "Medication name (as printed on the label)",
      "Dose and route",
      "Time(s) of day",
      "With food? (yes / no)",
      "Where it is stored",
      "Method that works for this pet",
      "Date / time given / initials",
      "If a dose is refused, call:",
    ],
  },
];

export const Route = createFileRoute("/templates")({
  head: () =>
    publicHead({
      title: `${TITLE} — Sitter, Emergency, Feeding, Medication | ${SITE_NAME}`,
      description: DESCRIPTION,
      path: "/templates",
    }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/templates"),
    itemListElement: TEMPLATES.map((template, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: template.name,
      description: template.summary,
      url: `${absoluteUrl("/templates")}#${template.id}`,
    })),
  };

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Printable templates", path: "/templates" },
            ]),
          ),
        }}
      />

      <nav aria-label="Breadcrumb" className="no-print mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">Printable templates</span>
      </nav>

      <header className="no-print">
        <h1 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">
          Free printable pet care templates
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Four blank sheets to fill in by hand and leave for whoever is looking after your pet. Print
          them or use your browser&apos;s &ldquo;Save as PDF&rdquo; option — nothing to download, no
          account needed.
        </p>
        <Button size="lg" className="mt-5 h-12 rounded-xl px-6" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden="true" /> Print or save as PDF
        </Button>
      </header>

      <div className="mt-8 space-y-8">
        {TEMPLATES.map((template) => (
          <section
            key={template.id}
            id={template.id}
            className="break-inside-avoid rounded-3xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-2xl font-semibold">{template.name}</h2>
            <p className="no-print mt-2 text-sm text-muted-foreground">{template.summary}</p>
            <dl className="mt-5 space-y-4">
              {template.lines.map((line) => (
                <div key={line}>
                  <dt className="text-sm font-medium">{line}</dt>
                  <dd
                    className="mt-1 h-7 border-b border-dashed border-border"
                    aria-label="Blank line to fill in"
                  />
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <aside className="no-print mt-10 rounded-3xl border border-border bg-secondary/50 p-6">
        <h2 className="font-display text-2xl font-semibold">Prefer to skip the handwriting?</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Pet Care Card fills these sections in for you and turns them into a card you can share by
          link, print, or hand over as a QR code — and you can update it after you have left.
        </p>
        <Button asChild size="lg" className="mt-5 h-12 rounded-xl px-6">
          <Link to="/pets/new">Create a care card</Link>
        </Button>
      </aside>
    </AppShell>
  );
}
