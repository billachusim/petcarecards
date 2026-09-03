import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { SITE_NAME, absoluteUrl, publicHead } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    publicHead({
      title: "Pricing — Pet Care Card is Free, Lifetime Unlock is $4.99",
      description:
        "Pet Care Card is free for one pet. A single $4.99 payment unlocks unlimited pets, PDF export, reminders and unlimited voice fill — forever. No subscription, no renewals.",
      path: "/pricing",
    }),
  component: PricingPage,
});

const freeFeatures = [
  "One pet care card",
  "Feeding, routine, medication, emergency and vet details",
  "Share by link, print, or hand over a QR code",
  "Two free voice fills (talk instead of typing)",
  "Works offline — data stays on your device",
];

const premiumFeatures = [
  "Unlimited pets",
  "PDF export of every care card",
  "Care and medication reminders",
  "Unlimited voice fill",
  "Optional encrypted account backup across devices",
  "All future updates included",
];

function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE_NAME} Lifetime Unlock`,
    description:
      "One-time lifetime unlock for Pet Care Card: unlimited pets, PDF export, reminders and unlimited voice fill.",
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: "4.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/pricing"),
    },
  };

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Pricing</h1>
        <p className="mt-2 text-muted-foreground">
          Pet Care Card is free to use for one pet. If you have more pets or want reminders and PDF
          export, there is a single one-time payment — never a subscription.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Free</h2>
          <p className="mt-1 text-3xl font-semibold">$0</p>
          <p className="mt-1 text-sm text-muted-foreground">No account required.</p>
          <ul className="mt-5 space-y-2 text-sm">
            {freeFeatures.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="secondary" className="mt-6 h-12 w-full rounded-xl">
            <Link to="/pets/new">Create a free care card</Link>
          </Button>
        </section>

        <section className="rounded-3xl border-2 border-primary bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Unlock Lifetime — $4.99</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One payment. Lifetime access. No subscription.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {premiumFeatures.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 h-12 w-full rounded-xl text-base">
            <Link to="/premium">Unlock Lifetime — $4.99</Link>
          </Button>
        </section>
      </div>

      <section className="mt-10 space-y-4 text-sm text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">Billing details</h2>
        <p>
          Prices are shown in US dollars. Local taxes (VAT/GST) may be added at checkout depending on
          your country and are shown before you pay.
        </p>
        <p>
          Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant
          of Record for all our orders. Paddle provides all customer service inquiries and handles
          returns.
        </p>
        <p>
          Not happy with your purchase? We offer a 30-day money-back guarantee — see our{" "}
          <Link to="/refunds" className="underline hover:text-foreground">
            refund policy
          </Link>
          . Questions before buying? Visit our{" "}
          <Link to="/contact" className="underline hover:text-foreground">
            contact page
          </Link>
          .
        </p>
      </section>
    </AppShell>
  );
}
