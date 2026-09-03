import { Mic } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PaywallDialog } from "@/features/premium/components/paywall-dialog";

import { VoiceFillDialog } from "./voice-fill-dialog";
import type { ParsedCareDetails } from "./voice-types";
import { FREE_VOICE_FILLS, voiceFillsLeft } from "./voice-usage";

interface VoiceFillButtonProps {
  isPremium: boolean;
  onConfirm: (details: ParsedCareDetails) => void;
  label?: string;
}

/** Entry point for voice fill: free twice, then the lifetime unlock. */
export function VoiceFillButton({
  isPremium,
  onConfirm,
  label = "Talk about your pet",
}: VoiceFillButtonProps) {
  const [open, setOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const openVoice = () => {
    if (!isPremium && voiceFillsLeft() <= 0) {
      setPaywallOpen(true);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <div className="rounded-3xl border border-dashed border-border bg-card p-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-13 w-full rounded-2xl"
          onClick={openVoice}
        >
          <Mic className="size-4" aria-hidden="true" /> {label}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isPremium
            ? "Speak instead of typing — you check everything before it's saved."
            : `Speak instead of typing. ${voiceFillsLeft()} of ${FREE_VOICE_FILLS} free voice fills left.`}
        </p>
      </div>

      <VoiceFillDialog
        open={open}
        onOpenChange={setOpen}
        isPremium={isPremium}
        onConfirm={onConfirm}
      />
      <PaywallDialog open={paywallOpen} onOpenChange={setPaywallOpen} />
    </>
  );
}
