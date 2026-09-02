import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, PawPrint, Pencil, Plus, QrCode, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { EmptyState } from "@/components/app/empty-state";
import { PetAvatar } from "@/features/pets/components/pet-avatar";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/features/pets/data/care-data-repository";
import { useCareStore } from "@/features/pets/hooks/use-care-store";
import { PaywallDialog } from "@/features/premium/components/paywall-dialog";
import { readJson } from "@/lib/storage/local-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pet Care Card — Everything your sitter needs, in one card" },
      {
        name: "description",
        content:
          "Add your pet, fill in feeding, routine, medication and emergency details, then share a care card by link, print or QR code.",
      },
      { property: "og:title", content: "Pet Care Card" },
      {
        property: "og:description",
        content: "Create a complete care card for your pet in two minutes.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { ready, pets, isPremium } = useCareStore();
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const seen = readJson<boolean>(STORAGE_KEYS.onboarded, false);
    if (!seen && pets.length === 0) void navigate({ to: "/onboarding" });
  }, [ready, pets.length, navigate]);

  const handleAddPet = () => {
    if (!isPremium && pets.length >= 1) {
      setPaywallOpen(true);
      return;
    }
    void navigate({ to: "/pets/new" });
  };

  if (!ready) {
    return (
      <AppShell>
        <div className="h-64 animate-pulse rounded-3xl bg-card" aria-label="Loading" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PaywallDialog open={paywallOpen} onOpenChange={setPaywallOpen} />

      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">Your care cards</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Leaving your pet with someone? Give them everything they need to know.
        </p>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={<PawPrint className="size-7" aria-hidden="true" />}
          title="Your pet's care card starts here."
          description="No care cards yet. Create one for your pet before their next stay with a sitter."
          action={
            <Button size="lg" className="h-12 rounded-xl px-6" onClick={handleAddPet}>
              <Plus className="size-4" aria-hidden="true" /> Add Pet
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {pets.map((pet) => (
            <article
              key={pet.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <PetAvatar pet={pet} size={64} />
                <div className="min-w-0">
                  <h2 className="truncate font-display text-2xl font-semibold">{pet.name}</h2>
                  <p className="truncate text-sm text-muted-foreground">
                    {[pet.species, pet.breed, pet.approximateAge].filter(Boolean).join(" · ") ||
                      "Add a few details to complete the card"}
                  </p>
                </div>
              </div>

              <Button asChild size="lg" className="mt-5 h-12 w-full rounded-xl text-base">
                <Link to="/care/$petId" params={{ petId: pet.id }}>
                  View Care Card
                </Link>
              </Button>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <Button asChild variant="secondary" className="h-11 rounded-xl">
                  <Link to="/pets/$petId/edit" params={{ petId: pet.id }}>
                    <Pencil className="size-4" aria-hidden="true" /> Edit
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="h-11 rounded-xl">
                  <Link to="/care/$petId" params={{ petId: pet.id }} hash="share">
                    <Share2 className="size-4" aria-hidden="true" /> Share
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="h-11 rounded-xl">
                  <Link to="/care/$petId/qr" params={{ petId: pet.id }}>
                    <QrCode className="size-4" aria-hidden="true" /> QR
                  </Link>
                </Button>
              </div>
            </article>
          ))}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="h-12 rounded-xl">
              <Link to="/reminders">
                <Bell className="size-4" aria-hidden="true" /> Reminders
              </Link>
            </Button>
            <Button variant="outline" className="h-12 rounded-xl" onClick={handleAddPet}>
              <Plus className="size-4" aria-hidden="true" /> Add Pet
            </Button>
          </div>

          {!isPremium && (
            <Link
              to="/premium"
              className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 px-4 py-4 text-sm transition-colors hover:bg-secondary"
            >
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              <span>
                <span className="font-medium">Unlock Lifetime — $4.99.</span>{" "}
                <span className="text-muted-foreground">
                  Unlimited pets, PDF export, reminders. One payment, no subscription.
                </span>
              </span>
            </Link>
          )}
        </div>
      )}
    </AppShell>
  );
}
