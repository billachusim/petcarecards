import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { publicHead } from "@/lib/seo";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () =>
    publicHead({
      title: 'Terms of Use — Pet Care Card',
      description: 'The terms covering Pet Care Card, including the one-time $4.99 lifetime unlock and the no-medical-advice policy.',
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
        <p className="text-sm font-medium text-muted-foreground">
          Placeholder text — replace with your reviewed terms before launch.
        </p>
        <h2 className="font-display text-xl font-semibold">The service</h2>
        <p>
          Pet Care Card is an organisational tool. It stores the care instructions you enter and
          helps you share them with a caregiver.
        </p>
        <h2 className="font-display text-xl font-semibold">No medical advice</h2>
        <p>
          The app does not provide medical advice or recommend medications or dosages. It only helps
          owners organize instructions they provide. Always consult a veterinarian.
        </p>
        <h2 className="font-display text-xl font-semibold">Lifetime unlock</h2>
        <p>
          Premium is a one-time purchase of $4.99 that unlocks the listed features. It is not a
          subscription and does not renew.
        </p>
        <h2 className="font-display text-xl font-semibold">Your data</h2>
        <p>
          You are responsible for the accuracy of the information you enter and for keeping your own
          backups using the export option.
        </p>
        <h2 className="font-display text-xl font-semibold">Contact</h2>
        <p>Add your support contact address here before launch.</p>
      </article>
    </AppShell>
  );
}
