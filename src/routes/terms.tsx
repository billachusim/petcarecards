import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { publicHead } from "@/lib/seo";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () =>
    publicHead({
      title: "Terms of Use — Pet Care Card",
      description:
        "The terms between you and Tech Faculty for Pet Care Card, covering acceptable use, the one-time $4.99 lifetime unlock, Flutterwave as payment processor, and the no-medical-advice policy.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
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
        <h1 className="font-display text-3xl font-semibold">Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Last updated: 3 September 2026</p>

        <h2 className="font-display text-xl font-semibold">1. Who you are contracting with</h2>
        <p>
          Pet Care Card (the &ldquo;Service&rdquo;) is provided by <strong>Tech Faculty</strong>{" "}
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;). These Terms form an agreement between you and Tech
          Faculty. Contact:{" "}
          <a className="underline" href="mailto:support@petcarecards.app">support@petcarecards.app</a>.
        </p>

        <h2 className="font-display text-xl font-semibold">2. Acceptance</h2>
        <p>
          By accessing or continuing to use the Service, or by purchasing the lifetime unlock, you
          agree to these Terms. If you do not agree, please stop using the Service. You confirm you
          are of legal age to enter this agreement, and that if you use the Service on behalf of an
          organisation you have authority to bind it.
        </p>

        <h2 className="font-display text-xl font-semibold">3. What the Service does</h2>
        <p>
          Pet Care Card is an organisational tool. It stores the pet care instructions you enter and
          helps you present, print, export and share them with a caregiver as a care card or QR
          code.
        </p>

        <h2 className="font-display text-xl font-semibold">4. Licence and restrictions</h2>
        <p>
          We grant you a limited, non-exclusive, non-transferable right to use the Service for your
          own pet care purposes, within the plan you have. You may not resell or redistribute the
          Service, reverse engineer it, or circumvent technical limits or paid feature gates.
        </p>

        <h2 className="font-display text-xl font-semibold">5. Acceptable use</h2>
        <p>You must not misuse the Service. In particular, you must not:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>use it for any unlawful purpose, or to store or share unlawful content;</li>
          <li>use it for fraud, spam or deceptive activity;</li>
          <li>infringe anyone&apos;s intellectual property or privacy rights;</li>
          <li>
            interfere with the security or integrity of the Service, including introducing malware,
            probing or scanning it, bypassing authentication, or scraping it in bulk;
          </li>
          <li>upload personal data about other people without a lawful basis to do so.</li>
        </ul>

        <h2 className="font-display text-xl font-semibold">6. Your content and accuracy</h2>
        <p>
          You keep ownership of the information you enter. You grant us a limited licence to host and
          process it solely to provide the Service. You are responsible for the accuracy of your
          content and for keeping your own backups using the export option.
        </p>
        <p>
          Backup and sync is optional. If you create an account and switch it on, you instruct us to
          store a copy of your care data, including photos and free-text notes, against your account
          so it can be restored on your other devices, and you permit us to use it to operate and
          improve the Service. You may switch backup off or delete the stored copy at any time in
          Settings. We may publish or license aggregated, anonymised insights derived from care data
          that do not identify you or your pets, as described in the Privacy Policy.
        </p>


        <h2 className="font-display text-xl font-semibold">7. Intellectual property</h2>
        <p>
          The Service, including its software, design, templates, guide content, documentation and
          branding, is owned by Tech Faculty or its licensors. Nothing in these Terms transfers that
          ownership to you.
        </p>

        <h2 className="font-display text-xl font-semibold">8. No medical advice</h2>
        <p>
          The Service does not provide medical advice and does not recommend medications or dosages.
          It only helps owners organise instructions they already have. Always consult a
          veterinarian for advice about your pet&apos;s health or treatment.
        </p>

        <h2 className="font-display text-xl font-semibold">9. Lifetime unlock and payment</h2>
        <p>
          Premium is a one-time purchase of $4.99 that unlocks the listed features. It is not a
          subscription and does not renew.
        </p>
        <p>
          Tech Faculty is the seller of record for all orders. Payments are processed securely by
          our payment provider, Flutterwave; we never receive or store your card details. Prices are
          in US dollars and any applicable taxes are shown at checkout. Billing questions, returns
          and refunds are handled by us directly &mdash; see our{" "}
          <Link className="underline" to="/refunds">Refund Policy</Link>.
        </p>

        <h2 className="font-display text-xl font-semibold">10. Availability and warranties</h2>
        <p>
          We aim to keep the Service available, but we do not guarantee uninterrupted or error-free
          performance; it may be unavailable for maintenance, updates or reasons outside our
          control. Browser notifications only fire while your browser is running and are not a
          substitute for native alarms. To the fullest extent permitted by law, the Service is
          provided &ldquo;as is&rdquo; and we disclaim implied warranties including merchantability
          and fitness for a particular purpose.
        </p>

        <h2 className="font-display text-xl font-semibold">11. Liability</h2>
        <p>
          To the extent permitted by law, we are not liable for indirect, consequential or special
          damages, including loss of profits, data or goodwill, and our total aggregate liability is
          limited to the amount you paid us in the 12 months before the claim. Nothing limits
          liability for fraud, death or personal injury caused by negligence, or anything else that
          cannot be limited by law.
        </p>

        <h2 className="font-display text-xl font-semibold">12. Suspension and termination</h2>
        <p>
          We may suspend or terminate your access to the Service if you materially breach these
          Terms, fail to pay, create a security or fraud risk, or repeatedly or seriously violate
          our acceptable use rules. You may stop using the Service at any time; data stored on your
          device remains yours and can be exported or deleted from Settings.
        </p>

        <h2 className="font-display text-xl font-semibold">13. Changes to these Terms</h2>
        <p>
          We may update these Terms; the date above shows the latest version. Continued use after an
          update means you accept the revised Terms.
        </p>

        <h2 className="font-display text-xl font-semibold">14. General</h2>
        <p>
          You may not assign these Terms without our consent; we may assign them as part of a merger
          or acquisition. Neither party is liable for delays caused by events beyond their
          reasonable control. These Terms are governed by the laws of the seller&apos;s jurisdiction
          and disputes will be handled by its competent courts.
        </p>
        <p>
          Questions:{" "}
          <a className="underline" href="mailto:support@petcarecards.app">support@petcarecards.app</a>.
          See also our <Link className="underline" to="/privacy">Privacy Notice</Link>.
        </p>
      </article>
    </AppShell>
  );
}
