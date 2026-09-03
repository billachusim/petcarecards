import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { CareCardView } from "@/features/care-card/components/care-card-view";
import type { CareCard } from "@/features/pets/models";
import { readSharedCard } from "@/features/sharing/shared-card.functions";

export const Route = createFileRoute("/c/$token")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Shared Care Card — Pet Care Card" },
      {
        name: "description",
        content:
          "A pet care card shared by its owner: feeding, routine, medication, emergency contacts and vet details.",
      },
      { property: "og:title", content: "Shared Pet Care Card" },
      {
        property: "og:description",
        content: "Everything a sitter needs to look after this pet, shared by the owner.",
      },
    ],
  }),
  component: SharedCardPage,
});

function SharedCardPage() {
  const { token } = Route.useParams();
  const [state, setState] = useState<{ loading: boolean; card?: CareCard | undefined }>({
    loading: true,
  });

  useEffect(() => {
    let active = true;
    void readSharedCard({ data: { token } })
      .then((result) => {
        if (!active) return;
        setState({ loading: false, card: (result.card?.card as CareCard | undefined) ?? undefined });
      })
      .catch(() => {
        if (active) setState({ loading: false });
      });
    return () => {
      active = false;
    };
  }, [token]);

  if (state.loading) {
    return (
      <AppShell>
        <div className="h-96 animate-pulse rounded-3xl bg-card" aria-label="Loading care card" />
      </AppShell>
    );
  }

  if (!state.card) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-semibold">This link isn&apos;t available.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The owner may have stopped sharing this care card, or the link was copied incorrectly. Ask
          them to send a fresh link.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/">Make your own care card</Link>
        </Button>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <CareCardView card={state.card} />
      <div className="no-print mt-8 rounded-3xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Shared with you by {state.card.pet.name}&apos;s owner. Print this page to keep a paper copy.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="secondary" className="rounded-xl" onClick={() => window.print()}>
            Print
          </Button>
          <Button asChild className="rounded-xl">
            <Link to="/">Create your own</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
