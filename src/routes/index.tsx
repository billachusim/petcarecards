import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  FileText,
  Footprints,
  Link2,
  Mic,
  Phone,
  Pill,
  Printer,
  QrCode,
  Stethoscope,
  Utensils,
} from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { GUIDES } from "@/features/guides/guides-data";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import { TEMPLATE_TOOLS } from "@/features/templates/templates-data";
import { SITE_NAME, SOCIAL_IMAGE_URL, absoluteUrl, jsonLdScript, publicHead } from "@/lib/seo";

const TITLE = "Pet Sitter Instructions in One Shareable Care Card — Pet Care Card";
const DESCRIPTION =
  "Write your pet sitter instructions once: feeding, routine, medication, emergency contacts and vet details on one care card. Share it by link, print it or hand over a QR code. Free for one pet.";

const FAQS = [
  {
    question: "What should pet sitter instructions include?",
    answer:
      "Good pet sitter instructions cover who the pet is, what and when they eat, their daily routine and bathroom habits, any medication exactly as your vet prescribed it, emergency contacts, and your vet's name, phone and address. Pet Care Card walks you through each of these in short, skippable steps.",
  },
  {
    question: "Is Pet Care Card free?",
    answer:
      "Yes. One pet with a full care card, a QR code, a share link and basic reminders is free forever. A single $4.99 payment unlocks unlimited pets, PDF export, advanced reminders and unlimited voice fill. There is no subscription.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Your pet's details are saved in your browser on your own device. An optional account backup is available if you want your cards on more than one device.",
  },
  {
    question: "How does my sitter see the care card?",
    answer:
      "Send them a private link, print a copy for the fridge, or let them scan the QR code at the door. The QR code only holds a link, never your pet's details.",
  },
  {
    question: "Can I use it for cats, rabbits and birds too?",
    answer:
      "Yes. The card works for dogs, cats, rabbits, birds and other pets, and every section is optional, so you only fill in what applies to your pet.",
  },
];

const SECTIONS = [
  {
    icon: Utensils,
    title: "Feeding",
    body: "Food, amount per meal, times, treats and foods to avoid.",
  },
  {
    icon: Footprints,
    title: "Routine",
    body: "Walks, play, sleep, bathroom habits and house rules.",
  },
  { icon: Pill, title: "Medication", body: "Name, dose and timing exactly as your vet wrote it." },
  {
    icon: Phone,
    title: "Emergency",
    body: "Who to call first, a backup contact and special instructions.",
  },
  {
    icon: Stethoscope,
    title: "Vet",
    body: "Clinic, phone and address with one-tap call and directions.",
  },
  { icon: Mic, title: "Voice fill", body: "Talk for a minute and the card is written for you." },
];

const STEPS = [
  {
    title: "Add your pet",
    body: "Only the name is required. Add a photo, breed, age and weight if you have a moment.",
  },
  {
    title: "Fill in the essentials",
    body: "Short, skippable steps for feeding, routine, medication and emergency contacts. Or just talk.",
  },
  {
    title: "Hand it over",
    body: "Share a link, print a copy for the fridge, or let your sitter scan a QR code at the door.",
  },
];

const FEATURED_GUIDE_SLUGS = [
  "pet-sitter-care-card-checklist",
  "what-to-leave-with-a-dog-sitter",
  "cat-sitter-instructions",
  "pet-emergency-contact-sheet",
  "pet-medication-instructions-for-caregivers",
  "dog-sitter-checklist",
];

export const Route = createFileRoute("/")({
  head: () => {
    const head = publicHead({ title: TITLE, description: DESCRIPTION, path: "/" });
    return {
      ...head,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: SITE_NAME,
              url: absoluteUrl("/"),
              image: SOCIAL_IMAGE_URL,
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Any modern web browser",
              description: DESCRIPTION,
              publisher: { "@id": absoluteUrl("/#organization") },
              featureList: SECTIONS.map((s) => `${s.title}: ${s.body}`),
              offers: [
                {
                  "@type": "Offer",
                  name: "Free",
                  price: "0",
                  priceCurrency: "USD",
                  description: "One pet with a full care card, QR code and basic reminders.",
                },
                {
                  "@type": "Offer",
                  name: "Lifetime unlock",
                  price: "4.99",
                  priceCurrency: "USD",
                  description:
                    "One payment, no subscription. Unlimited pets, medication schedules, advanced reminders, PDF export and sharing.",
                },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ],
        }),
      ],
    };
  },
  component: Landing,
});

function Landing() {
  const { ready, pets } = useCareStore();
  const hasPets = ready && pets.length > 0;
  const guides = FEATURED_GUIDE_SLUGS.map((slug) => GUIDES.find((g) => g.slug === slug)).filter(
    (g): g is (typeof GUIDES)[number] => Boolean(g),
  );

  return (
    <AppShell>
      {hasPets && (
        <Link
          to="/app"
          className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <span>
            Welcome back. Open your {pets.length === 1 ? "care card" : `${pets.length} care cards`}
          </span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}

      <section aria-labelledby="hero">
        <p className="text-sm font-medium text-primary">Free pet care card maker</p>
        <h1
          id="hero"
          className="mt-2 font-display text-4xl leading-tight font-semibold sm:text-5xl"
        >
          Pet sitter instructions, ready in two minutes
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Leaving your pet with a sitter, a friend or family? Put feeding, routine, medication,
          emergency contacts and vet details on one care card, then share it by link, print it, or
          hand over a QR code.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 rounded-xl px-6 text-base">
            <Link to={hasPets ? "/app" : "/onboarding"}>
              {hasPets ? "Open my care cards" : "Create my pet care card"}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6 text-base">
            <Link to="/templates">Free printable templates</Link>
          </Button>
        </div>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {["Free for one pet", "No account needed", "Works for dogs, cats and more"].map(
            (item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="size-4 text-primary" aria-hidden="true" /> {item}
              </li>
            ),
          )}
        </ul>
      </section>

      <ExampleCard />

      <section className="mt-14" aria-labelledby="whats-on-it">
        <h2 id="whats-on-it" className="font-display text-2xl font-semibold">
          Everything a pet sitter asks you, on one page
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Most sitter problems come from missing information, not bad sitters. Pet Care Card asks
          for the details a caregiver actually needs and lays them out so they can be read in
          seconds.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {SECTIONS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {body}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="font-display text-2xl font-semibold">
          How it works
        </h2>
        <ol className="mt-6 space-y-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display font-semibold text-primary">
                {i + 1}
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">{step.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="share">
        <h2 id="share" className="font-display text-2xl font-semibold">
          Share it the way your sitter prefers
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Link2,
              title: "Private link",
              body: "Send it by text or email. Update it after you leave.",
            },
            {
              icon: QrCode,
              title: "QR code",
              body: "Stick it on the fridge or the crate. Scan to open.",
            },
            {
              icon: Printer,
              title: "Print",
              body: "A clean, large-type page made for the kitchen counter.",
            },
            {
              icon: FileText,
              title: "PDF",
              body: "Save or email a polished PDF of the whole card.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-medium">{title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Don&apos;t feel like typing?{" "}
          <Link to="/talk-about-your-pet" className="font-medium text-primary hover:underline">
            Talk about your pet
          </Link>{" "}
          for a minute and the care card is written for you.
        </p>
      </section>

      <section className="mt-14" aria-labelledby="templates">
        <h2 id="templates" className="font-display text-2xl font-semibold">
          Free pet sitter templates
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Prefer paper? Fill these in on screen and print them, no sign-up needed.
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {TEMPLATE_TOOLS.map((tool) => (
            <li key={tool.slug}>
              <Link
                to="/templates/$slug"
                params={{ slug: tool.slug }}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                {tool.name}
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="guides">
        <h2 id="guides" className="font-display text-2xl font-semibold">
          Caregiver guides
        </h2>
        <ul className="mt-5 space-y-2">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                to="/guides/$slug"
                params={{ slug: guide.slug }}
                className="text-base font-medium text-primary hover:underline"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/guides"
          className="mt-4 inline-flex text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          All caregiver guides →
        </Link>
      </section>

      <section
        className="mt-14 rounded-3xl border border-border bg-secondary/50 p-6"
        aria-labelledby="pricing"
      >
        <h2 id="pricing" className="font-display text-2xl font-semibold">
          Free for one pet. $4.99 once for everything else.
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          The free plan is a complete care card, not a trial. One lifetime payment adds unlimited
          pets, PDF export, reminders and unlimited voice fill. No subscription, ever.
        </p>
        <Link
          to="/pricing"
          className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
        >
          See pricing
        </Link>
      </section>

      <section className="mt-14" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl font-semibold">
          Questions
        </h2>
        <div className="mt-5 space-y-5">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-display text-lg font-semibold">{faq.question}</h3>
              <p className="mt-1 text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 text-center">
        <Button asChild size="lg" className="h-12 rounded-xl px-6 text-base">
          <Link to={hasPets ? "/app" : "/onboarding"}>
            {hasPets ? "Open my care cards" : "Create my pet care card"}
          </Link>
        </Button>
      </section>
    </AppShell>
  );
}

/** A static sample so visitors (and search engines) can see what a care card looks like. */
function ExampleCard() {
  const rows: { label: string; value: string; emphasis?: boolean }[] = [
    {
      label: "Feeding",
      value:
        "1 cup dry food at 7:00 and 18:00. Scoop is in the blue tub. No grapes or chicken bones.",
    },
    {
      label: "Routine",
      value: "30-minute walk at 8:00 and 17:30. Pulls toward squirrels, keep the lead short.",
    },
    {
      label: "Medication",
      value: "Ear drops each evening, as written on the vet's label in the fridge door.",
    },
    {
      label: "Emergency",
      value: "Sam (owner) 555-0142 · Alex (neighbour, has a key) 555-0178",
      emphasis: true,
    },
    { label: "Vet", value: "Riverside Animal Clinic · 555-0110 · 24 Mill Road" },
  ];

  return (
    <figure className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span
          className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 font-display text-2xl font-semibold text-primary"
          aria-hidden="true"
        >
          B
        </span>
        <div>
          <p className="font-display text-2xl font-semibold">Biscuit</p>
          <p className="text-sm text-muted-foreground">Dog · Golden retriever · 4 years · 30 kg</p>
        </div>
      </div>
      <dl className="mt-5 divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]">
            <dt
              className={`text-xs font-semibold tracking-wide uppercase ${
                row.emphasis ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {row.label}
            </dt>
            <dd className="text-sm leading-relaxed">{row.value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-3 text-xs text-muted-foreground">
        An example care card. Yours is built from what you enter, and empty sections are hidden.
      </figcaption>
    </figure>
  );
}
