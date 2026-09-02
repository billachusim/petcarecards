import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { MedicationStep } from "@/features/care-card/components/medication-step";
import { useCareStore } from "@/features/pets/hooks/use-care-store";

export const Route = createFileRoute("/pets/$petId/medications")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Medications — Pet Care Card" },
      {
        name: "description",
        content:
          "Record the medication instructions you already have so a caregiver can follow them exactly.",
      },
      { property: "og:title", content: "Medications — Pet Care Card" },
      {
        property: "og:description",
        content: "Organize medication instructions for your pet's caregiver.",
      },
    ],
  }),
  component: MedicationsPage,
});

function MedicationsPage() {
  const { petId } = Route.useParams();
  const navigate = useNavigate();
  const { getPet, ready } = useCareStore();
  const pet = getPet(petId);

  return (
    <AppShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-2 rounded-xl"
        onClick={() => void navigate({ to: "/care/$petId", params: { petId } })}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Button>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        {ready && pet ? `${pet.name}'s medications` : "Medications"}
      </h1>
      {ready && pet ? (
        <MedicationStep petId={petId} />
      ) : (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}
    </AppShell>
  );
}
