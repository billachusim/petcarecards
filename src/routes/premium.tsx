import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import {
  LIFETIME_PRICE,
  PREMIUM_BENEFITS,
  clearPendingCheckoutEmail,
  confirmCheckoutReturn,
  readPendingCheckoutEmail,
  restorePurchase,
  startLifetimeCheckout,
  verifyEntitlement,
} from "@/features/premium/premium-service";
import { firstError } from "@/lib/validation";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
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

/** Polls the server after checkout until the payment webhook has landed. */
async function waitForEntitlement(email: string) {
  for (let attempt = 0; attempt < 12; attempt++) {
    const entitlement = await verifyEntitlement(email);
    if (entitlement.lifetimeUnlocked) return entitlement;
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }
  return undefined;
}

function PremiumPage() {
  const navigate = useNavigate();
  const { isPremium, entitlement, setEntitlement } = useCareStore();
  const [email, setEmail] = useState(entitlement.email ?? "");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const handledReturn = useRef(false);

  // Handle the redirect back from the hosted checkout.
  useEffect(() => {
    if (handledReturn.current) return;
    handledReturn.current = true;

    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("transaction_id");
    const flwStatus = params.get("status");
    if (!transactionId && !flwStatus) return;

    const pendingEmail = readPendingCheckoutEmail() ?? entitlement.email ?? "";
    window.history.replaceState({}, "", window.location.pathname);

    if (flwStatus && flwStatus !== "successful" && flwStatus !== "completed") {
      clearPendingCheckoutEmail();
      setStatus("Your payment wasn't completed. You can try again — nothing was charged.");
      return;
    }
    if (!pendingEmail) return;

    setEmail(pendingEmail);
    setBusy(true);
    setStatus("Payment received — confirming your unlock…");
    void (async () => {
      try {
        if (transactionId) await confirmCheckoutReturn(transactionId);
        const verified = await waitForEntitlement(pendingEmail);
        if (verified) {
          clearPendingCheckoutEmail();
          setEntitlement(verified);
          toast.success("Lifetime access unlocked.");
          setStatus(null);
        } else {
          setStatus(
            "Your payment went through. It's taking a moment to confirm — tap Restore Purchase in a minute.",
          );
        }
      } catch (error) {
        setStatus(firstError(error));
      } finally {
        setBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnlock = async () => {
    if (!email.trim()) {
      toast.error("Please add your email so we can link your purchase.");
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await startLifetimeCheckout(email);
    } catch (error) {
      toast.error(firstError(error));
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    setBusy(true);
    try {
      const restored = await restorePurchase(email);
      setEntitlement(restored);
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
          Unlock Lifetime Premium
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep everything ready for your pet&apos;s caregiver. The free plan covers one pet with a
          full basic care card. Lifetime unlocks the rest.
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
            Lifetime access is active{entitlement.email ? ` for ${entitlement.email}` : ""}. Thank
            you.
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-2">
              <Label htmlFor="premium-email">Email for your receipt</Label>
              <Input
                id="premium-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-12 rounded-xl"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We use this only to link your purchase so you can restore it on another device.
              </p>
            </div>

            <Button
              size="lg"
              className="mt-5 h-14 w-full rounded-2xl text-base"
              disabled={busy}
              onClick={() => void handleUnlock()}
            >
              Unlock Lifetime — {LIFETIME_PRICE}
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              One payment. Lifetime access. No subscription.
            </p>
            {status && (
              <p className="mt-3 text-center text-sm font-medium text-foreground">{status}</p>
            )}
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
