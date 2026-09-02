import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, Download, FileText, Pencil, Printer, QrCode, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { CareCardView } from "@/features/care-card/components/care-card-view";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import { generateCareCardPdf, pdfFileName } from "@/features/pdf/care-card-pdf";
import { PaywallDialog } from "@/features/premium/components/paywall-dialog";
import {
  buildCareCardUrl,
  downloadDataUrl,
  shareFile,
  shareLink,
} from "@/features/sharing/care-card-sharing-service";
import { firstError } from "@/lib/validation";

export const Route = createFileRoute("/care/$petId")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Care Card — Pet Care Card" },
      {
        name: "description",
        content:
          "A complete, glanceable care card: about, feeding, routine, medication, emergency contacts and vet details.",
      },
      { property: "og:title", content: "Pet Care Card" },
      {
        property: "og:description",
        content: "Everything a caregiver needs to look after this pet.",
      },
    ],
  }),
  component: CareCardPage,
});

function CareCardPage() {
  const { petId } = Route.useParams();
  const navigate = useNavigate();
  const { ready, buildCareCard, isPremium } = useCareStore();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const card = buildCareCard(petId);

  if (!ready) {
    return (
      <AppShell>
        <div className="h-96 animate-pulse rounded-3xl bg-card" aria-label="Loading" />
      </AppShell>
    );
  }

  if (!card) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-semibold">This care card isn&apos;t here.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Care cards are stored on the device that created them. Ask the owner to share the card
          again, or create your own.
        </p>
        <Button className="mt-6 rounded-xl" onClick={() => void navigate({ to: "/" })}>
          Go home
        </Button>
      </AppShell>
    );
  }

  const requirePremium = (action: () => void) => {
    if (!isPremium) {
      setPaywallOpen(true);
      return;
    }
    action();
  };

  const handleShare = async () => {
    try {
      const result = await shareLink(
        `${card.pet.name}'s Care Card`,
        `Everything you need to look after ${card.pet.name}.`,
        buildCareCardUrl(petId),
      );
      if (result.method === "clipboard") toast.success("Link copied to your clipboard.");
      if (result.method === "unsupported")
        toast.error("Sharing isn't available in this browser. Copy the address bar link instead.");
    } catch (error) {
      toast.error(firstError(error));
    }
  };

  const handlePdf = async (mode: "download" | "share") => {
    setBusy(true);
    try {
      const blob = await generateCareCardPdf(card);
      const filename = pdfFileName(card.pet.name);
      if (mode === "share") {
        const file = new File([blob], filename, { type: "application/pdf" });
        const result = await shareFile(file, `${card.pet.name}'s Care Card`, "Care instructions");
        if (result.method === "unsupported") {
          downloadDataUrl(URL.createObjectURL(blob), filename);
          toast.success("Your browser can't share files, so we downloaded the PDF instead.");
        }
        return;
      }
      downloadDataUrl(URL.createObjectURL(blob), filename);
      toast.success("PDF saved.");
    } catch (error) {
      toast.error(firstError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PaywallDialog open={paywallOpen} onOpenChange={setPaywallOpen} />

      <div className="no-print mb-4 flex items-center justify-between">
        <Button variant="ghost" className="-ml-2 rounded-xl" onClick={() => void navigate({ to: "/" })}>
          <ArrowLeft className="size-4" aria-hidden="true" /> Back
        </Button>
        <Button asChild variant="ghost" className="rounded-xl">
          <Link to="/pets/$petId/edit" params={{ petId }}>
            <Pencil className="size-4" aria-hidden="true" /> Edit
          </Link>
        </Button>
      </div>

      <CareCardView card={card} />

      <div id="share" className="no-print mt-8 space-y-3">
        <h2 className="font-display text-lg font-semibold">Share this card</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button className="h-12 rounded-xl" onClick={() => void handleShare()}>
            <Share2 className="size-4" aria-hidden="true" /> Share Care Card
          </Button>
          <Button asChild variant="secondary" className="h-12 rounded-xl">
            <Link to="/care/$petId/qr" params={{ petId }}>
              <QrCode className="size-4" aria-hidden="true" /> QR Code
            </Link>
          </Button>
          <Button
            variant="secondary"
            className="h-12 rounded-xl"
            disabled={busy}
            onClick={() => requirePremium(() => window.print())}
          >
            <Printer className="size-4" aria-hidden="true" /> Print
          </Button>
          <Button
            variant="secondary"
            className="h-12 rounded-xl"
            disabled={busy}
            onClick={() => requirePremium(() => void handlePdf("download"))}
          >
            <Download className="size-4" aria-hidden="true" />
            {busy ? "Preparing…" : "Download PDF"}
          </Button>
          <Button
            variant="secondary"
            className="h-12 rounded-xl"
            disabled={busy}
            onClick={() => requirePremium(() => void handlePdf("share"))}
          >
            <FileText className="size-4" aria-hidden="true" /> Share PDF
          </Button>
          <Button asChild variant="secondary" className="h-12 rounded-xl">
            <Link to="/reminders">
              <Bell className="size-4" aria-hidden="true" /> Reminders
            </Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Care cards live on this device. Sharing sends a link to this card&apos;s address — no
          private data is put inside the link or QR code itself.
        </p>
      </div>
    </AppShell>
  );
}
