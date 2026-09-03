import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_NAME,
  SITE_NAME,
  absoluteUrl,
  breadcrumbLd,
  organizationLd,
  publicHead,
} from "@/lib/seo";

const TITLE = "About Pet Care Card";
const DESCRIPTION =
  "Pet Care Card is made by Tech Faculty. Learn who builds the app, how the caregiver guides are written and reviewed, how pet data is handled, and how to get in touch.";

export const Route = createFileRoute("/about")({
  head: () =>
    publicHead({
      title: `${TITLE} — Who Makes It and How It Works | ${SITE_NAME}`,
      description: DESCRIPTION,
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  const aboutLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd,
      {
        "@type": "AboutPage",
        name: TITLE,
        description: DESCRIPTION,
        url: absoluteUrl("/about"),
        about: { "@id": `${absoluteUrl("/")}#organization` },
      },
    ],
  };

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">About</span>
      </nav>

      <h1 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">
        About Pet Care Card
      </h1>
      <p className="mt-4 text-base leading-relaxed">
        Pet Care Card is a small web tool for one specific moment: the day you hand your pet over to
        a sitter, a family member or a boarding facility. It collects feeding, routine, medication,
        emergency and vet details into one readable card you can share by link, print, or show as a
        QR code — in about two minutes, with no account.
      </p>
      <p className="mt-3 text-base leading-relaxed">
        If typing it all out is the part you dread, you can{" "}
        <Link to="/talk-about-your-pet" className="text-primary hover:underline">
          talk about your pet
        </Link>{" "}
        instead: speak for a minute and the care card is written for you to check before anything
        saves.
      </p>


      <h2 className="mt-10 font-display text-2xl font-semibold">Who makes it</h2>
      <p className="mt-3 text-base leading-relaxed">
        Pet Care Card is built and published by {BUSINESS_NAME}, an independent software studio.
        {" "}
        {BUSINESS_NAME} is the seller of record for the lifetime unlock and the publisher of the
        Caregiver Guides on this site. Payments are processed by Paddle as Merchant of Record.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">How the guides are written</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
        <li>
          Every guide is written by the Pet Care Card team from the practical handover problems
          owners and sitters actually run into, and is reviewed before publication.
        </li>
        <li>
          Guides give organisational and preparation advice only. We do not give medical advice and
          never recommend medications or dosages — anything clinical is your veterinarian&apos;s call.
        </li>
        <li>
          Each guide shows its published and last-updated date, and we re-check content whenever the
          app changes or a reader tells us something is unclear.
        </li>
        <li>
          A new guide is published every week, and every guide is free to read with no sign-up.
        </li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">How your pet&apos;s data is handled</h2>
      <p className="mt-3 text-base leading-relaxed">
        Pet details are stored locally in your own browser. There is no account, and nothing about
        your pet is uploaded unless you explicitly share or export it. Purchase entitlement is
        verified on our server and kept separately from pet data. The{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          privacy policy
        </Link>{" "}
        has the full detail.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">What it is not</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
        <li>Not a vet service, and not a source of medical advice</li>
        <li>Not a sitter-booking marketplace or a social network</li>
        <li>Not a subscription — the optional lifetime unlock is a single $4.99 payment</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold">Contact</h2>
      <p className="mt-3 text-base leading-relaxed">
        Questions, corrections or press enquiries:{" "}
        <a href="mailto:support@petcarecards.app" className="text-primary hover:underline">
          support@petcarecards.app
        </a>
        .
      </p>

      <Button asChild size="lg" className="mt-8 h-12 rounded-xl px-6">
        <Link to="/pets/new">Create a care card</Link>
      </Button>
    </AppShell>
  );
}
