import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LIFETIME_PRICE, PREMIUM_BENEFITS } from "../premium-service";

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaywallDialog({ open, onOpenChange }: PaywallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <DialogTitle className="font-display text-2xl">
            Keep everything ready for your pet&apos;s caregiver.
          </DialogTitle>
          <DialogDescription>
            Unlock the full Care Card toolkit with a single payment.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2.5">
          {PREMIUM_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-sm">
              <span className="flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="size-3" aria-hidden="true" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild size="lg" className="h-12 w-full rounded-xl text-base">
            <Link to="/premium">Unlock Lifetime — {LIFETIME_PRICE}</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            One payment. No subscription.
          </p>
          <Button asChild variant="ghost" className="w-full rounded-xl">
            <Link to="/premium">Restore Purchase</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
