import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import {
  downloadDataUrl,
  generateQrDataUrl,
  shareLink,
} from "@/features/sharing/care-card-sharing-service";
import { useShareLink } from "@/features/sharing/use-share-link";
import { firstError } from "@/lib/validation";

export const Route = createFileRoute("/care/$petId/qr")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "QR code — Pet Care Card" },
      {
        name: "description",
        content: "Show a QR code so a sitter can open the care card instantly on their phone.",
      },
      { property: "og:title", content: "QR code — Pet Care Card" },
      { property: "og:description", content: "Scan to open this pet's care card." },
    ],
  }),
  component: QrPage,
});

function QrPage() {
  const { petId } = Route.useParams();
  const navigate = useNavigate();
  const { ready, getPet, buildCareCard } = useCareStore();
  const pet = getPet(petId);
  const share = useShareLink(petId);
  const [qr, setQr] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!ready || !pet) return;
    let active = true;
    void (async () => {
      try {
        // Publish first when signed in, so the QR points at a link any device opens.
        const card = buildCareCard(petId);
        const url = share.signedIn && card ? await share.publish(card) : share.url;
        const dataUrl = await generateQrDataUrl(url);
        if (active) setQr(dataUrl);
      } catch (err) {
        if (active) setError(firstError(err));
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pet, petId, share.signedIn]);

  return (
    <AppShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/care/$petId", params: { petId } })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>

      <div className="rounded-3xl border border-border bg-card p-6 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Scan to view {pet?.name ?? "this pet"}&apos;s Care Card
        </h1>
        <div className="mx-auto mt-6 flex size-64 items-center justify-center rounded-2xl bg-white p-3">
          {qr ? (
            <img src={qr} alt={`QR code linking to ${pet?.name ?? "the"} care card`} className="size-full" />
          ) : (
            <span className="text-sm text-muted-foreground">{error ?? "Creating QR code…"}</span>
          )}
        </div>
        <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-muted-foreground">
          The code only contains a link to this card&apos;s address — never your pet&apos;s details.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button
            className="h-12 rounded-xl"
            disabled={!qr}
            onClick={async () => {
              try {
                const result = await shareLink(
                  `${pet?.name ?? "Pet"}'s Care Card`,
                  "Scan or tap to open the care card.",
                  buildCareCardUrl(petId),
                );
                if (result.method === "clipboard") toast.success("Link copied to your clipboard.");
                if (result.method === "unsupported") toast.error("Sharing isn't available here.");
              } catch (err) {
                toast.error(firstError(err));
              }
            }}
          >
            <Share2 className="size-4" aria-hidden="true" /> Share QR Code
          </Button>
          <Button
            variant="secondary"
            className="h-12 rounded-xl"
            disabled={!qr}
            onClick={() => {
              if (!qr) return;
              downloadDataUrl(qr, `${(pet?.name ?? "pet").toLowerCase()}-care-card-qr.png`);
              toast.success("QR code saved.");
            }}
          >
            <Download className="size-4" aria-hidden="true" /> Save QR Code
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
