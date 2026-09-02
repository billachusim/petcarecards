import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { publicHead } from "@/lib/seo";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () =>
    publicHead({
      title: 'Privacy Policy — Pet Care Card',
      description: 'How Pet Care Card handles your data: pet details stay on your device, no data selling, no unnecessary tracking, and a one-tap way to delete everything.',
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
        <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Placeholder text — replace with your reviewed policy before launch.
        </p>
        <h2 className="font-display text-xl font-semibold">What we store</h2>
        <p>
          Pet Care Card keeps your pets, care details, reminders and photos in your browser&apos;s
          local storage on this device. We do not create an account for you.
        </p>
        <h2 className="font-display text-xl font-semibold">What we don&apos;t do</h2>
        <p>
          We do not sell your data, run advertising, or collect analytics about your pets. Nothing
          is uploaded unless you explicitly share or export it.
        </p>
        <h2 className="font-display text-xl font-semibold">Sharing</h2>
        <p>
          When you share a care card, the link or QR code contains only an identifier for the card —
          never your pet&apos;s details.
        </p>
        <h2 className="font-display text-xl font-semibold">Deleting your data</h2>
        <p>
          Settings → Delete all local data removes every pet and care card stored in this browser.
        </p>
        <h2 className="font-display text-xl font-semibold">Contact</h2>
        <p>Add your support contact address here before launch.</p>
      </article>
    </AppShell>
  );
}
