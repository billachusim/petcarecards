import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { publicHead } from "@/lib/seo";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () =>
    publicHead({
      title: "Privacy Notice — Pet Care Card",
      description:
        "How Tech Faculty handles personal data in Pet Care Card: what we collect, why, who we share it with (including Paddle as Merchant of Record), retention, security and your rights.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
        <h1 className="font-display text-3xl font-semibold">Privacy Notice</h1>
        <p className="text-sm text-muted-foreground">Last updated: 3 September 2026</p>

        <h2 className="font-display text-xl font-semibold">Who we are</h2>
        <p>
          Pet Care Card is operated by <strong>Tech Faculty</strong> (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;). Tech Faculty is the data controller for the personal data described in
          this notice, meaning we decide why and how it is processed. You can reach us at{" "}
          <a className="underline" href="mailto:support@petcarecards.app">
            support@petcarecards.app
          </a>
          .
        </p>

        <h2 className="font-display text-xl font-semibold">Pet data stays on your device</h2>
        <p>
          Pets, care details, photos, medications and reminders you enter are stored in your
          browser&apos;s local storage on the device you used. We do not create an account for you
          and we do not upload that content to our servers unless you explicitly share or export it,
          or you switch on optional backup.
        </p>

        <h2 className="font-display text-xl font-semibold">Optional backup and sync</h2>
        <p>
          Backup is off by default and the app works fully without it. If you create an account and
          switch backup on in Settings, we store a copy of your care data against your account so
          you can restore it on another device: pet names, species, breed, age, photos, feeding,
          routine, medication, emergency contact, veterinarian, reminder and caregiver details,
          free-text notes, and your account email address. Our legal basis is your consent, which
          you can withdraw at any time by switching backup off.
        </p>
        <p>
          We use this data to provide backup and restore, and to improve Pet Care Card. We do not
          sell or share your identifiable care data or photos with third parties, and we do not use
          it to advertise to you. We may publish, share or license aggregated and anonymised
          insights (for example, how common a feeding pattern is) that cannot reasonably be used to
          identify you, your household, or an individual pet.
        </p>
        <p>
          You can delete your backup at any time from Settings, which permanently removes those
          records from our servers. Deleting your backup does not delete the copy on your device.
        </p>


        <h2 className="font-display text-xl font-semibold">Personal data we process</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Purchase email address</strong> — to link your one-time lifetime unlock to you,
            verify your entitlement and let you restore your purchase on another device. Legal
            basis: performance of our contract with you.
          </li>
          <li>
            <strong>Purchase records</strong> (transaction, product and price identifiers, purchase
            status and dates, refund status) received from our payment provider — to provide and
            support the purchase and to meet accounting obligations. Legal basis: contract and legal
            obligation.
          </li>
          <li>
            <strong>Support messages</strong> you send us, including your email address and the
            content of your message — to answer you. Legal basis: legitimate interests in
            supporting our users.
          </li>
          <li>
            <strong>Technical data</strong> processed by our hosting provider when you load the site
            (IP address, device and browser information, request logs) — to deliver the service and
            to keep it secure and free from abuse. Legal basis: legitimate interests in security and
            reliable operation.
          </li>
        </ul>
        <p>
          We do not sell personal data, run advertising, or use analytics or tracking cookies. We do
          not process pet health information on our servers.
        </p>

        <h2 className="font-display text-xl font-semibold">Cookies and local storage</h2>
        <p>
          We use only essential browser storage: local storage to keep your pets, care cards and
          settings on your device, and storage required by our payment provider during checkout. We
          set no analytics or marketing cookies, so no consent banner is required. Clearing your
          browser storage removes this data.
        </p>

        <h2 className="font-display text-xl font-semibold">Who we share data with</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Paddle.com Market Ltd</strong>, our Merchant of Record. Paddle handles checkout,
            payment processing, billing, sales tax compliance, invoicing, customer purchase
            enquiries and refunds, and receives the personal data needed for those purposes. See{" "}
            <a
              className="underline"
              href="https://www.paddle.com/legal/privacy"
              target="_blank"
              rel="noreferrer noopener"
            >
              Paddle&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Service providers and subprocessors</strong> — hosting, database and
            infrastructure providers that operate the site and store purchase records on our
            instructions.
          </li>
          <li>
            <strong>Professional advisers</strong> such as accountants and lawyers, where necessary.
          </li>
          <li>
            <strong>Authorities</strong> where we are required to disclose data by law.
          </li>
        </ul>

        <h2 className="font-display text-xl font-semibold">International transfers</h2>
        <p>
          Our providers may process data outside your country, including in the United States. Where
          data leaves the UK or EEA, transfers are protected by an adequacy decision or by Standard
          Contractual Clauses with appropriate safeguards.
        </p>

        <h2 className="font-display text-xl font-semibold">How long we keep data</h2>
        <p>
          Purchase records and the associated email address are kept for as long as your lifetime
          unlock remains valid and, after that, for up to seven years to satisfy tax and accounting
          rules. Support messages are kept for up to 24 months. Server logs are kept for up to 90
          days. Data on your device stays until you delete it. When data is no longer needed it is
          deleted or anonymised.
        </p>

        <h2 className="font-display text-xl font-semibold">Security</h2>
        <p>
          We use appropriate technical and organisational measures, including encryption in transit
          (HTTPS), encryption at rest for our database, access controls limiting who can reach
          purchase records, and signed, verified payment webhooks. Card details are never handled by
          us — they go directly to Paddle.
        </p>

        <h2 className="font-display text-xl font-semibold">Your rights</h2>
        <p>
          Subject to applicable law, you may request access to your personal data, correction,
          erasure, restriction of processing, portability, and object to processing based on our
          legitimate interests. Where we rely on consent, you may withdraw it at any time. Email{" "}
          <a className="underline" href="mailto:support@petcarecards.app">
            support@petcarecards.app
          </a>{" "}
          and we will respond within one month. If you are in the UK or EEA, you may also complain
          to your local data protection supervisory authority.
        </p>
        <p>
          To erase everything held on your device, open Settings and choose &ldquo;Delete all local
          data&rdquo;.
        </p>

        <h2 className="font-display text-xl font-semibold">Sharing a care card</h2>
        <p>
          When you share a care card, the link or QR code contains only an identifier for the card —
          never your pet&apos;s details. Sharing is always initiated by you.
        </p>

        <h2 className="font-display text-xl font-semibold">Changes and contact</h2>
        <p>
          We may update this notice; the date at the top shows the latest version. Questions or
          requests: <a className="underline" href="mailto:support@petcarecards.app">support@petcarecards.app</a>.
          See also our <Link className="underline" to="/terms">Terms of Use</Link> and{" "}
          <Link className="underline" to="/refunds">Refund Policy</Link>.
        </p>
      </article>
    </AppShell>
  );
}
