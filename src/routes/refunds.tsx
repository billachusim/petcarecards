import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { publicHead } from "@/lib/seo";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/refunds")({
  head: () =>
    publicHead({
      title: "Refund Policy — Pet Care Card",
      description:
        "Pet Care Card offers a 30-day money-back guarantee on the one-time $4.99 lifetime unlock. Refunds are handled by Paddle, our Merchant of Record.",
      path: "/refunds",
    }),
  component: RefundsPage,
});

function RefundsPage() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/settings" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>
      <article className="space-y-5 rounded-3xl border border-border bg-card p-6 leading-relaxed">
        <h1 className="font-display text-3xl font-semibold">Refund Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: 3 September 2026</p>

        <h2 className="font-display text-xl font-semibold">30-day money-back guarantee</h2>
        <p>
          Pet Care Card is sold by <strong>Tech Faculty</strong> as a one-time $4.99 lifetime
          unlock. If you are not satisfied with your purchase, you can request a full refund within
          30 days of your order date, for any reason.
        </p>

        <h2 className="font-display text-xl font-semibold">How to request a refund</h2>
        <p>
          Our order process is conducted by our online reseller Paddle.com, the Merchant of Record
          for all our orders. Paddle handles customer service enquiries and returns.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Visit{" "}
            <a className="underline" href="https://paddle.net" target="_blank" rel="noreferrer noopener">
              paddle.net
            </a>{" "}
            and enter the email address you used at checkout, or
          </li>
          <li>
            email us at{" "}
            <a className="underline" href="mailto:support@petcarecards.app">
              support@petcarecards.app
            </a>{" "}
            with your order email and we will arrange it with Paddle.
          </li>
        </ul>

        <h2 className="font-display text-xl font-semibold">After a refund</h2>
        <p>
          Approved refunds are returned to your original payment method by Paddle, usually within
          5&ndash;10 business days depending on your bank. Once a refund is processed, the lifetime
          unlock is deactivated and premium features return to the free tier. Pets and care cards
          stored on your device are not deleted; you can export them at any time.
        </p>

        <h2 className="font-display text-xl font-semibold">Questions</h2>
        <p>
          Email{" "}
          <a className="underline" href="mailto:support@petcarecards.app">support@petcarecards.app</a>.
          See also our <Link className="underline" to="/terms">Terms of Use</Link> and{" "}
          <Link className="underline" to="/privacy">Privacy Notice</Link>.
        </p>
      </article>
    </AppShell>
  );
}
