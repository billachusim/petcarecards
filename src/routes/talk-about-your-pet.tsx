import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { SITE_NAME, absoluteUrl, breadcrumbLd, publicHead } from "@/lib/seo";

const TITLE = "Talk About Your Pet — Voice Pet Sitter Instructions";
const DESCRIPTION =
  "Speak for a minute and get a complete care card for your pet sitter, dog walker, grandparents or a friend. Voice fills in feeding, routine, medication, emergency contacts and your vet — you check it before anything saves.";

const EXAMPLE_SPOKEN =
  "This is Milo, a four-year-old beagle, about twelve kilos. He eats one cup of dry food at 7am and 6pm, no chocolate or grapes. Two walks a day, morning and after work. He takes half a tablet of Apoquel each morning. If anything happens, call Sarah on 555 0134, and our vet is Green Lane Clinic.";

const EXAMPLE_FIELDS: { label: string; value: string }[] = [
  { label: "Pet", value: "Milo · Dog · Beagle · about 4 years · 12 kg" },
  { label: "Feeding", value: "One cup of dry food at 7am and 6pm" },
  { label: "Foods to avoid", value: "Chocolate, grapes" },
  { label: "Routine", value: "Two walks a day — morning and after work" },
  { label: "Medication", value: "Apoquel — half a tablet each morning" },
  { label: "Emergency contact", value: "Sarah — 555 0134" },
  { label: "Vet", value: "Green Lane Clinic" },
];

const STEPS: { name: string; text: string }[] = [
  {
    name: "Press the microphone",
    text: "Open Add Pet and tap “Talk about your pet”. Your browser asks for microphone access once.",
  },
  {
    name: "Say what a sitter should know",
    text: "Talk normally: who your pet is, what and when they eat, their routine, any medication, who to call and which vet you use.",
  },
  {
    name: "Check what we wrote",
    text: "Every field appears on a review screen before anything is saved. Fix a word, add what was missed, and double-check medication against the label.",
  },
  {
    name: "Hand the card over",
    text: "Share the finished care card by link, print it for the fridge, or let your sitter scan a QR code at the door.",
  },
];

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How does voice pet sitter instructions work?",
    answer:
      "You speak a short description of your pet — food, times, routine, medication, who to call and your vet. Pet Care Card writes it into the matching care card fields and shows them to you for review. Nothing is saved until you confirm it, so you stay in control of every word.",
  },
  {
    question: "Does it work on my phone?",
    answer:
      "Yes. It runs in the browser on phones, tablets and computers. Where your browser has built-in dictation, the speech is turned into text on the device itself; otherwise the recording is transcribed and then discarded.",
  },
  {
    question: "Is my voice recording stored?",
    answer:
      "No. Recordings are never saved. They are used only to produce the text you see on the review screen, and your pet's details stay on your own device.",
  },
  {
    question: "Is it free?",
    answer:
      "You get two free voice fills. After that, voice is part of the one-off lifetime unlock — $4.99, one payment, no subscription. Typing everything in by hand stays free and unlimited.",
  },
  {
    question: "What languages does it support?",
    answer: "Voice fill is English only for now. You can type in any language you like.",
  },
  {
    question: "What if it gets something wrong?",
    answer:
      "Everything lands on an editable review screen first, so you can correct it before it saves. Always check medication names and doses against the label — Pet Care Card never suggests, changes or interprets a dose.",
  },
];

export const Route = createFileRoute("/talk-about-your-pet")({
  head: () =>
    publicHead({
      title: `${TITLE} | ${SITE_NAME}`,
      description: DESCRIPTION,
      path: "/talk-about-your-pet",
    }),
  component: TalkAboutYourPetPage,
});

function TalkAboutYourPetPage() {
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to create pet sitter instructions by talking",
    description: DESCRIPTION,
    url: absoluteUrl("/talk-about-your-pet"),
    totalTime: "PT2M",
    tool: [{ "@type": "HowToTool", name: "A phone or computer with a microphone" }],
    step: STEPS.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${absoluteUrl("/talk-about-your-pet")}#step-${index + 1}`,
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Talk about your pet", path: "/talk-about-your-pet" },
            ]),
          ),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">Talk about your pet</span>
      </nav>

      <header>
        <h1 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">
          Talk about your pet — we&apos;ll write the care card
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Nobody wants to type out feeding times at 11pm the night before a trip. Speak for about a
          minute and Pet Care Card fills in the sitter instructions for you: food and portions,
          walks and bathroom habits, medication, emergency contacts and your vet. You check every
          field before anything is saved.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 rounded-xl px-6">
            <Link to="/pets/new">
              <Mic className="size-4" aria-hidden="true" /> Try it — talk about your pet
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-6">
            <Link to="/guides/voice-pet-sitter-instructions">Read the how-to guide</Link>
          </Button>
        </div>
      </header>

      <section className="mt-10" aria-labelledby="example-heading">
        <h2 id="example-heading" className="font-display text-2xl font-semibold">
          One minute of talking, one finished care card
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <figure className="rounded-3xl border border-border bg-secondary/50 p-6">
            <figcaption className="text-sm font-medium text-primary">What you say</figcaption>
            <blockquote className="mt-2 text-base leading-relaxed">
              &ldquo;{EXAMPLE_SPOKEN}&rdquo;
            </blockquote>
          </figure>
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm font-medium text-primary">What your sitter gets</p>
            <dl className="mt-3 space-y-3 text-sm">
              {EXAMPLE_FIELDS.map((field) => (
                <div key={field.label} className="flex gap-3">
                  <dt className="w-36 shrink-0 text-muted-foreground">{field.label}</dt>
                  <dd className="min-w-0 flex-1">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="font-display text-2xl font-semibold">
          How it works
        </h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map((step, index) => (
            <li
              key={step.name}
              id={`step-${index + 1}`}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display font-semibold text-primary">
                {index + 1}
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">{step.name}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="who-heading">
        <h2 id="who-heading" className="font-display text-2xl font-semibold">
          Who you&apos;re handing the card to
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          The same spoken description works for whoever is stepping in:
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "A professional pet sitter or house sitter who has never met your pet",
            "A dog walker covering a few days while you travel",
            "Grandparents or family watching the dog for the weekend",
            "A neighbour or friend popping in to feed the cat",
            "A boarding kennel or cattery that asks for written instructions",
            "A partner or teenager handling the routine on their own for once",
          ].map((audience) => (
            <li key={audience} className="rounded-2xl border border-border bg-card p-4 text-sm">
              {audience}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="font-display text-2xl font-semibold">
          What voice does and doesn&apos;t do
        </h2>
        <ul className="mt-4 space-y-3 text-base leading-relaxed">
          <li className="rounded-2xl border border-border bg-card p-4">
            <strong>Nothing saves until you say so.</strong> Everything lands on an editable review
            screen first, with blanks left blank rather than guessed.
          </li>
          <li className="rounded-2xl border border-border bg-card p-4">
            <strong>Your recording isn&apos;t kept.</strong> Audio is used to produce the text and
            then discarded. Your pet&apos;s details stay on your device.
          </li>
          <li className="rounded-2xl border border-border bg-card p-4">
            <strong>Medication is copied, never interpreted.</strong> Doses are written down exactly
            as you say them and flagged for you to check against the label. Pet Care Card gives no
            medical advice.
          </li>
          <li className="rounded-2xl border border-border bg-card p-4">
            <strong>Two free voice fills, then the one-off unlock.</strong> $4.99, one payment,
            lifetime access, no subscription. Typing stays free.
          </li>
          <li className="rounded-2xl border border-border bg-card p-4">
            <strong>English for now.</strong> Voice fill understands English; you can always type in
            any language.
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-display text-2xl font-semibold">
          Questions people ask
        </h2>
        <dl className="mt-4 space-y-5">
          {FAQS.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-border bg-card p-5">
              <dt className="font-display text-lg font-semibold">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <aside className="mt-10 rounded-3xl border border-border bg-secondary/50 p-6">
        <h2 className="font-display text-2xl font-semibold">Rather write it out?</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Use the free{" "}
          <Link to="/templates" className="text-primary hover:underline">
            printable pet care templates
          </Link>{" "}
          or work through the{" "}
          <Link
            to="/guides/$slug"
            params={{ slug: "pet-sitter-care-card-checklist" }}
            className="text-primary hover:underline"
          >
            pet sitter care card checklist
          </Link>
          . Both cover exactly the same details voice fills in for you.
        </p>
        <Button asChild size="lg" className="mt-5 h-12 rounded-xl px-6">
          <Link to="/pets/new">Create a care card</Link>
        </Button>
      </aside>
    </AppShell>
  );
}
