import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import { LIFETIME_PRICE, PREMIUM_BENEFITS, restorePurchase } from "@/features/premium/premium-service";
import { firstError } from "@/lib/validation";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Unlock Lifetime — Pet Care Card" },
      {
        name: "description",
        content:
          "One payment of $4.99 unlocks unlimited pets, medication schedules, reminders, printable care cards, PDF export and sharing. No subscription.",
      },
      { property: "og:title", content: "Unlock Lifetime — Pet Care Card" },
      { property: "og:description", content: "One payment. Lifetime access. No subscription." },
    ],
  }),
  component: PremiumPage,
});

function PremiumPage() {
  const navigate = useNavigate();
  const { isPremium, setEntitlement } = useCareStore();
  const [busy, setBusy] = useState(false);

  const handleRestore = async () => {
    setBusy(true);
    try {
      await restorePurchase();
      toast.success("Lifetime access restored.");
    } catch (error) {
      toast.error(firstError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/" })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="size-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-3xl leading-tight font-semibold">
          Keep everything ready for your pet&apos;s caregiver.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The free plan covers one pet with a full basic care card. Lifetime unlocks the rest.
        </p>

        <ul className="mt-6 space-y-3">
          {PREMIUM_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-base">
              <span className="flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        {isPremium ? (
          <div className="mt-8 rounded-2xl bg-accent/60 px-4 py-4 text-center text-sm font-medium text-accent-foreground">
            Lifetime access is active on this device. Thank you.
          </div>
        ) : (
          <>
            <Button
              size="lg"
              className="mt-8 h-14 w-full rounded-2xl text-base"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                setEntitlement({
                  lifetimeUnlocked: true,
                  purchasedAt: new Date().toISOString(),
                  reference: "pending-checkout",
                });
                setBusy(false);
                toast.success("Lifetime access unlocked.");
              }}
            >
              Unlock Lifetime — {LIFETIME_PRICE}
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              One payment. Lifetime access. No subscription.
            </p>
            <Button
              variant="ghost"
              className="mt-2 w-full rounded-xl"
              disabled={busy}
              onClick={() => void handleRestore()}
            >
              Restore Purchase
            </Button>
          </>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/terms" className="underline underline-offset-4">
            Terms of Use
          </Link>{" "}
          ·{" "}
          <Link to="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
