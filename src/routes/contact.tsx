import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/app/app-shell";
import { SITE_NAME, publicHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    publicHead({
      title: "Contact Pet Care Card — Support from Tech Faculty",
      description:
        "Contact the Pet Care Card team at Tech Faculty for product support, billing questions, refunds or privacy requests. We reply to every email within two business days.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Contact us</h1>
        <p className="mt-2 text-muted-foreground">
          {SITE_NAME} is built and operated by Tech Faculty. A real person reads every message and we
          aim to reply within two business days.
        </p>
      </header>

      <section className="space-y-6 text-sm">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Support and general enquiries</h2>
          <p className="mt-2 text-muted-foreground">
            Email{" "}
            <a href="mailto:support@petcarecards.app" className="font-medium text-foreground underline">
              support@petcarecards.app
            </a>{" "}
            for help with care cards, sharing, reminders, voice fill or anything that is not working.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Billing, invoices and refunds</h2>
          <p className="mt-2 text-muted-foreground">
            Our order process is conducted by our online reseller Paddle.com, the Merchant of Record
            for all our orders. For invoices, payment issues or refunds you can contact Paddle at{" "}
            <a href="https://paddle.net" className="font-medium text-foreground underline" rel="noopener">
              paddle.net
            </a>
            , or email us and we will help. See our{" "}
            <Link to="/refunds" className="font-medium text-foreground underline">
              refund policy
            </Link>{" "}
            and{" "}
            <Link to="/pricing" className="font-medium text-foreground underline">
              pricing
            </Link>
            .
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Privacy and data requests</h2>
          <p className="mt-2 text-muted-foreground">
            To access, export or delete data held in an optional backup account, email{" "}
            <a href="mailto:support@petcarecards.app" className="font-medium text-foreground underline">
              support@petcarecards.app
            </a>{" "}
            with the email address on the account. Details are in our{" "}
            <Link to="/privacy" className="font-medium text-foreground underline">
              privacy notice
            </Link>
            .
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Business details</h2>
          <p className="mt-2 text-muted-foreground">
            Tech Faculty, trading as {SITE_NAME}. Website: petcarecards.app. All correspondence is
            handled by email at support@petcarecards.app.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
